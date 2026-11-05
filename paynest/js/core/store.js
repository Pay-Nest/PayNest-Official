/* Local persistence + session flags. This stands in for a database and an auth service. */
(function () {
  const KEY = PN.config.storeKey, U = PN.u;
  let st;

  const fresh = () => ({ v: 1, user: null, pin: null, balance: 24850.75, txns: [], prefs: { theme: "dark", hideBal: false } });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const load = () => {
    try { st = JSON.parse(localStorage.getItem(KEY)); } catch (e) { st = null; }
    if (!st || st.v !== 1) st = fresh();
    st.prefs = Object.assign({ theme: "dark", hideBal: false }, st.prefs);
  };

  // Fictional people and merchants only.
  const seed = () => {
    const H = 36e5, now = Date.now();
    const rows = [
      ["sent", "Aarav Sharma", "aarav.sharma@paynest", 1250, 2, "success", "Dinner split"],
      ["received", "Priya Nair", "priya.nair@paynest", 3200, 5, "success", "Rent share"],
      ["bill", "Metro Electricity", "metro.power@billpay", 1840.5, 26, "success", "Electricity bill", "electricity"],
      ["sent", "Spice Route Café", "spiceroute@paynest", 480, 29, "failed", "Lunch", null, "Bank server down"],
      ["sent", "Neha Verma", "neha.verma@paynest", 5000, 50, "pending", "Advance"],
      ["received", "Kiran Rao", "kiran.rao@paynest", 750, 74, "success", "Cab share"],
      ["bill", "FiberNet Broadband", "fibernet@billpay", 999, 100, "success", "Broadband", "broadband"],
      ["sent", "Rohan Mehta", "rohan.mehta@paynest", 2000, 125, "refunded", "Concert tickets", null, "Server timeout"],
      ["bill", "Mobile recharge", "recharge@billpay", 299, 150, "success", "Prepaid plan", "mobile"],
      ["sent", "Sana Khan", "sana.khan@paynest", 15000, 190, "failed", "Deposit", null, "Daily limit"],
      ["bill", "City Water Board", "citywater@billpay", 420, 240, "success", "Water bill", "water"],
      ["received", "Dev Patel", "dev.patel@paynest", 1100, 290, "success", "Trip settlement"]
    ];
    return rows.map((r, i) => ({
      id: "TX" + (4820 + rows.length - i), kind: r[0], name: r[1], upi: r[2], amount: r[3],
      ts: now - r[4] * H - (i * 7919 % 50) * 6e4, status: r[5], note: r[6], cat: r[7] || null, reason: r[8] || null,
      ref: String(412300000000 + U.hash(r[1] + i) % 999999999).slice(0, 12)
    }));
  };

  const store = {
    load, save,
    get state() { return st; },
    get user() { return st.user; },
    get prefs() { return st.prefs; },
    setPref(k, v) { st.prefs[k] = v; save(); },
    createUser(p) {
      const handle = (p.name || "user").toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "") || "user";
      st.user = { name: p.name, phone: p.phone, email: p.email || "", upi: handle + "@paynest", created: Date.now() };
      st.pin = p.pin;
      st.balance = 24850.75;
      st.txns = seed();
      save();
    },
    clearUser() { st.user = null; st.pin = null; st.txns = []; save(); },
    wipe() { try { localStorage.removeItem(KEY); } catch (e) {} load(); },
    txns() { return st.txns.slice().sort((a, b) => b.ts - a.ts); },
    find(id) { return st.txns.find(t => t.id === id); }
  };

  // Session helpers: "unlocked" lives only for the tab session, like an app lock.
  const auth = {
    isUnlocked: () => !!U.ss.get("pn.unlocked"),
    unlock: () => U.ss.set("pn.unlocked", "1"),
    lock: () => U.ss.del("pn.unlocked"),
    pending: () => { try { return JSON.parse(U.ss.get("pn.pending") || "null"); } catch (e) { return null; } },
    setPending: p => U.ss.set("pn.pending", JSON.stringify(p)),
    clearPending: () => { U.ss.del("pn.pending"); U.ss.del("pn.verified"); },
    verified: () => U.ss.get("pn.verified"),
    setVerified: p => U.ss.set("pn.verified", p)
  };

  PN.store = store;
  PN.auth = auth;
})();
