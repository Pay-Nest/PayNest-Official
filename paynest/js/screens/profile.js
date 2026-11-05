(function () {
  const { $, esc, maskPhone } = PN.u, I = PN.ui;
  PN.screens.profile = {
    tab: true, depth: 1, guard: PN.priv,
    mount(el) {
      const u = PN.store.user, P = PN.store.prefs;
      const row = (id, ic, t, s, tail) => `<button class="srow${id === "out" || id === "rst" ? " danger" : ""}" data-r="${id}"><span class="ic">${I.icon(ic, 19)}</span><span class="m">${t}${s ? `<small>${s}</small>` : ""}</span>${tail || I.icon("chev", 18)}</button>`;
      const sw = (id, on) => `<label class="sw"><input type="checkbox" id="${id}" ${on ? "checked" : ""}><i></i></label>`;
      el.innerHTML = `<div class="stagger"><div class="pf-top" style="--i:0">${I.avatar(u.name, 84, true)}<h2>${esc(u.name)}</h2><p>${maskPhone(u.phone)}${u.email ? " · " + esc(u.email) : ""}</p><span class="tag t-ok"><i></i>Demo profile</span></div>
        <div class="set" style="--i:1">
          <div class="srow"><span class="ic">${I.icon("moon", 19)}</span><span class="m">Dark mode<small>Easier on the eyes at night</small></span>${sw("dk", P.theme !== "light")}</div>
          <div class="srow"><span class="ic">${I.icon("eyeoff", 19)}</span><span class="m">Hide balance<small>Mask your wallet amount</small></span>${sw("hb", P.hideBal)}</div></div>
        <div class="set" style="--i:2">
          ${row("st", "receipt" in {} ? "bills" : "bills", "Payment status page", "Open the interactive status &amp; receipt demo")}
          ${row("pin", "key", "Change PIN", "")}
          ${row("hp", "help", "Help &amp; support", "")}</div>
        <div class="set" style="--i:3">${row("rst", "reset", "Reset demo data", "Clear everything stored on this device")}${row("out", "logout", "Log out", "", "")}</div>
        <div class="ver" style="--i:4">PayNest demo · v0.1<br>Frontend only. Nothing is sent to a server.</div></div>`;
      $("#dk", el).onchange = e => { PN.store.setPref("theme", e.target.checked ? "dark" : "light"); I.applyTheme(); };
      $("#hb", el).onchange = e => { PN.store.setPref("hideBal", e.target.checked); I.toast(e.target.checked ? "Balance hidden" : "Balance visible"); };
      const A = {
        st: () => { const t = PN.store.txns().find(x => x.status === "failed") || PN.store.txns()[0]; location.href = I.statusUrl(t); },
        pin: () => I.soon("Change PIN", "key"), hp: () => I.soon("Help & support", "help"),
        rst: () => I.confirm("Reset demo data?", "This removes your profile, PIN and settings from this device and restarts the demo from the intro.", "Reset everything", () => {
          PN.store.wipe(); PN.auth.lock(); PN.auth.clearPending(); PN.u.ss.del("pn.splashed"); I.applyTheme(); location.hash = "#/login"; location.reload();
        }, true),
        out: () => I.confirm("Log out?", "You'll need your mobile number and an OTP to log in again.", "Log out", () => {
          PN.store.clearUser(); PN.auth.lock(); PN.auth.clearPending(); PN.router.go("#/login");
        }, true)
      };
      el.querySelectorAll("[data-r]").forEach(b => b.onclick = A[b.dataset.r]);
    }
  };
})();
