/* Hash router with guards, direction-aware transitions and bottom-nav state. */
(function () {
  const { $ } = PN.u;
  const TABS = ["home", "history", "scan", "bills", "profile"];
  let cur = null, curDef = null, cleanup = null, busy = null;

  const parse = () => {
    const raw = (location.hash || "").replace(/^#\/?/, "");
    const [name, q] = raw.split("?");
    const params = {};
    new URLSearchParams(q || "").forEach((v, k) => params[k] = v);
    return { name: name || "", params };
  };
  const home = () => {
    if (!PN.store.user) return "#/login";
    return PN.auth.isUnlocked() ? "#/home" : "#/pin?mode=unlock";
  };
  const go = (path, replace) => {
    if (replace) location.replace(path); else location.hash = path.replace(/^#/, "");
  };

  const render = () => {
    const { name, params } = parse();
    const def = PN.screens[name];
    if (!name || !def) return go(home(), true);
    const redirect = def.guard && def.guard(params);
    if (redirect) return go(redirect, true);

    const key = name + JSON.stringify(params);
    if (key === busy) return; busy = key;

    const app = $("#view"), prev = cur;
    let dir = "fwd";
    if (!prev) dir = "fade";
    else if (def.tab && curDef.tab) dir = "fade";
    else dir = (def.depth || 0) >= (curDef.depth || 0) ? "fwd" : "back";

    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    const el = document.createElement("div");
    el.className = "screen" + (def.tab ? " has-nav" : "") + (def.cls ? " " + def.cls : "") + " enter-" + dir;
    app.appendChild(el);
    cleanup = def.mount(el, params) || null;

    if (prev) {
      prev.classList.remove("enter-fwd", "enter-back", "enter-fade");
      prev.classList.add("leave-" + dir);
      setTimeout(() => prev.remove(), 360);
    }
    cur = el; curDef = def;
    setTimeout(() => el.classList.remove("enter-" + dir), 520);

    const nav = $("#nav");
    nav.classList.toggle("hide", !def.tab);
    nav.querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.r === name));
    PN.ui.closeSheet();
    el.scrollTop = 0;
  };

  PN.router = {
    go, home,
    start() {
      $("#nav").addEventListener("click", e => {
        const b = e.target.closest("button[data-r]"); if (b) go("#/" + b.dataset.r);
      });
      $("#msbd").addEventListener("click", PN.ui.closeSheet);
      window.addEventListener("hashchange", () => { busy = null; render(); });
      render();
    },
    TABS
  };
  window.PN_tabs = TABS;
})();
