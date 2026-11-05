(function () {
  const { $, $$, validPhone, maskPhone, wait } = PN.u, I = PN.ui, K = PN.authKit, D = PN.config.demo;

  PN.screens.otp = {
    depth: 2,
    guard(p) { return validPhone(p.phone || "") ? null : "#/login"; },
    mount(el, p) {
      const signup = p.mode === "signup", N = D.otpLength;
      const boxes = Array.from({ length: N }, (_, i) =>
        `<input inputmode="numeric" autocomplete="${i ? "off" : "one-time-code"}" maxlength="1" aria-label="Digit ${i + 1}">`).join("");
      el.innerHTML = `${K.AURORA}<div class="auth">
        <div class="top"><button class="ib" id="bk" aria-label="Back">${I.icon("back", 20)}</button>
          ${signup ? '<div class="steps" aria-label="Step 2 of 3"><i class="done"></i><i class="on"></i><i></i></div>' : '<span class="demo">Demo</span>'}</div>
        <h1>Verify your<br>number</h1>
        <p class="lead">We sent a ${N}-digit code to <b>${maskPhone(p.phone)}</b>.</p>
        <div class="otp-wrap"><div class="otp" id="otp">${boxes}</div></div>
        <div class="msg" id="msg" aria-live="polite" style="text-align:center;margin-top:16px"></div>
        <button class="btn pri" id="go" disabled><span>Verify</span></button>
        <div class="timer" id="tm"></div>
        <div class="foot"><div class="hint" style="text-align:left">${I.icon("info", 17)}<span>Demo build: enter any ${N} digits to continue.</span></div></div></div>`;

      const wrap = $("#otp", el), ins = $$("input", wrap), btn = $("#go", el), msg = $("#msg", el);
      let busy = false, left = D.resendSeconds, tick;
      const code = () => ins.map(i => i.value).join("");
      const refresh = () => { wrap.classList.remove("bad"); msg.textContent = ""; ins.forEach(i => i.classList.toggle("f", !!i.value)); btn.disabled = code().length !== N || busy; };

      ins.forEach((inp, i) => {
        inp.addEventListener("input", () => {
          inp.value = inp.value.replace(/\D/g, "").slice(-1);
          if (inp.value && i < N - 1) ins[i + 1].focus();
          refresh(); if (code().length === N) submit();
        });
        inp.addEventListener("keydown", e => {
          if (e.key === "Backspace" && !inp.value && i > 0) { ins[i - 1].value = ""; ins[i - 1].focus(); refresh(); }
          if (e.key === "ArrowLeft" && i > 0) ins[i - 1].focus();
          if (e.key === "ArrowRight" && i < N - 1) ins[i + 1].focus();
          if (e.key === "Enter") submit();
        });
        inp.addEventListener("focus", () => inp.select());
        inp.addEventListener("paste", e => {
          const t = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, N);
          if (!t) return; e.preventDefault();
          ins.forEach((x, k) => x.value = t[k] || "");
          ins[Math.min(t.length, N - 1)].focus(); refresh(); if (t.length === N) submit();
        });
      });

      const submit = async () => {
        if (busy || code().length !== N) return;
        busy = true; btn.classList.add("load"); btn.disabled = true; ins.forEach(i => i.blur());
        const r = await PN.api.verifyOtp(p.phone, code());
        btn.classList.remove("load");
        if (!r.ok) {
          busy = false; wrap.classList.add("bad", "shake"); msg.textContent = r.error;
          setTimeout(() => wrap.classList.remove("shake"), 520);
          ins.forEach(i => i.value = ""); ins[0].focus(); refresh(); return;
        }
        wrap.classList.add("good"); msg.className = "msg ok"; msg.textContent = "Number verified";
        PN.auth.setVerified(p.phone);
        await wait(750);
        const u = PN.store.user;
        if (!signup && u && u.phone === p.phone) {
          PN.router.go("#/pin?mode=unlock");
        } else {
          const pend = PN.auth.pending() || {};
          PN.auth.setPending({ phone: p.phone, name: pend.name || "PayNest User", email: pend.email || "", mode: p.mode });
          PN.router.go("#/pin?mode=setup" + (signup ? "&flow=signup" : ""));
        }
      };
      btn.onclick = submit;

      const tm = $("#tm", el);
      const paint = () => {
        if (left > 0) tm.innerHTML = `Resend code in <b>0:${String(left).padStart(2, "0")}</b>`;
        else tm.innerHTML = `Didn't get it? <button class="lnk" id="rs">Resend code</button>`;
        const r = $("#rs", tm); if (r) r.onclick = async () => { await PN.api.sendOtp(p.phone); I.toast("A new code was sent"); left = D.resendSeconds; paint(); };
      };
      paint();
      tick = setInterval(() => { if (left > 0) { left--; paint(); } }, 1000);
      $("#bk", el).onclick = () => PN.router.go(signup ? "#/signup" : "#/login");
      setTimeout(() => ins[0].focus({ preventScroll: true }), 450);
      return () => clearInterval(tick);
    }
  };
})();
