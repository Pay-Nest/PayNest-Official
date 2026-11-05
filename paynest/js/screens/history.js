(function () {
  const { $, day } = PN.u, I = PN.ui;
  const F = [["all", "All"], ["sent", "Sent"], ["received", "Received"], ["bill", "Bills"], ["failed", "Failed"], ["pending", "Pending"]];
  const match = (t, f) => f === "all" || t.kind === f || t.status === f;

  PN.screens.history = {
    tab: true, depth: 1, guard: PN.priv,
    mount(el) {
      let f = "all";
      el.innerHTML = `<div class="sticky"><div class="ph-h"><h2>Payment history</h2></div>
        <div class="fchips" id="fc" style="padding-bottom:14px">${F.map(x => `<button class="fchip${x[0] === "all" ? " on" : ""}" data-f="${x[0]}">${x[1]}</button>`).join("")}</div></div>
        <div id="list"></div>`;
      const list = $("#list", el);
      const paint = () => {
        const rows = PN.store.txns().filter(t => match(t, f));
        if (!rows.length) { list.innerHTML = `<div class="empty"><div class="ei">${I.icon("history", 28)}</div>Nothing here yet.<br>Payments that match this filter will show up here.</div>`; return; }
        let out = "", last = "";
        rows.forEach(t => {
          const d = day(t.ts);
          if (d !== last) { out += (last ? "</div>" : "") + `<div class="day">${d}</div><div class="txl">`; last = d; }
          out += I.txRow(t);
        });
        list.innerHTML = out + "</div>";
        I.bindTx(list);
      };
      $("#fc", el).onclick = e => {
        const b = e.target.closest("[data-f]"); if (!b) return;
        f = b.dataset.f; el.querySelectorAll(".fchip").forEach(c => c.classList.toggle("on", c === b)); paint();
      };
      paint();
    }
  };
})();
