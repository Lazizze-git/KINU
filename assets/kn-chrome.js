/**
 * KINŪ — Chrome du site
 *
 * Quatre responsabilités, et rien d'autre :
 *  1. la bascule de couleur du header au scroll (geste signature, DA §3.4 R5) ;
 *  2. l'ouverture du panneau de navigation (DA §3.4 R6) ;
 *  3. les panneaux des univers dans la barre, sur ordinateur (DA §7.1) ;
 *  4. la barre d'annonce défilante (DA §7.1).
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
     3 bis. Panneaux des univers, sur ordinateur
     Survol : une courte intention avant d'ouvrir, un delai de grace avant de
     fermer, le temps de descendre dans le panneau. Au clavier, le bouton qui
     suit la rubrique ouvre ; Echap referme et lui rend le focus. D'un univers
     a l'autre, le panneau change sans refaire son fondu.
     ---------------------------------------------------------------------- */

  /** Delai avant ouverture au survol : un simple passage n'ouvre rien. */
  var MENU_OPEN_DELAY = 90;

  /** Delai avant fermeture : laisse le temps de descendre dans le panneau. */
  var MENU_CLOSE_DELAY = 180;

  /**
   * Referme le panneau ouvert, s'il y en a un. Une seule reference pour tout le
   * module : l'editeur de theme recharge le header sans recharger ce script, et
   * chaque rechargement ajoutait sinon ses propres ecouteurs.
   * @type {(() => void) | null}
   */
  var closeActiveMenu = null;

  (function () {
    var query = window.matchMedia('(min-width: 1024px)');
    /* Sous 1024 px, les panneaux n'existent plus : on ne laisse rien ouvert. */
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', function (event) {
        if (!event.matches && closeActiveMenu) closeActiveMenu();
      });
    }
    /* L'editeur retire une section : un panneau ouvert se referme avec elle,
       et ses ecouteurs de document partent aussi. */
    document.addEventListener('shopify:section:unload', function () {
      if (closeActiveMenu) closeActiveMenu();
    });
  })();

  /**
   * @param {HTMLElement} header
   */
  function initMenus(header) {
    var items = header.querySelectorAll('[data-kn-menu]');
    if (!items.length || header.hasAttribute('data-kn-menus-ready')) return;
    header.setAttribute('data-kn-menus-ready', '');

    var desktop = window.matchMedia('(min-width: 1024px)');
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    var nav = header.querySelector('.kn-header__nav');
    /** @type {HTMLElement | null} */
    var current = null;
    var openTimer = 0;
    var closeTimer = 0;

    /* Bas reel du header, pour borner la hauteur du panneau, et bord gauche
       de la barre : chaque panneau aligne son contenu sous la premiere
       rubrique, et rien ne saute d'un univers a l'autre. */
    function place() {
      var box = header.getBoundingClientRect();
      header.style.setProperty('--kn-menu-top', Math.round(box.bottom) + 'px');
      if (nav) {
        header.style.setProperty('--kn-menu-x', Math.round(nav.getBoundingClientRect().left - box.left) + 'px');
      }
    }

    /**
     * @param {HTMLElement} item
     * @returns {HTMLElement | null}
     */
    function toggleOf(item) {
      return item.querySelector('[data-kn-menu-toggle]');
    }

    /** @param {HTMLElement} item */
    function shut(item) {
      item.classList.remove('is-open');
      var toggle = toggleOf(item);
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    function clearTimers() {
      window.clearTimeout(openTimer);
      window.clearTimeout(closeTimer);
    }

    /** @param {KeyboardEvent} event */
    function onKeydown(event) {
      if (event.key !== 'Escape' || !current) return;
      var inside = current.contains(document.activeElement);
      event.preventDefault();
      close(inside);
    }

    /** @param {PointerEvent} event */
    function onPointerDown(event) {
      if (current && !current.contains(/** @type {Node} */ (event.target))) close(false);
    }

    /**
     * @param {HTMLElement} item
     * @param {'hover' | 'click'} mode
     */
    function open(item, mode) {
      clearTimers();
      header.setAttribute('data-kn-menu-mode', mode);
      if (current === item) return;

      var switching = current !== null;
      if (current) {
        header.setAttribute('data-kn-menu-instant', '');
        shut(current);
      }

      current = item;
      place();
      item.classList.add('is-open');
      var toggle = toggleOf(item);
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      header.classList.add('is-menu-open');

      if (switching) {
        /* La bascule sans fondu doit etre peinte avant que la transition ne
           reprenne : deux images plus tard. */
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            header.removeAttribute('data-kn-menu-instant');
          });
        });
        return;
      }

      document.addEventListener('keydown', onKeydown);
      document.addEventListener('pointerdown', onPointerDown, true);
    }

    /** @param {boolean} restoreFocus */
    function close(restoreFocus) {
      clearTimers();
      if (!current) return;

      var item = current;
      current = null;
      shut(item);
      header.classList.remove('is-menu-open');
      header.removeAttribute('data-kn-menu-mode');
      header.removeAttribute('data-kn-menu-instant');

      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('pointerdown', onPointerDown, true);

      if (restoreFocus) {
        var toggle = toggleOf(item);
        if (toggle) toggle.focus({ preventScroll: true });
      }
    }

    /** @param {HTMLElement} item */
    function wire(item) {
      var toggle = toggleOf(item);

      item.addEventListener('pointerenter', function (event) {
        if (event.pointerType !== 'mouse' || !desktop.matches || !finePointer.matches) return;
        window.clearTimeout(closeTimer);
        if (current === item) return;
        window.clearTimeout(openTimer);
        /* Un panneau est deja ouvert : l'univers voisin le remplace sans attendre. */
        if (current) {
          open(item, 'hover');
          return;
        }
        openTimer = window.setTimeout(function () {
          open(item, 'hover');
        }, MENU_OPEN_DELAY);
      });

      item.addEventListener('pointerleave', function (event) {
        if (event.pointerType !== 'mouse') return;
        window.clearTimeout(openTimer);
        if (current !== item || header.getAttribute('data-kn-menu-mode') !== 'hover') return;
        closeTimer = window.setTimeout(function () {
          close(false);
        }, MENU_CLOSE_DELAY);
      });

      if (toggle) {
        toggle.addEventListener('click', function () {
          if (current === item && header.getAttribute('data-kn-menu-mode') === 'click') {
            close(false);
          } else {
            open(item, 'click');
          }
        });
      }

      /* Le focus quitte l'univers : son panneau se referme. */
      item.addEventListener('focusout', function (event) {
        var next = /** @type {Node | null} */ (event.relatedTarget);
        if (current === item && next && !item.contains(next)) close(false);
      });
    }

    for (var i = 0; i < items.length; i += 1) {
      wire(/** @type {HTMLElement} */ (items[i]));
    }

    closeActiveMenu = function () {
      close(false);
    };
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

    if (header) initMenus(header);
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
