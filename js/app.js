/* ==========================================================================
   app.js — Shared namespace + global behavior
   Loads FIRST. Creates window.App with the DOM refs and state that other
   modules (loader.js, particles.js, gallery.js, envelope.js, cats.js,
   timeline.js) read from. Also owns: custom cursor, background music
   control, scroll-driven nav/progress spy, and the "startExperience"
   bootstrap that kicks off the other modules once the loader is dismissed.
   ========================================================================== */
(function () {
  const body = document.body;
  const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
  if (isTouch) body.classList.add("touch-mode");

  // Shared namespace other module files attach to.
  window.App = {
    state: {
      started: false,
      isTouch: isTouch
    },
    dom: {
      body: body,
      loader: document.getElementById("loader"),
      enterBtn: document.getElementById("enterBtn"),
      topnav: document.getElementById("topnav"),
      rail: document.getElementById("rail"),
      musicBtn: document.getElementById("musicBtn"),
      bgm: document.getElementById("bgm"),
      progress: document.getElementById("progress"),
      cursor: document.getElementById("cursor"),
      follow: document.getElementById("cursorFollow"),
      sections: [...document.querySelectorAll("section.chap")]
    },
    // Populated by their respective module files:
    loader: {},
    particles: {},
    cats: {}
  };

  const dom = App.dom;

  setTimeout(function () { dom.enterBtn.classList.add("ready"); }, 3600);

  function startExperience() {
    if (App.state.started) return;
    App.state.started = true;
    dom.loader.classList.add("gone");
    dom.body.classList.remove("is-locked");
    dom.topnav.classList.add("show");
    dom.rail.classList.add("show");
    dom.musicBtn.classList.add("show");
    document.getElementById("walkWrap").classList.add("show");
    playMusic(true);
    App.loader.typewrite();
    App.particles.spawnAmbientHearts();
    App.particles.makeButterflies();
    App.particles.makePetals();
  }
  dom.enterBtn.addEventListener("click", startExperience);

  function playMusic(on) {
    if (on) {
      const p = dom.bgm.play();
      if (p) p.catch(function () {});
      dom.musicBtn.classList.remove("off");
    } else {
      dom.bgm.pause();
      dom.musicBtn.classList.add("off");
    }
  }
  dom.musicBtn.addEventListener("click", function () {
    if (dom.bgm.paused) playMusic(true);
    else playMusic(false);
  });
  dom.bgm.volume = 0.28;

  // Custom cursor (desktop only — hidden via CSS in touch-mode).
  let mx = innerWidth / 2, my = innerHeight / 2, fx = mx, fy = my;
  window.addEventListener("mousemove", function (e) {
    mx = e.clientX; my = e.clientY;
    if (!isTouch) {
      dom.cursor.style.left = mx + "px";
      dom.cursor.style.top = my + "px";
    }
    const t = e.target.closest("a, button, .polaroid, .envelope, .walker");
    dom.follow.classList.toggle("hot", !!t);
  });
  function cursorLoop() {
    fx += (mx - fx) * 0.16;
    fy += (my - fy) * 0.16;
    if (!isTouch) {
      dom.follow.style.left = fx + "px";
      dom.follow.style.top = fy + "px";
    }
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  // Scroll spy: progress bar, active nav link, background sky color, music ducking.
  const skies = [
    { id: "home", c: "#07070F" },
    { id: "gallery", c: "#24180d" },
    { id: "letter", c: "#2a1612" },
    { id: "poem", c: "#1a0b12" },
    { id: "timeline", c: "#10182c" },
    { id: "forever", c: "#050510" }
  ];
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    dom.progress.style.width = p * 100 + "%";
    let current = "home";
    dom.sections.forEach(function (sec) {
      const r = sec.getBoundingClientRect();
      if (r.top < innerHeight * 0.45 && r.bottom > innerHeight * 0.25) {
        current = sec.id;
        dom.body.style.background = sec.getAttribute("data-sky");
      }
    });
    document.querySelectorAll("nav a, .rail a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
    if (!dom.bgm.paused) {
      const target = current === "poem" || current === "forever" ? 0.18 : 0.28;
      dom.bgm.volume += (target - dom.bgm.volume) * 0.05;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
