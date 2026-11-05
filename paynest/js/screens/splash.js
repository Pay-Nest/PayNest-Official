/* Animated intro. Plays once per browser session; tap to skip. */
(function () {
  const { $ } = PN.u, I = PN.ui;
  PN.screens.splash = {
    run(done) {
      const root = document.createElement("div");
      root.id = "splash";
      const word = "PayNest".split("").map((c, i) => `<span style="--i:${i}">${c}</span>`).join("");
      root.innerHTML = `<div class="aurora"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div></div>
        <div class="sp-c"><i class="sp-ring"></i><div class="sp-logo">${I.logo(92)}</div>
        <div class="sp-word" aria-label="PayNest">${word}</div><div class="sp-tag">Payments, made simple</div></div>
        <div class="sp-bar"><i></i></div><div class="sp-skip">Tap to skip</div>`;
      $("#app").appendChild(root);
      let ended = false;
      const end = () => {
        if (ended) return; ended = true;
        root.classList.add("out"); done();
        setTimeout(() => root.remove(), 800);
      };
      root.addEventListener("click", end);
      setTimeout(end, 2900);
    }
  };
})();
