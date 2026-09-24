(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var I18N = window.I18N || { en: {}, ui: {} };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- Langue ---------------- */
  var params = new URLSearchParams(location.search);
  var lang = params.get("lang") || store("jaja-lang") || ((navigator.language || "fr").slice(0, 2) === "fr" ? "fr" : "en");
  if (lang !== "fr" && lang !== "en") lang = "fr";
  var ui = function () { return I18N.ui[lang]; };
  var tr = function (obj) { return obj ? (obj[lang] || obj.fr || "") : ""; };
  var fmtPrice = function (n) {
    return (Number.isInteger(n) ? String(n) : n.toFixed(2)).replace(".", lang === "fr" ? "," : ".");
  };

  $$("[data-i18n]").forEach(function (el) { el.dataset.fr = el.innerHTML; });

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      el.innerHTML = lang === "fr" ? el.dataset.fr : (I18N.en[key] || el.dataset.fr);
    });
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    $$(".js-rating").forEach(function (el) { el.textContent = String(state.rating).replace(".", lang === "fr" ? "," : "."); });
    $$("a[href='index.html'], a[href^='index.html#'], a[href='histoire.html']").forEach(function (a) {
      var base = a.getAttribute("href").split("?")[0].split("#");
      a.setAttribute("href", base[0] + (lang === "en" ? "?lang=en" : "") + (base[1] ? "#" + base[1] : ""));
    });
    renderCarte();
    renderVins();
    renderReviews();
    renderOpenNow();
    if (window.JajaMotion) window.JajaMotion.refresh();
  }

  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = b.dataset.lang;
      store("jaja-lang", lang);
      var url = new URL(location.href);
      if (lang === "en") url.searchParams.set("lang", "en"); else url.searchParams.delete("lang");
      history.replaceState(null, "", url);
      applyLang();
    });
  });

  /* ---------------- Navigation ---------------- */
  var nav = $("#nav");
  var burger = $("#burger");
  var links = $("#navLinks");
  var hasHero = !!$(".hero, .page-hero");
  function onScroll() {
    if (nav) nav.classList.toggle("is-solid", !hasHero || window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (burger) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", String(open));
      links.classList.toggle("is-open", open);
      nav.classList.toggle("menu-open", open);
    });
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", function () {
        burger.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
        nav.classList.remove("menu-open");
      });
    });
  }

  /* ---------------- Réservation (Zenchef) ---------------- */
  if (CFG.zenchefId) {
    $$(".js-book").forEach(function (b) { b.setAttribute("data-zc-action", "open"); });
    var zc = document.createElement("div");
    zc.className = "zc-widget-config";
    zc.setAttribute("data-restaurant", CFG.zenchefId);
    zc.setAttribute("data-lang", lang);
    document.body.appendChild(zc);
    var sdk = document.createElement("script");
    sdk.id = "zenchef-sdk";
    sdk.async = true;
    sdk.src = "https://sdk.zenchef.com/v1/sdk.min.js";
    sdk.onerror = function () {
      $$(".js-book").forEach(function (b) {
        b.addEventListener("click", function () {
          window.open("https://bookings.zenchef.com/results?rid=" + CFG.zenchefId + "&lang=" + lang, "_blank", "noopener");
        });
      });
    };
    // chargé juste après la page pour ne pas la ralentir
    var loadSdk = function () {
      if (sdk.parentNode) return;
      document.body.appendChild(sdk);
      // le widget Zenchef n'a pas de titre : on lui en donne un pour les lecteurs d'écran
      var tries = 0, t = setInterval(function () {
        $$("iframe[src*='zenchef']:not([title])").forEach(function (f) { f.title = lang === "fr" ? "Réservation en ligne" : "Online booking"; });
        if (++tries > 20) clearInterval(t);
      }, 500);
    };
    if (document.readyState === "complete") setTimeout(loadSdk, 800);
    else window.addEventListener("load", function () { setTimeout(loadSdk, 800); });
    // si le visiteur clique très tôt sur « Réserver », on ouvre directement la page de réservation
    $$(".js-book").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!sdk.parentNode) window.open("https://bookings.zenchef.com/results?rid=" + CFG.zenchefId + "&lang=" + lang, "_blank", "noopener");
      });
    });
  }

  /* ---------------- Carte interactive ---------------- */
  var carte = window.CARTE || [];
  var activeCat = (window.CARTE && window.CARTE[0] && window.CARTE[0].id) || "all";
  var filters = [];
  var tabsEl = $("#carteTabs");
  var boardEl = $("#carteBoard");

  function dietBadges(item) {
    return (item.diet || []).map(function (d) {
      var label = { veg: "V", vegan: "VG", gf: "SG", lf: "SL" }[d];
      if (lang === "en") label = { veg: "V", vegan: "VG", gf: "GF", lf: "DF" }[d];
      return '<span class="diet diet--' + d + '" title="' + esc(ui().diet[d]) + '">' + label + "</span>";
    }).join("");
  }

  function dishHTML(item) {
    var price = item.price != null ? fmtPrice(item.price) : tr(item.priceLabel);
    var media = item.img || item.video;
    var thumb = media
      ? '<button type="button" class="dish__thumb" data-src="' + esc(item.img ? "assets/img/" + item.img : "") + '"' +
        (item.video ? ' data-video="' + esc(item.video) + '"' : "") + ' aria-label="' + esc(item.name) + '">' +
        (item.img ? '<img src="assets/img/' + esc(item.img.replace(/\.webp$/, "-400.webp")) + '" alt="" width="72" height="72" loading="lazy">' : "▶") + "</button>"
      : "";
    var allergens = (item.allergens || []).map(function (a) { return ui().a[a] || a; }).join(", ");
    return '<article class="dish' + (media ? " has-img" : "") + '">' + thumb +
      '<h4 class="dish__name">' + esc(item.name) + " " + dietBadges(item) + "</h4>" +
      '<span class="dish__price">' + esc(price) + "</span>" +
      (tr(item.desc) ? '<p class="dish__desc">' + esc(tr(item.desc)) + "</p>" : "") +
      '<details class="dish__more"><summary>' + ui().allergens + "</summary><p>" +
      esc(allergens ? allergens.charAt(0).toUpperCase() + allergens.slice(1) : ui().noAllergens) + "</p></details>" +
      "</article>";
  }

  function matches(item) {
    return filters.every(function (f) { return (item.diet || []).indexOf(f) !== -1; });
  }

  function renderCarte() {
    if (!tabsEl || !boardEl) return;
    var cats = [{ id: "all", title: { fr: ui().all, en: ui().all } }].concat(carte);
    tabsEl.innerHTML = cats.map(function (c) {
      return '<button type="button" role="tab" data-cat="' + c.id + '" aria-selected="' + (c.id === activeCat) + '">' + esc(tr(c.title)) + "</button>";
    }).join("");
    var shown = carte.filter(function (c) { return activeCat === "all" || c.id === activeCat; });
    var html = shown.map(function (c) {
      var items = c.items.filter(matches);
      if (!items.length && activeCat === "all") return "";
      return '<div class="carte__cat"><h3 class="carte__cat-title">' + esc(tr(c.title)) + "</h3>" +
        (c.note ? '<p class="carte__cat-note">' + esc(tr(c.note)) + "</p>" : "") +
        (items.length ? items.map(dishHTML).join("") : '<p class="carte__empty">' + ui().empty + "</p>") + "</div>";
    }).join("");
    boardEl.innerHTML = html || '<p class="carte__empty">' + ui().empty + "</p>";
    if (window.JajaMotion) window.JajaMotion.dishes(boardEl);
  }

  if (tabsEl) {
    tabsEl.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-cat]");
      if (!b) return;
      activeCat = b.dataset.cat;
      renderCarte();
    });
    $$("#carteFilters .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.dataset.filter;
        var on = filters.indexOf(f) === -1;
        filters = on ? filters.concat(f) : filters.filter(function (x) { return x !== f; });
        chip.setAttribute("aria-pressed", String(on));
        renderCarte();
      });
    });
  }

  /* Carte depuis un Google Sheets publié en CSV (facultatif) */
  function parseCSV(text) {
    var rows = [], row = [], cell = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) {
        if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') q = false;
        else cell += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += ch;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }
  function loadSheet() {
    if (!CFG.menuSheetUrl) return;
    fetch(CFG.menuSheetUrl).then(function (r) { return r.text(); }).then(function (text) {
      var rows = parseCSV(text);
      var head = rows.shift().map(function (h) { return h.trim().toLowerCase(); });
      var col = function (r, name) { var i = head.indexOf(name); return i === -1 ? "" : (r[i] || "").trim(); };
      var byCat = {}, order = [];
      rows.forEach(function (r) {
        var cat = col(r, "categorie"), name = col(r, "nom");
        if (!cat || !name) return;
        if (!byCat[cat]) { byCat[cat] = []; order.push(cat); }
        var p = col(r, "prix").replace(",", ".");
        byCat[cat].push({
          name: name,
          desc: { fr: col(r, "description"), en: col(r, "description_en") || col(r, "description") },
          price: p && !isNaN(p) ? parseFloat(p) : null,
          priceLabel: { fr: col(r, "prix"), en: col(r, "prix") },
          diet: col(r, "regimes").split(/[\s;,]+/).filter(Boolean),
          allergens: col(r, "allergenes").split(/[\s;,]+/).filter(Boolean),
          img: col(r, "photo") || undefined,
          video: col(r, "video") || undefined
        });
      });
      if (!order.length) return;
      var titles = {};
      (window.CARTE || []).forEach(function (c) { titles[c.title.fr.toLowerCase()] = c; });
      carte = order.map(function (cat, i) {
        var known = titles[cat.toLowerCase()];
        return { id: known ? known.id : "cat" + i, title: known ? known.title : { fr: cat, en: cat }, note: known && known.note, items: byCat[cat] };
      });
      activeCat = carte[0].id;
      renderCarte();
    }).catch(function () { /* on garde la carte locale */ });
  }

  /* ---------------- Vins ---------------- */
  function renderVins() {
    var el = $("#vinsList");
    if (!el || !window.VINS) return;
    var p = function (n) { return n == null ? "" : fmtPrice(n); };
    el.innerHTML = window.VINS.map(function (g) {
      var head = lang === "fr" ? ["12,5 cl", "50 cl", "75 cl"] : ["12.5 cl", "50 cl", "75 cl"];
      return '<div class="vins__group"><h3 class="wine wine--head"><span>' + esc(tr(g.title)) + "</span><small>" + head.join("</small><small>") + "</small></h3>" + g.items.map(function (w) {
        return '<div class="wine"><div>' + esc(w[0]) + "<em>" + esc(w[1]) + "</em></div><span>" + p(w[2]) + "</span><span>" + p(w[3]) + "</span><span>" + p(w[4]) + "</span></div>";
      }).join("") + "</div>";
    }).join("");
  }

  var moreWines = $(".vins__more");
  if (moreWines) moreWines.addEventListener("click", function () { $(".vins").classList.add("is-open"); });

  /* ---------------- Avis Google ---------------- */
  var state = { rating: CFG.rating || 4.4, count: CFG.reviewCount || 0, reviews: CFG.reviews || [] };

  function renderRating() {
    $$(".js-stars").forEach(function (s) { s.style.setProperty("--r", state.rating); });
    $$(".js-rating").forEach(function (el) { el.textContent = String(state.rating).replace(".", lang === "fr" ? "," : "."); });
    $$(".js-count").forEach(function (el) { el.textContent = Number(state.count).toLocaleString(lang); });
    $$(".js-greviews").forEach(function (a) { a.href = state.url || CFG.googleReviewsUrl; });
  }

  function renderReviews() {
    var track = $("#avisTrack");
    if (!track) return;
    track.innerHTML = state.reviews.map(function (r) {
      var when = typeof r.when === "string" ? r.when : tr(r.when);
      var initial = (r.author || "?").trim().charAt(0).toUpperCase();
      return '<figure class="review"><span class="stars" role="img" style="--r:' + r.rating + '" aria-label="' + r.rating + '/5"></span>' +
        "<blockquote>" + esc(r.text) + "</blockquote><footer>" +
        '<span class="review__avatar">' + (r.photo ? '<img src="' + esc(r.photo) + '" alt="" referrerpolicy="no-referrer">' : initial) + "</span>" +
        "<span>" + (r.authorUrl ? '<a href="' + esc(r.authorUrl) + '" target="_blank" rel="noopener">' + esc(r.author) + "</a>" : esc(r.author)) + "<time>" + esc(when) + " · Google</time></span></footer></figure>";
    }).join("");
    moveReviews(0);
    renderRating();
    if (window.JajaMotion) window.JajaMotion.refresh();
  }
  function moveReviews(delta) {
    var track = $("#avisTrack");
    if (!track || !track.children.length) return;
    if (!delta) { track.scrollLeft = 0; return; }
    var step = track.children[0].getBoundingClientRect().width + 20;
    var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (delta > 0 && atEnd) track.scrollTo({ left: 0 });
    else track.scrollBy({ left: delta * step });
  }
  if ($("#avisPrev")) {
    $("#avisPrev").addEventListener("click", function () { moveReviews(-1); });
    $("#avisNext").addEventListener("click", function () { moveReviews(1); });
    var auto = setInterval(function () { moveReviews(1); }, 7000);
    var stopAuto = function () { clearInterval(auto); };
    $(".avis__list").addEventListener("pointerenter", stopAuto);
    $(".avis__list").addEventListener("touchstart", stopAuto, { passive: true });
  }

  /* Avis mis à jour chaque jour par scripts/update-avis.mjs */
  function loadGoogleReviews() {
    if (!$(".js-rating")) return;
    fetch("assets/data/avis.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        if (!d || !d.rating) return;
        state.rating = d.rating;
        state.count = d.reviewCount;
        state.url = d.url;
        // Moins de 2 avis récents à 4-5★ : on complète avec la sélection de config.js
        if (d.reviews && d.reviews.length) state.reviews = d.reviews.concat(d.reviews.length < 2 ? state.reviews : []);
        renderReviews();
      })
      .catch(function () { /* fichier absent : on garde la sélection de config.js */ });
  }

  /* ---------------- Ouvert / fermé ---------------- */
  // [ouverture, fermeture] en heures, fermeture après minuit = +24. Index 0 = dimanche.
  var HOURS = [[9, 23], [8, 25], [8, 25], [8, 25], [8, 25], [8, 25], [9, 25]];
  function renderOpenNow() {
    var els = $$("#openNow, #openNowTop");
    if (!els.length) return;
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    var get = function (t) { return (parts.filter(function (p) { return p.type === t; })[0] || {}).value; };
    var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    var h = parseInt(get("hour"), 10) % 24 + parseInt(get("minute"), 10) / 60;
    var today = HOURS[day], yesterday = HOURS[(day + 6) % 7];
    var fmt = function (x) { x = x % 24; return lang === "fr" ? x + "h" : (x === 0 ? "midnight" : (x > 12 ? x - 12 + "pm" : x + "am")); };
    var open = false, text;
    if (yesterday[1] > 24 && h < yesterday[1] - 24) { open = true; text = ui().closesAt + " " + fmt(yesterday[1]); }
    else if (h >= today[0] && h < today[1]) { open = true; text = ui().closesAt + " " + fmt(today[1]); }
    else if (h < today[0]) { text = ui().opensAt + " " + fmt(today[0]); }
    else { text = ui().opensAt + " " + fmt(HOURS[(day + 1) % 7][0]); }
    els.forEach(function (el) {
      var short = el.id === "openNowTop";
      el.textContent = (open ? (short ? ui().openShort : ui().openNow) : (short ? ui().closedShort : ui().closedNow)) + " · " + text;
      el.style.setProperty("--dot", open ? "#3f8f5a" : "#b3402f");
    });
  }

  /* ---------------- Plan Google Maps (chargé seulement si le visiteur le demande) ---------------- */
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".js-map")) return;
    var map = $("#map");
    map.innerHTML = '<iframe title="Plan d\'accès Brasserie Jaja" referrerpolicy="no-referrer-when-downgrade" ' +
      'src="https://maps.google.com/maps?q=Brasserie%20Jaja%2C%2047%20rue%20d%27Amsterdam%2C%2075008%20Paris&z=16&hl=' + lang + '&output=embed"></iframe>';
  });

  /* ---------------- Lightbox ---------------- */
  var lb = $("#lightbox");
  var lbMedia = $("#lightboxMedia");
  function openLightbox(src, video, alt) {
    if (!lb) return;
    if (video) {
      var yt = video.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
      lbMedia.innerHTML = yt
        ? '<iframe src="https://www.youtube-nocookie.com/embed/' + yt[1] + '?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
        : '<video src="' + esc(video) + '" controls autoplay playsinline></video>';
    } else {
      lbMedia.innerHTML = '<img src="' + esc(src) + '" alt="' + esc(alt || "") + '">';
    }
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $(".lightbox__close").focus();
  }
  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    lbMedia.innerHTML = "";
    document.body.style.overflow = "";
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest(".g, .dish__thumb");
    if (t) {
      var img = t.querySelector("img");
      openLightbox(t.dataset.src, t.dataset.video, img && img.alt);
    }
  });
  if (lb) {
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest(".lightbox__close")) closeLightbox(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });
  }

  /* ---------------- Statistiques (Plausible, sans cookie) ---------------- */
  if (CFG.plausibleDomain) {
    var pl = document.createElement("script");
    pl.defer = true;
    pl.setAttribute("data-domain", CFG.plausibleDomain);
    pl.src = "https://plausible.io/js/script.js";
    document.head.appendChild(pl);
  }

  var y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  applyLang();
  loadSheet();
  loadGoogleReviews();
})();
