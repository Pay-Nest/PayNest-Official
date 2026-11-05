/* Mock API. Every call resolves after a short delay so the UI shows real loading states.
   When a real backend exists, replace the bodies here and leave the screens untouched. */
(function () {
  const { wait } = PN.u, C = PN.config, D = C.demo, L = C.latency;

  PN.api = {
    async sendOtp(phone) {
      await wait(L.otp);
      return { ok: true, resendIn: D.resendSeconds };
    },
    async verifyOtp(phone, otp) {
      await wait(L.verify);
      const good = D.acceptAnyOtp ? new RegExp("^\\d{" + D.otpLength + "}$").test(otp) : otp === D.otpCode;
      return good ? { ok: true } : { ok: false, error: "That code isn't right. Please try again." };
    },
    async register(profile) {
      await wait(L.save);
      PN.store.createUser(profile);
      return { ok: true, user: PN.store.user };
    },
    async verifyPin(pin) {
      await wait(L.pin);
      const good = D.acceptAnyPin ? new RegExp("^\\d{" + D.pinLength + "}$").test(pin) : pin === PN.store.state.pin;
      return good ? { ok: true } : { ok: false, error: "Incorrect PIN. Try again." };
    },
    async transactions() {
      await wait(250);
      return PN.store.txns();
    },
    async balance() {
      await wait(200);
      return PN.store.state.balance;
    }
  };
})();
