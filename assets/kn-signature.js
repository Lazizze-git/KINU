/**
 * KINŪ — Couche signature
 *
 * Trois mécaniques, aucune dépendance :
 *   1. la numérotation automatique des sections (`[01]`, `[02]`…) ;
 *   2. l'heure locale de l'atelier, vivante, dans le fuseau réglé en admin ;
 *   3. la bande de télémétrie : index de section, jauge de lecture, et
 *      adoption de la surface qu'elle survole.
 *
 * Chargé en `defer`, après les scripts de domaine.
 * Voir DIRECTION-ARTISTIQUE.md §8 et assets/kn-signature.css.
 */
(function () {
  'use strict';

  /** Sélecteur des sections de premier niveau du contenu. */
  var SECTION_SELECTOR = '#MainContent > .shopify-section';

  /**
   * Formate un entier sur deux chiffres.
   * @param {number} value
   * @returns {string}
   */
  function pad(value) {
    return value < 10 ? '0' + value : String(value);
  }

  /**
   * Renvoie l'élément qui défile réellement.
   * Au-delà de 990 px, Horizon fige `body` et fait défiler `.page-wrapper`.
   * @returns {HTMLElement}
   */
  function getScroller() {
    var wrapper = /** @type {HTMLElement | null} */ (document.querySelector('.page-wrapper'));
    if (wrapper && wrapper.scrollHeight > wrapper.clientHeight) return wrapper;
    return /** @type {HTMLElement} */ (document.scrollingElement || document.documentElement);
  }

  /* ------------------------------------------------------------------------
     1. Numérotation des sections
     L'index n'est pas écrit dans le Liquid : une section peut être déplacée,
     dupliquée ou masquée depuis l'éditeur de thème. On le calcule à l'écran,
     là où l'ordre est vrai.
     ---------------------------------------------------------------------- */

  /**
   * @returns {HTMLElement[]} Les sections du contenu, dans l'ordre du document.
   */
  function listSections() {
    return Array.prototype.slice.call(document.querySelectorAll(SECTION_SELECTOR));
  }

  /**
   * Numérote toutes les sections du contenu — y compris celles qui n'affichent
   * pas leur index, comme la bannière. L'index dit une position dans la page,
   * pas un rang parmi les sur-titres : c'est ce qui le rend fiable.
   * @returns {number} Le nombre de sections.
   */
  function numberSections() {
    var sections = listSections();

    sections.forEach(function (section, position) {
      var rank = position + 1;
      section.setAttribute('data-kn-section-rank', String(rank));

      var slot = section.querySelector('[data-kn-index]');
      if (slot) slot.textContent = pad(rank);
    });

    return sections.length;
  }

  /* ------------------------------------------------------------------------
     2. Horloge de l'atelier
     `Intl` fait le travail du fuseau et de l'heure d'été. L'abréviation
     (CET / CEST) est relue à chaque minute, pas à chaque seconde.
     ---------------------------------------------------------------------- */

  /**
   * Construit les formateurs d'un fuseau, avec repli sur le fuseau du visiteur
   * si l'identifiant réglé en admin est invalide.
   * @param {string} timeZone
   * @returns {{ clock: Intl.DateTimeFormat, zone: Intl.DateTimeFormat } | null}
   */
  function createFormatters(timeZone) {
    var options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    var zoneOptions = { timeZoneName: 'short' };

    try {
      return {
        clock: new Intl.DateTimeFormat('fr-CH', Object.assign({ timeZone: timeZone }, options)),
        zone: new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: timeZone }, zoneOptions))
      };
    } catch (error) {
      try {
        return {
          clock: new Intl.DateTimeFormat('fr-CH', options),
          zone: new Intl.DateTimeFormat('en-GB', zoneOptions)
        };
      } catch (fallbackError) {
        return null;
      }
    }
  }

  /**
   * Extrait l'abréviation de fuseau d'un formateur.
   * @param {Intl.DateTimeFormat} formatter
   * @param {Date} date
   * @returns {string}
   */
  function readZoneName(formatter, date) {
    var parts = formatter.formatToParts(date);
    for (var i = 0; i < parts.length; i += 1) {
      if (parts[i].type === 'timeZoneName') return parts[i].value;
    }
    return '';
  }

  /**
   * Met à jour toutes les horloges de la page, une fois par seconde, et
   * seulement quand l'onglet est visible.
   */
  function initClocks() {
    var slots = document.querySelectorAll('[data-kn-clock]');
    if (slots.length === 0) return;

    var timeZone = document.documentElement.getAttribute('data-kn-timezone') || 'Europe/Zurich';
    var formatters = createFormatters(timeZone);
    if (!formatters) return;

    var zoneSlots = document.querySelectorAll('[data-kn-zone]');
    var timer = null;
    var lastMinute = -1;

    function render() {
      var now = new Date();
      var time = formatters.clock.format(now);

      Array.prototype.forEach.call(slots, function (slot) {
        slot.textContent = time;
      });

      if (zoneSlots.length > 0 && now.getMinutes() !== lastMinute) {
        lastMinute = now.getMinutes();
        var zone = readZoneName(formatters.zone, now);
        Array.prototype.forEach.call(zoneSlots, function (slot) {
          slot.textContent = zone;
        });
      }
    }

    function start() {
      if (timer !== null) return;
      render();
      timer = window.setInterval(render, 1000);
    }

    function stop() {
      if (timer === null) return;
      window.clearInterval(timer);
      timer = null;
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });

    start();
  }

  /* ------------------------------------------------------------------------
     3. Bande de télémétrie
     Un seul écouteur de défilement, calé sur rAF : il met à jour la jauge,
     l'index de section, et la surface adoptée par la bande.
     ---------------------------------------------------------------------- */

  /**
   * @param {HTMLElement} hud
   * @param {number} total
   */
  function initHud(hud, total) {
    var gauge = hud.querySelector('[data-kn-hud-gauge]');
    var indexSlot = hud.querySelector('[data-kn-hud-index]');
    var totalSlot = hud.querySelector('[data-kn-hud-total]');
    var sections = listSections();
    var ticking = false;
    var lastSurface = '';
    var lastIndex = -1;

    if (totalSlot) totalSlot.textContent = pad(total || sections.length);

    /**
     * Progression de lecture, entre 0 et 1.
     * Le conteneur qui défile est relu à chaque image : au premier rendu les
     * médias ne sont pas encore chargés, et `.page-wrapper` n'a pas toujours
     * dépassé sa hauteur visible.
     * @returns {number}
     */
    function readProgress() {
      var scroller = getScroller();
      var travel = scroller.scrollHeight - scroller.clientHeight;
      if (travel <= 0) return 0;
      return Math.min(1, Math.max(0, scroller.scrollTop / travel));
    }

    /** Renvoie le rang de la section qui occupe le centre de l'écran. */
    function readSectionRank() {
      var line = window.innerHeight / 2;
      var rank = 0;

      for (var i = 0; i < sections.length; i += 1) {
        var box = sections[i].getBoundingClientRect();
        if (box.top <= line && box.bottom > line) {
          var attribute = sections[i].getAttribute('data-kn-section-rank');
          rank = attribute ? parseInt(attribute, 10) : i + 1;
          break;
        }
      }

      return rank;
    }

    /** La bande adopte la surface du bloc qu'elle recouvre. */
    function readSurface() {
      var y = window.innerHeight - hud.offsetHeight - 2;
      if (y <= 0) return 'light';

      var target = document.elementFromPoint(window.innerWidth / 2, y);
      if (!target) return 'light';

      var owner = target.closest('[data-kn-surface]');
      return owner ? owner.getAttribute('data-kn-surface') || 'light' : 'light';
    }

    function update() {
      ticking = false;

      if (gauge) hud.style.setProperty('--kn-hud-progress', readProgress().toFixed(4));

      var rank = readSectionRank();
      if (indexSlot && rank > 0 && rank !== lastIndex) {
        lastIndex = rank;
        indexSlot.textContent = pad(rank);
      }

      var surface = readSurface();
      if (surface !== lastSurface) {
        lastSurface = surface;
        hud.setAttribute('data-kn-surface', surface);
      }
    }

    function request() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    /* Le défilement de la racine ne remonte pas jusqu'à l'élément racine : il
       s'écoute sur `window`. Celui de `.page-wrapper` — le conteneur qui
       défile au-delà de 990 px — s'écoute sur le conteneur. On branche les
       deux : lequel des deux porte réellement le défilement dépend de la
       largeur de la fenêtre, qui change en cours de visite. */
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });

    var wrapper = document.querySelector('.page-wrapper');
    if (wrapper) wrapper.addEventListener('scroll', request, { passive: true });

    /* L'éditeur de thème réinjecte des sections : la liste se repère à neuf. */
    document.addEventListener('shopify:section:load', function () {
      sections = listSections();
      if (totalSlot) totalSlot.textContent = pad(sections.length);
      lastIndex = -1;
      request();
    });

    update();
  }

  /* ------------------------------------------------------------------------
     4. Amorçage
     ---------------------------------------------------------------------- */

  function init() {
    var total = numberSections();
    initClocks();

    var hud = /** @type {HTMLElement | null} */ (document.querySelector('[data-kn-hud="fixed"]'));
    if (hud) initHud(hud, total);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* L'éditeur de thème réinjecte les sections : on renumérote, sans rebrancher
     ni l'horloge ni la bande, déjà en place. */
  document.addEventListener('shopify:section:load', numberSections);
  document.addEventListener('shopify:section:reorder', numberSections);
})();
