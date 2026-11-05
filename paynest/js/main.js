/* Boot: load state, apply theme, play the intro once per session, then start the router. */
(function () {
  PN.store.load();
  PN.ui.applyTheme();
  const start = () => PN.router.start();
  if (PN.u.ss.get("pn.splashed")) start();
  else PN.screens.splash.run(() => { PN.u.ss.set("pn.splashed", "1"); start(); });
})();
