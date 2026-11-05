/* PayNest demo — configuration. Everything here is client-side only. */
window.PN = {
  config: {
    storeKey: "paynest.app.v1",
    demo: {
      acceptAnyOtp: true,   // any 6 digits verify. Set false to require otpCode below.
      otpCode: "123456",
      acceptAnyPin: true,   // any 4 digits unlock. Set false to require the PIN that was created.
      otpLength: 6,
      pinLength: 4,
      resendSeconds: 30
    },
    latency: { otp: 900, verify: 800, pin: 400, save: 600 }
  },
  screens: {}
};
