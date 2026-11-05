(function () {
  const { $, esc } = PN.u, I = PN.ui;
  const G = {
    Recharge: [["Mobile", "phone", ["#22c58b", "#2bb7d6"]], ["DTH", "tv", ["#a855f7", "#e879f9"]], ["FASTag", "car", ["#3b82f6", "#7c6cff"]], ["Data card", "wifi", ["#14b8a6", "#22c58b"]]],
    Utilities: [["Electricity", "zap", ["#ffb020", "#ff7a59"]], ["Water", "droplet", ["#2bb7d6", "#3b82f6"]], ["Gas", "flame", ["#ff7a59", "#f43f5e"]], ["Broadband", "wifi", ["#3b82f6", "#7c6cff"]]],
    "Finance & more": [["Credit card", "card", ["#7c6cff", "#a67cff"]], ["Insurance", "shield", ["#22c58b", "#14b8a6"]], ["Loan EMI", "bank", ["#f43f5e", "#fb923c"]], ["Gift cards", "gift", ["#e879f9", "#a855f7"]]]
  };
  PN.screens.bills = {
    tab: true, depth: 1, guard: PN.priv,
    mount(el) {
      const draw = q => {
        let out = "";
        for (const g in G) {
          const rows = G[g].filter(c => c[0].toLowerCase().includes(q));
          if (rows.length) out += `<div class="cat-h">${g}</div><div class="cats">${rows.map(c => `<button data-c="${esc(c[0])}"><span class="qi" style="background:linear-gradient(135deg,${c[2][0]},${c[2][1]})">${I.icon(c[1], 24, 2)}</span>${esc(c[0])}</button>`).join("")}</div>`;
        }
        return out || `<div class="empty"><div class="ei">${I.icon("search", 28)}</div>No billers match “${esc(q)}”.</div>`;
      };
      el.innerHTML = `<div class="sticky"><div class="ph-h"><h2>Recharge &amp; bills</h2></div>
        <label class="search">${I.icon("search", 18)}<input id="q" placeholder="Search billers" autocomplete="off"></label></div>
        <div class="stagger"><div class="cat-h" style="--i:0;margin-top:8px">Upcoming</div>
        <div class="card due" style="--i:1">${I.catIcon("electricity", 46)}<div class="m"><b>Metro Electricity</b><small>₹1,860 · due in 3 days</small></div><button class="btn pri sm" id="pay">Pay now</button></div></div>
        <div id="cats">${draw("")}</div>`;
      const cats = $("#cats", el);
      const bind = () => cats.querySelectorAll("[data-c]").forEach(b => b.onclick = () => I.soon(b.dataset.c + " payments", "bills"));
      bind();
      $("#q", el).addEventListener("input", e => { cats.innerHTML = draw(e.target.value.trim().toLowerCase()); bind(); });
      $("#pay", el).onclick = () => I.soon("Pay electricity bill", "zap");
    }
  };
})();
