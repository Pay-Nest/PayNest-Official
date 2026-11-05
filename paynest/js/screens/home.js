(function () {
  const { $, inr, esc, first, greet } = PN.u, I = PN.ui;
  const priv = () => !PN.store.user ? "#/login" : PN.auth.isUnlocked() ? null : "#/pin?mode=unlock";
  PN.priv = priv;

  PN.screens.home = {
    tab: true, depth: 1, guard: priv,
    mount(el) {
      const u = PN.store.user, hidden = () => PN.store.prefs.hideBal;
      const txns = PN.store.txns();
      const month = txns.filter(t => t.kind !== "received" && (t.status === "success" || t.status === "pending") && Date.now() - t.ts < 30 * 864e5).reduce((s, t) => s + t.amount, 0);
      const bars = [["Jun", 38], ["Jul", 54], ["Aug", 46], ["Sep", 72], ["Oct", 58], ["Now", 84]]
        .map((b, i) => `<div><i class="${i === 5 ? "cur" : ""}" style="--h:${b[1]}%;--i:${i}"></i><span>${b[0]}</span></div>`).join("");
      const QA = [["Send", "up", "#7c6cff", () => I.soon("Send money", "up")], ["Scan", "scan", "#22c58b", () => PN.router.go("#/scan")],
        ["Request", "down", "#2bb7d6", () => I.soon("Request money", "down")], ["Recharge", "phone", "#ff7a59", () => PN.router.go("#/bills")],
        ["Electricity", "zap", "#ffb020", () => PN.router.go("#/bills")], ["DTH", "tv", "#a855f7", () => I.soon("DTH recharge", "tv")],
        ["Cards", "card", "#3b82f6", () => I.soon("Credit card bills", "card")], ["More", "grid", "#9a98b4", () => PN.router.go("#/bills")]];
      el.innerHTML = `<div class="aurora" style="height:420px"><div class="blob b1"></div><div class="blob b2"></div></div>
        <div class="stagger" style="position:relative">
        <div class="home-h" style="--i:0"><button id="av" aria-label="Profile" style="display:flex">${I.avatar(u.name, 44, true)}</button>
          <div class="g"><small>${greet()}</small><b>${esc(first(u.name))}</b></div>
          <button class="ib" id="bell" aria-label="Notifications">${I.icon("bell", 19)}<i class="dotn"></i></button></div>
        <div class="bal" style="--i:1"><small>Wallet balance</small>
          <div class="amt"><span id="amt"></span><button class="eye" id="eye" aria-label="Show or hide balance"></button></div>
          <div class="row"><span class="upi">${esc(u.upi)}</span><button class="add" id="add">+ Add money</button></div></div>
        <div class="qa" style="--i:2">${QA.map((q, i) => `<button data-q="${i}"><span class="qi" style="--c:${q[2]}">${I.icon(q[1], 24)}</span>${q[0]}</button>`).join("")}</div>
        <div class="card ins" style="--i:3"><div class="top"><div><small>Spent in the last 30 days</small><b class="big">${inr(month, 0)}</b></div><span class="tag t-ok"><i></i>On track</span></div><div class="bars">${bars}</div></div>
        <div class="home-sec" style="--i:4"><div class="sec-h"><h3>Recent activity</h3><button class="lnk" id="all">See all</button></div>
          <div class="txl" id="rec">${txns.slice(0, 5).map(I.txRow).join("")}</div></div></div>`;

      const amt = $("#amt", el), eye = $("#eye", el);
      let shown = false;
      const paint = () => { eye.innerHTML = I.icon(hidden() ? "eyeoff" : "eye", 17); };
      const show = animate => {
        if (hidden()) { amt.textContent = "₹ ••••••"; return; }
        if (animate) I.countUp(amt, PN.store.state.balance, v => inr(v)); else amt.textContent = inr(PN.store.state.balance);
      };
      paint(); show(true);
      eye.onclick = () => { PN.store.setPref("hideBal", !hidden()); paint(); show(false); };
      el.querySelectorAll("[data-q]").forEach(b => b.onclick = QA[b.dataset.q][3]);
      $("#add", el).onclick = () => I.soon("Add money", "wallet");
      $("#bell", el).onclick = () => I.soon("Notifications", "bell");
      $("#av", el).onclick = () => PN.router.go("#/profile");
      $("#all", el).onclick = () => PN.router.go("#/history");
      I.bindTx(el);
    }
  };
})();
