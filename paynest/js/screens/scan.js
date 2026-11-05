(function () {
  const I = PN.ui;
  PN.screens.scan = {
    tab: true, depth: 1, cls: "scan", guard: PN.priv,
    mount(el) {
      el.innerHTML = `<div class="ph-h"><h2>Scan &amp; pay</h2><button class="ib" id="fl" aria-label="Torch">${I.icon("flash", 18)}</button></div>
        <div class="vf-wrap stagger"><div class="vf" style="--i:0"><div class="qrg"></div><i class="vf-c a"></i><i class="vf-c b"></i><i class="vf-c c"></i><i class="vf-c d"></i><div class="ln"></div></div>
        <h3 style="--i:1">Point at any QR code</h3><p style="--i:2">Camera access isn't used in this demo. In the full build this opens a live scanner.</p></div>
        <div class="acts"><button class="btn" id="up">${I.icon("image", 19)}<span>Upload QR</span></button><button class="btn" id="id">${I.icon("at", 19)}<span>Enter UPI ID</span></button></div>`;
      el.querySelector("#up").onclick = () => I.soon("Upload a QR image", "image");
      el.querySelector("#id").onclick = () => I.soon("Pay to a UPI ID", "at");
      el.querySelector("#fl").onclick = () => I.toast("Torch isn't available in the demo");
    }
  };
})();
