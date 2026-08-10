/**
 * KINŪ — Chrome du site
 *
 * Trois responsabilités, et rien d'autre :
 *  1. la bascule de couleur du header au scroll (geste signature, DA §3.4 R5) ;
 *  2. l'ouverture du panneau de navigation (DA §3.4 R6) ;
 *  3. la barre d'annonce défilante (DA §7.1).
 *
 * Chargé en `defer`, après kn-base.js dont il consomme `window.KN`.
 * Aucune dépendance externe. Si un élément attendu manque, le module sort.
 */
(function () {
  'use strict';

  /** Clé de mémorisation de la fermeture de la barre d'annonce. */
  var ANNOUNCE_KEY = 'kn-announce-dismissed';

  /** Durée plancher du défilement, en secondes : en deçà on n'est plus calme. */
  var ANNOUNCE_MIN_DURATION = 12;

  var KN = window.KN || {};

  /**
   * Marque un élément comme déjà câblé. L'éditeur de thème réinjecte les
   * sections à chaud : sans cette garde, les écouteurs s'empilent.
   * @param {Element} el
   * @returns {boolean} true si l'élément était déjà câblé.
   */
  function alreadyWired(el) {
    if (el.hasAttribute('data-kn-ready')) return true;
    el.setAttribute('data-kn-ready', '');
    return false;
  }

  /**
   * Premier élément réellement focalisable et affiché d'un conteneur.
   * @param {Element} container
   * @returns {HTMLElement | null}
   */
  function firstFocusable(container) {
    var candidates = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    for (var i = 0; i < candidates.length; i += 1) {
      var el = /** @type {HTMLElement} */ (candidates[i]);
      if (el.offsetParent !== null) return el;
    }

    return null;
  }

  /* ------------------------------------------------------------------------
     1. Bascule de couleur au scroll
     Une sentinelle de la hauteur du seuil est posée en tête du contenu : sa
     sortie du viewport EST le franchissement des 64 px. Aucun écouteur de
     scroll, donc aucun calcul à chaque image.
     ---------------------------------------------------------------------- */

  /**
   * @param {HTMLElement} header
   * @param {HTMLElement} wrapper
   */
  function initScrollState(header, wrapper) {
    if (typeof IntersectionObserver === 'undefined') return;

    /* L'éditeur de thème peut relancer ce module : une seule sentinelle. */
    var previous = wrapper.querySelector('.kn-scroll-sentinel');
    if (previous) previous.remove();

    var sentinel = document.createElement('div');
    sentinel.className = 'kn-scroll-sentinel';
    sentinel.setAttribute('aria-hidden', 'true');
    wrapper.insertBefore(sentinel, wrapper.firstChild);

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i += 1) {
        header.classList.toggle('is-scrolled', !entries[i].isIntersecting);
      }
    });

    observer.observe(sentinel);
  }

  /* ------------------------------------------------------------------------
     2. Hauteurs publiées
     Le header natif d'Horizon a disparu : c'est à nous de renseigner les
     variables dont les composants du thème dépendent encore.
     ---------------------------------------------------------------------- */

  /**
   * @param {HTMLElement} header
   * @param {HTMLElement} group
   */
  function initMetrics(header, group) {
    function publish() {
      document.body.style.setProperty('--header-height', header.offsetHeight + 'px');
      document.body.style.setProperty('--header-group-height', group.offsetHeight + 'px');
    }

    publish();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', publish);
      return;
    }

    var observer = new ResizeObserver(publish);
    observer.observe(header);
    observer.observe(group);
  }

  /* ------------------------------------------------------------------------
     3. Panneau de navigation
     ---------------------------------------------------------------------- */

  /**
   * Complète le verrou de défilement de kn-base.js : au-delà de 990 px, c'est
   * `.page-wrapper` qui défile, pas le document. La largeur de la barre de
   * défilement est compensée pour que rien ne saute.
   * @param {HTMLElement | null} wrapper
   * @param {boolean} locked
   */
  function lockWrapperScroll(wrapper, locked) {
    if (!wrapper) return;

    if (!locked) {
      wrapper.classList.remove('kn-scroll-locked');
      wrapper.style.paddingRight = '';
      return;
    }

    if (window.getComputedStyle(wrapper).overflowY !== 'auto') return;

    var scrollbar = wrapper.offsetWidth - wrapper.clientWidth;
    if (scrollbar > 0) wrapper.style.paddingRight = scrollbar + 'px';
    wrapper.classList.add('kn-scroll-locked');
  }

  function initNav() {
    var nav = document.querySelector('[data-kn-nav]');
    var toggle = document.querySelector('[data-kn-nav-toggle]');
    if (!nav || !toggle || alreadyWired(nav)) return;

    var panel = nav.querySelector('[data-kn-nav-panel]');
    if (!panel) return;

    var header = document.querySelector('[data-kn-header]');
    var wrapper = /** @type {HTMLElement | null} */ (document.querySelector('.page-wrapper'));
    var isOpen = false;
    /** @type {((event: KeyboardEvent) => void) | null} */
    var releaseTrap = null;

    /** @param {KeyboardEvent} event */
    function onKeydown(event) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      close();
    }

    function open() {
      if (isOpen) return;
      isOpen = true;

      if (header) {
        /* Le panneau se déroule exactement sous le header, barre d'annonce
           comprise tant qu'elle est encore visible en haut de page. */
        nav.style.setProperty('--kn-nav-top', Math.round(header.getBoundingClientRect().bottom) + 'px');
        header.classList.add('is-nav-open');
      }

      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');

      if (typeof KN.lockScroll === 'function') KN.lockScroll(true);
      lockWrapperScroll(wrapper, true);

      if (typeof KN.createFocusTrap === 'function') {
        releaseTrap = KN.createFocusTrap(panel);
        document.addEventListener('keydown', releaseTrap);
      }
      document.addEventListener('keydown', onKeydown);

      var target = firstFocusable(panel);
      if (target) target.focus({ preventScroll: true });
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;

      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (header) header.classList.remove('is-nav-open');

      if (typeof KN.lockScroll === 'function') KN.lockScroll(false);
      lockWrapperScroll(wrapper, false);

      if (releaseTrap) {
        document.removeEventListener('keydown', releaseTrap);
        releaseTrap = null;
      }
      document.removeEventListener('keydown', onKeydown);

      toggle.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', function () {
      if (isOpen) {
        close();
      } else {
        open();
      }
    });

    var dismissers = nav.querySelectorAll('[data-kn-nav-dismiss]');
    for (var i = 0; i < dismissers.length; i += 1) {
      dismissers[i].addEventListener('click', close);
    }
  }

  /* ------------------------------------------------------------------------
     4. Barre d'annonce
     La durée est calculée à partir de la largeur réelle du contenu, pour que
     la vitesse reste la même qu'il y ait une annonce ou cinq.
     ---------------------------------------------------------------------- */

  function initAnnouncement() {
    var bar = document.querySelector('[data-kn-announce]');
    if (!bar || alreadyWired(bar)) return;

    var track = bar.querySelector('[data-kn-announce-track]');
    var group = track ? track.firstElementChild : null;
    var speed = parseFloat(bar.getAttribute('data-kn-announce-speed') || '');

    if (group && speed > 0) {
      /**
       * Changer `animation-duration` en cours de route fait sauter la position :
       * le navigateur conserve le temps écoulé et recalcule la progression. On
       * relance donc l'animation à zéro — invisible dans la première seconde,
       * contrairement au saut.
       * @param {boolean} restart
       */
      var tune = function (restart) {
        if (!bar.isConnected) return;

        var width = group.getBoundingClientRect().width;
        if (width <= 0) return;

        var duration = Math.max(Math.round(width / speed), ANNOUNCE_MIN_DURATION);
        bar.style.setProperty('--kn-announce-dur', duration + 's');

        if (!restart || !track) return;
        track.style.animation = 'none';
        void track.offsetWidth;
        track.style.animation = '';
      };

      tune(false);

      /* Les polices d'affichage arrivent après le premier rendu : la largeur
         mesurée jusque-là était celle de la police de repli. */
      if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
        document.fonts.ready.then(function () {
          tune(true);
        });
      }

      /* Pas d'écouteur de redimensionnement : le contenu est en `nowrap` et sa
         largeur ne dépend pas du viewport, seulement de la police. */
    }

    var closeButton = bar.querySelector('[data-kn-announce-close]');
    if (!closeButton) return;

    closeButton.addEventListener('click', function () {
      bar.setAttribute('hidden', '');
      try {
        sessionStorage.setItem(ANNOUNCE_KEY, '1');
      } catch (error) {
        /* Stockage indisponible : la barre reparaîtra au prochain chargement. */
      }
    });
  }

  /* ---------------------------------------------------------------------- */

  function init() {
    var header = /** @type {HTMLElement | null} */ (document.querySelector('[data-kn-header]'));
    var group = /** @type {HTMLElement | null} */ (document.getElementById('header-group'));
    var wrapper = /** @type {HTMLElement | null} */ (document.querySelector('.page-wrapper'));

    if (header && group && !alreadyWired(header)) {
      initMetrics(header, group);
      if (wrapper) initScrollState(header, wrapper);
    }

    initNav();
    initAnnouncement();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* L'éditeur de thème réinjecte les sections sans recharger la page. */
  document.addEventListener('shopify:section:load', init);
})();
