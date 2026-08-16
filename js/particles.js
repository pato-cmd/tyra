/* ==========================================================================
   particles.js — Background atmosphere
   Owns both canvases (starfield + heart-burst FX), the floating heart
   trail, butterflies and falling petals. Exposes App.particles.heartBurst()
   for cats.js and timeline.js to trigger heart bursts on click / finale.
   ========================================================================== */
(function () {
  const starCanvas = document.getElementById("stars");
  const sctx = starCanvas.getContext("2d");
  const fxCanvas = document.getElementById("fx");
  const fctx = fxCanvas.getContext("2d");
  let stars = [];

  function sizeCanvas() {
    starCanvas.width = fxCanvas.width = innerWidth;
    starCanvas.height = fxCanvas.height = innerHeight;
    stars = Array.from({ length: 140 }, function () {
      return {
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random(),
        s: Math.random() * 0.02 + 0.005
      };
    });
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  function drawStars() {
    sctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    stars.forEach(function (st) {
      st.a += st.s;
      const alpha = 0.25 + Math.abs(Math.sin(st.a)) * 0.75;
      sctx.fillStyle = "rgba(255,248,236," + alpha + ")";
      sctx.beginPath();
      sctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      sctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();

  const bursts = [];
  function heartBurst(x, y, count) {
    for (let i = 0; i < (count || 22); i++) {
      const ang = (Math.PI * 2 * i) / (count || 22) + Math.random() * 0.3;
      const sp = 2 + Math.random() * 4;
      bursts.push({
        x: x, y: y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - 1.4,
        life: 1,
        c: ["#E63946", "#F4C542", "#2563EB", "#fff"][i % 4],
        s: 7 + Math.random() * 8
      });
    }
  }
  function drawFx() {
    fctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.x += b.vx; b.y += b.vy; b.vy += 0.04; b.life -= 0.012;
      if (b.life <= 0) { bursts.splice(i, 1); continue; }
      fctx.globalAlpha = Math.max(b.life, 0);
      fctx.fillStyle = b.c;
      fctx.save();
      fctx.translate(b.x, b.y);
      fctx.scale(b.s / 16, b.s / 16);
      fctx.beginPath();
      fctx.moveTo(0, 4);
      fctx.bezierCurveTo(-10, -6, -16, 8, 0, 16);
      fctx.bezierCurveTo(16, 8, 10, -6, 0, 4);
      fctx.fill();
      fctx.restore();
    }
    fctx.globalAlpha = 1;
    requestAnimationFrame(drawFx);
  }
  drawFx();

  function spawnAmbientHearts() {
    setInterval(function () {
      if (document.hidden) return;
      const el = document.createElement("div");
      el.className = "fheart";
      el.textContent = Math.random() > 0.5 ? "❤" : "♥";
      el.style.left = Math.random() * 100 + "vw";
      el.style.bottom = "-10px";
      el.style.fontSize = 10 + Math.random() * 16 + "px";
      el.style.animationDuration = 8 + Math.random() * 7 + "s";
      el.style.color = ["#E63946", "#F4C542", "#ff8a93"][Math.floor(Math.random() * 3)];
      document.getElementById("floatHearts").appendChild(el);
      setTimeout(function () { el.remove(); }, 16000);
    }, 700);
  }
  window.addEventListener("mousemove", function (e) {
    if (Math.random() > 0.86) {
      const el = document.createElement("div");
      el.className = "fheart";
      el.textContent = "•";
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
      el.style.fontSize = "10px";
      el.style.color = "#F4C542";
      el.style.animationDuration = "3s";
      document.getElementById("floatHearts").appendChild(el);
      setTimeout(function () { el.remove(); }, 3200);
    }
  });

  function makeButterflies() {
    const box = document.getElementById("butterflies");
    ["🦋", "✨", "🦋"].forEach(function (icon, i) {
      const b = document.createElement("div");
      b.className = "bfly";
      b.textContent = icon;
      b.style.animationDelay = i * 5 + "s";
      b.style.animationDuration = 16 + i * 3 + "s";
      box.appendChild(b);
    });
  }
  function makePetals() {
    const box = document.getElementById("petals");
    for (let i = 0; i < 16; i++) {
      const p = document.createElement("div");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 12 + "s";
      p.style.animationDuration = 9 + Math.random() * 8 + "s";
      p.style.background = i % 3 === 0
        ? "radial-gradient(circle at 30% 30%, #ffe08a, #F4C542)"
        : "radial-gradient(circle at 30% 30%, #ff8a93, #E63946)";
      box.appendChild(p);
    }
  }

  App.particles.heartBurst = heartBurst;
  App.particles.spawnAmbientHearts = spawnAmbientHearts;
  App.particles.makeButterflies = makeButterflies;
  App.particles.makePetals = makePetals;
})();
