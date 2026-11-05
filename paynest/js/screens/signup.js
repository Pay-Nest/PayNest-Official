(function () {
  const { $, digits, validPhone } = PN.u, I = PN.ui, K = PN.authKit;

  PN.screens.signup = {
    depth: 1,
    guard() { return PN.store.user && PN.auth.isUnlocked() ? "#/home" : null; },
    mount(el) {
      el.innerHTML = `${K.AURORA}<div class="auth">
        <div class="top"><button class="ib" id="bk" aria-label="Back">${I.icon("back", 20)}</button>
          <div class="steps" aria-label="Step 1 of 3"><i class="on"></i><i></i><i></i></div></div>
        <h1>Create your<br>PayNest account</h1>
        <p class="lead">Just a few details to get started. It takes under a minute.</p>
        <div class="gap">
          <label class="fld" id="fn"><input id="name" autocomplete="name" placeholder=" " maxlength="40"><span>Full name</span></label>
          <div><label class="lbl" for="ph">Mobile number</label>
            <div class="ph" id="phw"><span class="cc">+91</span><input id="ph" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="98765 43210" maxlength="11"></div>
            <div class="msg" id="pm" style="min-height:0;margin-top:6px"></div></div>
          <label class="fld" id="fe"><input id="mail" type="email" autocomplete="email" placeholder=" "><span>Email (optional)</span></label>
          <label class="chk" id="tw"><input type="checkbox" id="terms"><i>${I.icon("check", 14, 3)}</i>
            <span>I agree to the Terms of Use and Privacy Policy. This is a demo, so no real account is created.</span></label>
        </div>
        <div class="msg" id="msg" aria-live="polite" style="margin-top:14px"></div>
        <button class="btn pri" id="go" disabled><span>Continue</span></button>
        <div class="foot">Already have an account? <button class="lnk" id="in">Log in</button></div></div>`;

      const name = $("#name", el), mail = $("#mail", el), terms = $("#terms", el), btn = $("#go", el), msg = $("#msg", el);
      let phone = "", phOk = false;
      const nameOk = () => name.value.trim().length >= 2 && /[a-zA-Z]/.test(name.value);
      const mailOk = () => !mail.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim());
      const refresh = () => {
        $("#fe", el).classList.toggle("err", !mailOk());
        msg.textContent = !mailOk() ? "That email address doesn't look right." : "";
        btn.disabled = !(nameOk() && phOk && mailOk() && terms.checked);
      };
      K.bindPhone($("#ph", el), $("#phw", el), $("#pm", el), (ok, d) => { phOk = ok; phone = d; refresh(); });
      [name, mail, terms].forEach(x => x.addEventListener("input", refresh));
      terms.addEventListener("change", refresh);

      const submit = async () => {
        if (btn.disabled) return;
        btn.classList.add("load"); btn.disabled = true;
        await PN.api.sendOtp(phone);
        PN.auth.setPending({ phone, name: name.value.trim(), email: mail.value.trim(), mode: "signup" });
        PN.router.go("#/otp?phone=" + phone + "&mode=signup");
      };
      btn.onclick = submit;
      el.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "checkbox") submit(); });
      $("#bk", el).onclick = $("#in", el).onclick = () => PN.router.go("#/login");
    }
  };
})();
