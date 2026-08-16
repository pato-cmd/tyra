/* ==========================================================================
   loader.js — Intro typewriter effect
   Attaches App.loader.typewrite(), called by app.js once the loading
   screen is dismissed via startExperience().
   ========================================================================== */
(function () {
  const typeLine = document.getElementById("typeLine");
  const phrase = "For My Little Cat — a little universe, just for you.";

  function typewrite() {
    let i = 0;
    typeLine.innerHTML = '<span id="tw"></span><span class="caret"></span>';
    const tw = document.getElementById("tw");
    const tick = setInterval(function () {
      tw.textContent = phrase.slice(0, ++i);
      if (i >= phrase.length) clearInterval(tick);
    }, 46);
  }

  App.loader.typewrite = typewrite;
})();
