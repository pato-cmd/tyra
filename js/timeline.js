/* ==========================================================================
   timeline.js — Scroll reveals
   Fades in `.reveal` elements (section heads, timeline entries) as they
   enter view, reveals the poem line-by-line, and — once the "forever"
   section is reached — hands off to cats.js to deliver the final heart
   and to particles.js for the celebratory heart bursts.
   ========================================================================== */
(function () {
  const poemLines = [...document.querySelectorAll("#poemLines p")];

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) en.target.classList.add("in");
    });
  }, { threshold: 0.18 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  const poemIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      poemLines.forEach(function (line, i) {
        setTimeout(function () { line.classList.add("on"); }, i * 420);
      });
    });
  }, { threshold: 0.35 });
  poemIo.observe(document.getElementById("poem"));

  let delivered = false;
  const finaleIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && !delivered) {
        delivered = true;
        App.cats.deliverHeart();
        const id = setInterval(function () {
          App.particles.heartBurst(innerWidth * (0.2 + Math.random() * 0.6), innerHeight * (0.2 + Math.random() * 0.45), 18);
        }, 900);
        setTimeout(function () { clearInterval(id); }, 8000);
      }
    });
  }, { threshold: 0.45 });
  finaleIo.observe(document.getElementById("forever"));
})();
