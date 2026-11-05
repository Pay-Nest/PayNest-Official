(function () {
  const { $, digits, validPhone, fmtPhone, ss } = PN.u, I = PN.ui;

  const AURORA = '<div class="aurora"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div></div>';

  /* Shared by login and sign-up: formats as "98765 43210" and validates Indian mobile numbers. */
  const bindPhone = (input, wrap, msg, onChange) => {
    const check = () => {
      const d = digits(input.value).slice(0, 10);
      input.value = fmtPhone(d);
      let err = "";
      if (d.length && !/^[6-9]/.test(d)) err = "Indian mobile numbers start with 6, 7, 8 or 9.";
      else if (d.length === 10 && !validPhone(d)) err = "Enter a valid 10-digit mobile number.";
      const ok = validPhone(d);
      wrap.classList.toggle("err", !!err); wrap.classList.toggle("ok", ok);
      msg.textContent = err; msg.className = "msg";
      onChange(ok, d);
    };
    input.addEventListener("input", check);
    return check;
  };
  PN.authKit = { AURORA, bindPhone };

  PN.screens.login = {
    depth: 0,
    guard() { return PN.store.user && PN.auth.isUnlocked() ? "#/home" : null; },
    mount(el) {
      el.innerHTML = `${AURORA}<div class="auth">
        <div class="top"><div class="brand">${I.logo(38)}PayNest</div><span class="demo">Demo</span></div>
        <h1>Welcome back.<br>Let's get you in.</h1>
        <p class="lead">Enter your mobile number. We'll send a one-time password to verify it's you.</p>
        <label class="lbl" for="ph">Mobile number</label>
        <div class="ph" id="phw"><span class="cc">+91</span><input id="ph" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="98765 43210" maxlength="11"></div>
        <div class="msg" id="msg" aria-live="polite"></div>
        <button class="btn pri" id="go" disabled><span>Get OTP</span></button>
        <div class="perks">
          <div class="perk"><span class="pi">${I.icon("shield", 19)}</span>Bank-grade protection on every payment</div>
          <div class="perk"><span class="pi">${I.icon("zap", 19)}</span>Pay, recharge and settle bills in seconds</div>
        </div>
        <div class="foot"><div class="hint" style="text-align:left;margin-bottom:18px">${I.icon("info", 17)}<span>Demo build: any 10-digit number starting 6–9 works. Nothing is sent to a server.</span></div>
          New to PayNest? <button class="lnk" id="new">Create account</button></div></div>`;
      const input = $("#ph", el), btn = $("#go", el);
      let phone = "";
      bindPhone(input, $("#phw", el), $("#msg", el), (ok, d) => { btn.disabled = !ok; phone = d; });
      const submit = async () => {
        if (btn.disabled) return;
        btn.classList.add("load"); btn.disabled = true;
        await PN.api.sendOtp(phone);
        PN.auth.setPending({ phone, mode: "login" });
        PN.router.go("#/otp?phone=" + phone + "&mode=login");
      };
      btn.onclick = submit;
      input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
      $("#new", el).onclick = () => PN.router.go("#/signup");
      setTimeout(() => input.focus({ preventScroll: true }), 450);
    }
  };
})();
