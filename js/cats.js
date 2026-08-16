/* ==========================================================================
   cats.js — The walking kitten
   Moves the kitten back and forth along the bottom of the screen, leaves
   paw prints, meows on tap (5 taps unlocks the secret card), and walks to
   center stage to deliver the final heart. Exposes App.cats.deliverHeart()
   for timeline.js to call once the "forever" section is reached.
   ========================================================================== */
(function () {
  const walker = document.getElementById("walker");
  const paws = document.getElementById("paws");
  const heartGift = document.getElementById("heartGift");
  const secret = document.getElementById("secret");
  const isTouch = App.state.isTouch;

  let catX = 40, catDir = 1, paused = false;
  function moveCat() {
    if (!App.state.started) return requestAnimationFrame(moveCat);
    if (!paused && !walker.classList.contains("delivering")) {
      catX += catDir * 0.7;
      if (catX > innerWidth - 90) { catDir = -1; walker.classList.add("flip"); }
      if (catX < 10) { catDir = 1; walker.classList.remove("flip"); }
      walker.style.left = catX + "px";
    }
    requestAnimationFrame(moveCat);
  }
  moveCat();

  setInterval(function () {
    if (!App.state.started || paused) return;
    const paw = document.createElement("div");
    paw.className = "paw";
    paw.style.left = (catX + (catDir > 0 ? 18 : 48)) + "px";
    paw.style.top = (innerHeight - (isTouch ? 92 : 28)) + "px";
    paw.innerHTML = '<svg viewBox="0 0 24 24" fill="#E63946" opacity="0.55"><circle cx="8" cy="7" r="3"/><circle cx="16" cy="7" r="3"/><circle cx="5" cy="13" r="2.4"/><circle cx="19" cy="13" r="2.4"/><ellipse cx="12" cy="16" rx="5" ry="4.2"/></svg>';
    paws.appendChild(paw);
    setTimeout(function () { paw.remove(); }, 3200);
  }, 420);

  function deliverHeart() {
    paused = true;
    walker.classList.add("delivering");
    walker.classList.remove("flip");
    walker.style.left = "calc(50% - 39px)";
    setTimeout(function () {
      heartGift.classList.add("show");
      App.particles.heartBurst(innerWidth / 2, innerHeight - 140, 28);
    }, 2800);
  }

  let taps = 0, tapTimer;
  walker.addEventListener("click", function (e) {
    e.stopPropagation();
    taps += 1;
    App.particles.heartBurst(e.clientX, e.clientY, 10);
    meow();
    clearTimeout(tapTimer);
    tapTimer = setTimeout(function () { taps = 0; }, 2600);
    if (taps >= 5) {
      taps = 0;
      secret.classList.add("show");
    }
  });
  document.getElementById("closeSecret").addEventListener("click", function () {
    secret.classList.remove("show");
  });

  function meow() {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(780, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(420, ac.currentTime + 0.18);
      o.frequency.exponentialRampToValueAtTime(640, ac.currentTime + 0.32);
      g.gain.setValueAtTime(0.0001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.08, ac.currentTime + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.38);
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + 0.4);
    } catch (err) {}
  }

  App.cats.deliverHeart = deliverHeart;
})();
