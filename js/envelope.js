/* ==========================================================================
   envelope.js — Wax-seal letter
   Toggles the envelope open/closed and swaps the hint text below it.
   The letter's own words live in the HTML (see /letters/love-letter.txt
   for the plain-text source copy).
   ========================================================================== */
(function () {
  const envelope = document.getElementById("envelope");
  const envHint = document.getElementById("envHint");

  envelope.addEventListener("click", function () {
    envelope.classList.toggle("open");
    envHint.textContent = envelope.classList.contains("open")
      ? "A letter from the first month"
      : "Break the seal";
  });
})();
