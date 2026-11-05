(function () {
  const { $, $$, wait, first } = PN.u, I = PN.ui, K = PN.authKit, N = PN.config.demo.pinLength;

  PN.screens.pin = {
    depth: 3,
    guard(p) {
      const u = PN.store.user, un = PN.auth.isUnlocked();
      if (p.mode === "unlock") return !u ? "#/login" : un ? "#/home" : null;
      if (p.mode === "setup") return PN.auth.verified() && PN.auth.pending() ? null : "#/login";
      return "#/login";
    },
    mount(el, p) {
      const unlock = p.mode === "unlock", signup = p.flow === "signup";
      const u = PN.store.user;
      let stage = 0, first1 = "", val = "", busy = false;
      const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-k="${n}" aria-label="${n}">${n}</button>`).join("");
      el.innerHTML = `${K.AURORA}<div class="pinp">
        <div class="top">${unlock ? "<span></span>" : `<button class="ib" id="bk" aria-label="Back">${I.icon("back", 20)}</button>`}
          ${signup ? '<div class="steps" aria-label="Step 3 of 3"><i class="done"></i><i class="done"></i><i class="on"></i></div>' : '<span class="demo">Demo</span>'}</div>
        <div class="ph-t">${unlock ? I.avatar(u.name, 64, true) : `<span class="logo" style="width:64px;height:64px;border-radius:22px;color:#fff">${I.icon("lock", 28)}</span>`}
          <h1 id="ti"></h1><p id="su"></p></div>
        <div class="dots" id="dots">${Array(N).fill("<i></i>").join("")}</div>
        <div class="msg" id="msg" aria-live="polite"></div>
        <div class="kp">${keys}<button class="ghost" disabled aria-hidden="true"></button><button data-k="0" aria-label="0">0</button><button data-k="del" class="ghost" aria-label="Delete">${I.icon("backspace", 24)}</button></div>
        ${unlock ? '<div class="pf"><button class="lnk" id="fg">Forgot PIN?</button></div>' : ""}</div>`;

      const dots = $$("#dots i", el), msg = $("#msg", el), box = $("#dots", el);
      const text = () => {
        if (unlock) { $("#ti", el).textContent = "Welcome back, " + first(u.name); $("#su", el).textContent = "Enter your " + N + "-digit PIN to unlock."; }
        else if (stage === 0) { $("#ti", el).textContent = "Create your PIN"; $("#su", el).textContent = "You'll use this " + N + "-digit PIN to unlock PayNest and approve payments."; }
        else { $("#ti", el).textContent = "Confirm your PIN"; $("#su", el).textContent = "Enter the same PIN once more."; }
      };
      const paint = () => dots.forEach((d, i) => d.classList.toggle("on", i < val.length));
      const fail = async m => {
        busy = true; msg.textContent = m; box.classList.add("shake");
        if (navigator.vibrate) try { navigator.vibrate(120); } catch (e) {}
        await wait(520); box.classList.remove("shake"); val = ""; paint(); busy = false;
      };
      const done = async () => {
        busy = true;
        if (unlock) {
          const r = await PN.api.verifyPin(val);
          if (!r.ok) { await fail(r.error); return; }
          box.classList.add("good"); PN.auth.unlock(); await wait(380);
          const n = p.next ? decodeURIComponent(p.next) : "";
          PN.router.go(n && n.startsWith("#/") ? n : "#/home"); return;
        }
        if (stage === 0) { first1 = val; await wait(220); stage = 1; val = ""; paint(); text(); busy = false; return; }
        if (val !== first1) { stage = 0; first1 = ""; text(); await fail("The PINs didn't match. Let's start again."); text(); return; }
        box.classList.add("good");
        const pend = PN.auth.pending();
        await PN.api.register({ name: pend.name, phone: pend.phone, email: pend.email, pin: val });
        PN.auth.unlock(); PN.auth.clearPending(); await wait(380);
        PN.router.go("#/home");
      };
      const press = k => {
        if (busy) return; msg.textContent = "";
        if (k === "del") val = val.slice(0, -1);
        else if (val.length < N) val += k;
        paint(); if (val.length === N) done();
      };
      el.addEventListener("click", e => { const b = e.target.closest("[data-k]"); if (b) press(b.dataset.k); });
      const onKey = e => {
        if (/^\d$/.test(e.key)) press(e.key); else if (e.key === "Backspace") press("del");
      };
      document.addEventListener("keydown", onKey);

      const fg = $("#fg", el);
      if (fg) fg.onclick = () => I.confirm("Reset your PIN?", "For security you'll log in again with your mobile number and OTP, then set a new PIN. Demo data on this device will be cleared.", "Reset and log in", () => {
        PN.store.clearUser(); PN.auth.lock(); PN.auth.clearPending(); PN.router.go("#/login");
      }, true);
      const bk = $("#bk", el); if (bk) bk.onclick = () => PN.router.go(signup ? "#/signup" : "#/login");
      text();
      return () => document.removeEventListener("keydown", onKey);
    }
  };
})();
