/*
 * ANIMATIONS AU DÉFILEMENT
 * Apparitions, titres mot à mot, photos en rideau, parallaxe, bandeau défilant,
 * compteur de la note, frise qui se trace, barre de progression.
 * Tout est désactivé si le visiteur a demandé « réduire les animations ».
 */
(function () {
  "use strict";

  var api = { refresh: function () {}, dishes: function () {} };
  window.JajaMotion = api;

  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) { root.classList.remove("motion"); return; }
  root.classList.add("motion");

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- Apparitions ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add("is-in");
      io.unobserve(el);
      if (el._onIn) el._onIn();
      // une fois apparu, on retire le délai pour que les survols restent vifs
      setTimeout(function () { el.style.setProperty("--d", "0s"); }, 1800);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });

  function watch(el, cls, delay) {
    if (el._m) return;
    el._m = true;
    if (cls) el.classList.add(cls);
    if (delay) el.style.setProperty("--d", delay + "ms");
    io.observe(el);
  }

  /* Titres découpés mot à mot (refait après un changement de langue) */
  function split(el) {
    var text = el.textContent.trim().replace(/\s+/g, " ");
    if (el._split === text && el.querySelector(".w")) return;
    el.innerHTML = text.split(" ").map(function (w, i) {
      return '<span class="w"><span style="--i:' + i + '">' + esc(w) + "</span></span>";
    }).join(" ");
    el._split = text;
    watch(el, "split");
  }

  /* Compteur (note et nombre d'avis) */
  function countUp(el) {
    var txt = el.textContent;
    var isRating = el.classList.contains("js-rating");
    var target = isRating ? parseFloat(txt.replace(",", ".")) : parseInt(txt.replace(/\D/g, ""), 10);
    if (!target) return;
    var comma = txt.indexOf(",") !== -1;
    var start = null, dur = 1600;
    function frame(t) {
      if (!start) start = t;
      var p = clamp((t - start) / dur, 0, 1);
      var v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = isRating
        ? (p < 1 ? v.toFixed(1) : String(target)).replace(".", comma ? "," : ".")
        : Math.round(v).toLocaleString(root.lang || "fr");
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var parallax = [];

  api.refresh = function () {
    $$(".h2, .page-hero h1").forEach(split);

    $$(".eyebrow").forEach(function (el) {
      if (el.closest(".hero, .section-head--center")) return;
      el.classList.add("eyebrow--line");
      watch(el, "reveal");
    });

    $$(".maison__text > p, .vins__intro, .teaser__box > p:not(.eyebrow), .teaser__box .btn, .story-intro .lead, .story-intro p, " +
       ".carte__tabs, .carte__filters, .carte__legal, .infos__addr, .infos__open, .infos__cta, .avis__nav, .avis__links, " +
       ".avis__big, .avis__count, .cta-band .hero__cta, .footer__grid > *").forEach(function (el) { watch(el, "reveal"); });

    // groupes en cascade
    [".sig-grid", ".moments", ".hours", ".infos__list", ".vins__cols", ".valeurs__grid", ".sourcing__grid", ".equipe__grid", "#avisTrack"].forEach(function (sel) {
      $$(sel).forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) {
          var isMask = child.matches(".sig");
          watch(child, isMask ? "mask" : "reveal", i * 90);
        });
      });
    });

    // photos en rideau
    $$(".maison__photo, .tl figure, .membre__photo, .infos__map").forEach(function (el, i) { watch(el, "mask", el.matches(".maison__photo--b") ? 180 : 0); });
    $$(".galerie .g").forEach(function (el, i) { watch(el, "mask", (i % 4) * 110); });
    $$(".tl > div").forEach(function (el) { watch(el, "reveal", 120); });
    $$(".tl").forEach(function (el) { watch(el, ""); });

    // compteur
    var score = $(".avis__score");
    if (score && !score._onIn) {
      score._onIn = function () { $$(".js-rating, .js-count", score).forEach(countUp); };
      watch(score, "");
    }

    // parallaxe : [élément à déplacer, référence, amplitude]
    parallax = [];
    $$(".maison__photo--a img").forEach(function (img) { parallax.push([img, img.parentNode, 0.08]); });
    $$(".maison__photo--b img").forEach(function (img) { parallax.push([img, img.parentNode, 0.12]); });
    $$(".tl figure img").forEach(function (img) { parallax.push([img, img.parentNode, 0.08]); });
    $$(".teaser__img").forEach(function (img) { parallax.push([img, img.parentNode, 0.1]); });

    measureBand();
    update();
  };

  api.dishes = function (board) {
    $$(".carte__cat-title, .carte__cat-note, .dish, .carte__empty", board).forEach(function (el, i) {
      el.style.setProperty("--i", Math.min(i, 14));
    });
  };

  /* ---------- Barre de progression ---------- */
  var bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  /* ---------- Bandeau défilant ---------- */
  // Chaque ligne avance doucement toute seule et accélère avec le défilement.
  var rows = $$(".band__row").map(function (row) {
    return { el: row, dir: parseFloat(row.dataset.dir) || -1, x: 0, w: 0 };
  });
  var boost = 0, bandVisible = false, bandLast = 0;

  function measureBand() {
    rows.forEach(function (r) {
      var set = $(".band__set:not(.is-clone)", r.el);
      if (!set) return;
      $$(".is-clone", r.el).forEach(function (c) { c.remove(); });
      r.w = set.offsetWidth;
      // assez de copies pour couvrir l'écran pendant la boucle
      var copies = Math.max(2, Math.ceil(window.innerWidth / Math.max(r.w, 1)) + 1);
      for (var i = 0; i < copies; i++) {
        var c = set.cloneNode(true);
        c.classList.add("is-clone");
        $$("[data-i18n]", c).forEach(function (n) { n.removeAttribute("data-i18n"); });
        r.el.appendChild(c);
      }
      if (r.dir > 0 && !r.x) r.x = -r.w;
    });
  }

  function bandFrame(t) {
    if (!bandVisible) { bandLast = 0; return; }
    var dt = bandLast ? Math.min(t - bandLast, 64) : 16;
    bandLast = t;
    boost *= 0.92;
    var speed = 0.045 * dt + boost;
    rows.forEach(function (r) {
      if (!r.w) return;
      r.x += r.dir * speed;
      if (r.x <= -r.w) r.x += r.w;
      if (r.x > 0) r.x -= r.w;
      r.el.style.transform = "translate3d(" + r.x.toFixed(2) + "px,0,0)";
    });
    requestAnimationFrame(bandFrame);
  }

  var bandEl = $(".band");
  if (bandEl) {
    new IntersectionObserver(function (entries) {
      bandVisible = entries[0].isIntersecting;
      if (bandVisible) requestAnimationFrame(bandFrame);
    }).observe(bandEl);
  }

  /* ---------- Boucle de défilement ---------- */
  var nav = $("#nav");
  var hero = $(".hero, .page-hero");
  var heroImg = hero && $(".hero__img, .page-hero > img", hero);
  var heroInner = hero && $(".hero__inner, .page-hero .wrap", hero);
  var heroCue = $(".hero__scroll");
  var tlList = $(".timeline ol");
  var lastY = window.scrollY;
  var prevY = lastY;
  var ticking = false;

  function update() {
    ticking = false;
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";

    // la barre de navigation se cache en descendant, revient en remontant
    if (nav) {
      var menuOpen = nav.classList.contains("menu-open");
      if (!menuOpen && y > 320 && y > lastY + 4) nav.classList.add("is-hidden");
      else if (y < lastY - 4 || y < 320 || menuOpen) nav.classList.remove("is-hidden");
    }
    lastY = y;

    if (hero) {
      var h = hero.offsetHeight;
      if (y < h) {
        var p = y / h;
        if (heroImg) heroImg.style.translate = "0 " + (y * 0.35).toFixed(1) + "px";
        if (heroInner) {
          heroInner.style.translate = "0 " + (y * 0.18).toFixed(1) + "px";
          heroInner.style.opacity = clamp(1 - p * 1.5, 0, 1).toFixed(3);
        }
        if (heroCue) heroCue.style.opacity = clamp(1 - p * 4, 0, 1).toFixed(3);
      }
    }

    parallax.forEach(function (it) {
      var r = it[1].getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var off = clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1);
      it[0].style.translate = "0 " + (-off * it[2] * r.height).toFixed(1) + "px";
    });

    if (tlList) {
      var tr = tlList.getBoundingClientRect();
      tlList.style.setProperty("--tl", clamp((vh * 0.6 - tr.top) / tr.height, 0, 1).toFixed(4));
    }

    boost = Math.min(boost + Math.abs(y - prevY) * 0.06, 14);
    prevY = y;
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { measureBand(); onScroll(); });
  window.addEventListener("load", function () { measureBand(); update(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureBand);
})();
