/* Shared UI helpers: icons, logo, avatars, toast, sheets, ripple, transaction rows. */
(function () {
  const { $, esc, inr, hash, initials, time } = PN.u;

  const P = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    history: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    scan: '<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3"/><path d="M4 12h16"/>',
    bills: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    bell: '<path d="M6 16v-5a6 6 0 0112 0v5l2 2H4z"/><path d="M10 21h4"/>',
    up: '<path d="M7 17L17 7M8 7h9v9"/>',
    down: '<path d="M17 7L7 17M16 17H7V8"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18h2"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    droplet: '<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z"/>',
    flame: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
    wifi: '<path d="M2 9a15 15 0 0120 0M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0"/><circle cx="12" cy="19.5" r=".8"/>',
    car: '<path d="M5 16v-5l2-5h10l2 5v5"/><path d="M3 16h18v3H3z"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8c-2 0-4-1-4-2.5S10 3 12 8zM12 8c2 0 4-1 4-2.5S14 3 12 8z"/>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
    moon: '<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
    logout: '<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
    backspace: '<path d="M21 5H9l-6 7 6 7h12z"/><path d="M12 9l5 6M17 9l-5 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0112 5c6 0 10 7 10 7a17 17 0 01-3 3.8M6.5 7C3.8 8.8 2 12 2 12s4 7 10 7c1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 004.2 4.2"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    bank: '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
    at: '<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-3.5 7"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.5"/><path d="M21 16l-5-5-9 9"/>',
    reset: '<path d="M4 12a8 8 0 108-8 8 8 0 00-6 2.7M4 4v4h4"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17h.01"/>',
    wallet: '<path d="M4 7a2 2 0 012-2h11v3"/><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M16 13.5h2"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
    flash: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    home2: '<path d="M4 20V10l8-6 8 6v10z"/>'
  };

  const icon = (n, s = 22, sw = 1.8) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;

  const logo = (s = 40) =>
    `<span class="logo" style="width:${s}px;height:${s}px;border-radius:${Math.round(s * .32)}px"><svg viewBox="0 0 24 24" width="${Math.round(s * .56)}" height="${Math.round(s * .56)}" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M8.5 19V6h5a3.8 3.8 0 010 7.6H8.5"/></svg></span>`;

  const GRAD = [["#7c6cff", "#a67cff"], ["#ff7a59", "#ff4d8d"], ["#22c58b", "#2bb7d6"], ["#ffb020", "#ff7a59"], ["#3b82f6", "#7c6cff"], ["#e879f9", "#a855f7"], ["#14b8a6", "#22c58b"], ["#f43f5e", "#fb923c"]];
  const avatar = (name, s = 40, circle = false) => {
    const g = GRAD[hash(name) % GRAD.length];
    return `<span class="avt${circle ? " circle" : ""}" style="--s:${s}px;background:linear-gradient(135deg,${g[0]},${g[1]})">${esc(initials(name))}</span>`;
  };

  const CATS = {
    electricity: ["zap", ["#ffb020", "#ff7a59"]], broadband: ["wifi", ["#3b82f6", "#7c6cff"]],
    mobile: ["phone", ["#22c58b", "#2bb7d6"]], water: ["droplet", ["#2bb7d6", "#3b82f6"]],
    gas: ["flame", ["#ff7a59", "#f43f5e"]], dth: ["tv", ["#a855f7", "#e879f9"]]
  };
  const catIcon = (cat, s = 42) => {
    const c = CATS[cat] || ["bills", ["#7c6cff", "#a67cff"]];
    return `<span class="avt" style="--s:${s}px;background:linear-gradient(135deg,${c[1][0]},${c[1][1]})">${icon(c[0], Math.round(s * .5), 2)}</span>`;
  };

  /* toast */
  let tt;
  const toast = msg => {
    const el = $("#toast"); if (!el) return;
    el.textContent = msg; el.classList.add("on");
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove("on"), 2200);
  };

  /* bottom sheet */
  const sheet = html => {
    const s = $("#msheet"), b = $("#msbd");
    s.innerHTML = `<div class="grab"></div>${html}`;
    s.classList.add("on"); b.classList.add("on");
    return s;
  };
  const closeSheet = () => { $("#msheet").classList.remove("on"); $("#msbd").classList.remove("on"); };
  const soon = (title, ic = "flash") => {
    const s = sheet(`<div class="soon"><div class="si">${icon(ic, 30, 1.8)}</div><span class="pill">Coming in the next build</span>
      <h4>${esc(title)}</h4><p class="sub">This screen isn't part of the first trial version. The flow, layout and animations will follow the same design as the rest of the app.</p>
      <button class="btn pri" data-close>Got it</button></div>`);
    s.querySelector("[data-close]").onclick = closeSheet;
  };
  const confirm = (title, text, label, onYes, danger) => {
    const s = sheet(`<h4>${esc(title)}</h4><p class="sub">${esc(text)}</p>
      <div style="display:grid;gap:10px"><button class="btn pri" data-y style="${danger ? "background:var(--fail);box-shadow:none" : ""}">${esc(label)}</button><button class="btn" data-n>Cancel</button></div>`);
    s.querySelector("[data-n]").onclick = closeSheet;
    s.querySelector("[data-y]").onclick = () => { closeSheet(); onYes(); };
  };

  /* ripple on primary buttons */
  document.addEventListener("pointerdown", e => {
    const b = e.target.closest && e.target.closest(".btn.pri");
    if (!b || b.disabled) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) / 4;
    const i = document.createElement("i"); i.className = "rip";
    i.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(i); setTimeout(() => i.remove(), 650);
  });

  const countUp = (el, to, fmt, ms = 900) => {
    const t0 = performance.now();
    const step = t => {
      const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const applyTheme = () => {
    const t = PN.store.prefs.theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = t === "light" ? "#f3f2f9" : "#0b0a12";
  };

  /* transaction row + link into the payment status page */
  const STATUS = {
    success: ["t-ok", "Paid"], failed: ["t-fail", "Failed"], pending: ["t-wait", "Pending"], refunded: ["t-info", "Refunded"]
  };
  const statusUrl = t => {
    const preset = t.status === "success" ? "Success" : t.status === "pending" ? "Pending" : t.status === "refunded" ? "Refunded" : (t.reason || "Server timeout");
    const u = PN.store.user || { name: "You", upi: "you@paynest" };
    const q = PN.u.qs({
      app: 1, preset, to: t.name, upi: t.upi, amount: t.amount, ref: t.ref, ts: t.ts, from: u.name, fromUpi: u.upi, id: t.id
    });
    return "status.html?" + q + "#present";
  };
  const txRow = t => {
    const st = STATUS[t.status], recv = t.kind === "received";
    const tag = recv && t.status === "success" ? ["t-ok", "Received"] : st;
    const lead = t.kind === "bill" ? catIcon(t.cat) : avatar(t.name, 42);
    const sign = t.status === "success" ? (recv ? "+" : "−") : "";
    return `<button class="tx" data-tx="${esc(t.id)}">${lead}<span class="m"><b>${esc(t.name)}</b><small>${esc(time(t.ts))} · ${esc(t.note)}</small></span>
      <span class="a"><b class="${recv && t.status === "success" ? "in" : ""}">${sign}${inr(t.amount, t.amount % 1 ? 2 : 0)}</b><span class="tag ${tag[0]}"><i></i>${tag[1]}</span></span></button>`;
  };
  const bindTx = root => root.querySelectorAll("[data-tx]").forEach(b => {
    b.onclick = () => { const t = PN.store.find(b.dataset.tx); if (t) location.href = statusUrl(t); };
  });

  PN.ui = { icon, logo, avatar, catIcon, toast, sheet, closeSheet, soon, confirm, countUp, applyTheme, txRow, bindTx, statusUrl };
})();
