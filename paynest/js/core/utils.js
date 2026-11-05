(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const inr = (n, d = 2) => "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
  const digits = s => String(s || "").replace(/\D/g, "");
  const validPhone = p => /^[6-9]\d{9}$/.test(p);
  const fmtPhone = d => (d.length > 5 ? d.slice(0, 5) + " " + d.slice(5) : d);
  const maskPhone = d => "+91 " + d.slice(0, 2) + "••• ••" + d.slice(-3);
  const hash = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const initials = n => String(n).trim().split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "?";
  const first = n => String(n).trim().split(/\s+/)[0] || "there";
  const day = ts => {
    const d = new Date(ts), t = new Date();
    const s = x => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const diff = Math.round((s(t) - s(d)) / 864e5);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };
  const time = ts => new Date(ts).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const greet = () => { const h = new Date().getHours(); return h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const ss = {
    get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: k => { try { sessionStorage.removeItem(k); } catch (e) {} }
  };
  const qs = o => Object.keys(o).filter(k => o[k] != null && o[k] !== "").map(k => encodeURIComponent(k) + "=" + encodeURIComponent(o[k])).join("&");
  PN.u = { $, $$, esc, wait, inr, digits, validPhone, fmtPhone, maskPhone, hash, initials, first, day, time, greet, ss, qs };
})();
