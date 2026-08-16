/* ==========================================================================
   gallery.js — Polaroid gallery
   Tilt-on-hover interaction for the [data-tilt] polaroid cards.
   ========================================================================== */
(function () {
  document.querySelectorAll("[data-tilt]").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "rotateX(" + (-y * 12) + "deg) rotateY(" + (x * 14) + "deg) translateY(-8px) scale(1.03)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });
})();
