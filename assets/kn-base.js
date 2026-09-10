/**
 * KINŪ — Socle JavaScript
 *
 * Expose l'espace de noms `window.KN` (utilitaires partagés par les feuilles
 * de domaine) et branche l'apparition des sections au scroll.
 *
 * Chargé en `defer`, avant les scripts de domaine.
 * Voir DIRECTION-ARTISTIQUE.md §8.
 */
(function () {
  'use strict';

  /** Décalage entre deux éléments révélés d'une même grille, en ms (DA §8). */
  var REVEAL_STAGGER = 60;
  // Au-dela, l'escalier devient une file d'attente : le dernier d'un plein
  // ecran de vignettes paraitrait une demi-seconde apres le premier.
  var REVEAL_STAGGER_MAX = 6;
  // Au-dela de cette attente, on considere que l'observateur ne viendra pas.
  var REVEAL_FAILSAFE = 1200;

  /** Part de l'élément visible avant déclenchement de la révélation. */
  var REVEAL_THRESHOLD = 0.15;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /**
   * Piège le focus à l'intérieur d'un conteneur (panneau de nav, drawer).
   * @param {HTMLElement} container
   * @returns {(event: KeyboardEvent) => void} Gestionnaire à retirer à la fermeture.
   */
  function createFocusTrap(container) {
    var SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

    return function handleKeydown(event) {
      if (event.key !== 'Tab') return;

      var focusables = Array.prototype.filter.call(
        container.querySelectorAll(SELECTOR),
        function (el) {
          return el.offsetParent !== null;
        }
      );
      if (focusables.length === 0) return;

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
  }

  /**
   * Renvoie l'élément qui défile réellement.
   * Au-delà de 990 px, Horizon donne `overflow-y: auto` à `.page-wrapper` et
   * fige `body` : verrouiller `body.overflow` n'y bloque donc rien.
   * @returns {HTMLElement}
   */
  function getScroller() {
    var wrapper = /** @type {HTMLElement | null} */ (document.querySelector('.page-wrapper'));
    if (wrapper && wrapper.scrollHeight > wrapper.clientHeight) return wrapper;
    return /** @type {HTMLElement} */ (document.scrollingElement || document.documentElement);
  }

  /**
   * Verrouille le défilement sans provoquer de saut de mise en page.
   * S'appuie sur l'attribut `scroll-lock` déjà géré par le CSS d'Horizon
   * (`html[scroll-lock], html[scroll-lock] .page-wrapper { overflow: hidden }`),
   * et compense la largeur de la barre de défilement qui disparaît.
   * @param {boolean} locked
   */
  function lockScroll(locked) {
    var root = document.documentElement;

    if (!locked) {
      root.removeAttribute('scroll-lock');
      root.style.removeProperty('--kn-scrollbar-gap');
      return;
    }

    var scroller = getScroller();
    var gap = scroller === document.scrollingElement || scroller === root
      ? window.innerWidth - root.clientWidth
      : scroller.offsetWidth - scroller.clientWidth;

    root.style.setProperty('--kn-scrollbar-gap', (gap > 0 ? gap : 0) + 'px');
    root.setAttribute('scroll-lock', '');
  }

  /**
   * Révèle les éléments `.kn-reveal` lorsqu'ils entrent dans le viewport.
   * Une seule fois : pas de rejeu au scroll inverse (DA §8).
   */
  function initReveal() {
    var targets = document.querySelectorAll('.kn-reveal:not(.is-visible)');
    if (targets.length === 0) return;

    if (prefersReducedMotion.matches || typeof IntersectionObserver === 'undefined') {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        /*
         * Le decalage se compte sur ce qui entre ensemble, pas sur le rang du
         * frere. Une grille de quarante cellules donnait sinon 2,4 secondes
         * d'attente a la derniere, et surtout : une cellule isolee qui entre
         * en trentieme position aurait attendu son propre rang avant de
         * paraitre, alors qu'elle est seule a l'ecran. Ce qui arrive ensemble
         * s'echelonne ; ce qui arrive seul parait tout de suite.
         */
        var arrivals = entries.filter(function (entry) {
          return entry.isIntersecting;
        });
        if (arrivals.length === 0) return;

        // L'observateur ne garantit pas l'ordre du document : on le retablit,
        // sans quoi l'escalier partirait au hasard dans la rangee.
        arrivals.sort(function (a, b) {
          var order = a.target.compareDocumentPosition(b.target);
          if (order & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
          if (order & Node.DOCUMENT_POSITION_PRECEDING) return 1;
          return 0;
        });

        arrivals.forEach(function (entry, index) {
          var el = /** @type {HTMLElement} */ (entry.target);
          el.style.setProperty('--kn-reveal-delay', Math.min(index, REVEAL_STAGGER_MAX) * REVEAL_STAGGER + 'ms');
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      { threshold: REVEAL_THRESHOLD }
    );

    Array.prototype.forEach.call(targets, function (el) {
      observer.observe(el);
    });

    /*
     * Filet de securite. Depuis que la grille produits se revele elle aussi,
     * une revelation qui ne se declenche pas ne coute plus un effet manque :
     * elle cache le catalogue. L'observateur ne tire pas tant que la page n'est
     * pas peinte — onglet ouvert en arriere-plan, fenetre reduite — et certains
     * moteurs le retardent davantage.
     *
     * Passe le delai, tout ce qui est deja dans le cadre parait, avec ou sans
     * escalier. Ce qui est plus bas garde son observateur : le filet repare une
     * panne, il ne supprime pas la revelation au defilement.
     */
    window.setTimeout(function () {
      Array.prototype.forEach.call(targets, function (el) {
        if (el.classList.contains('is-visible')) return;
        var box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      });
    }, REVEAL_FAILSAFE);
  }

  window.KN = {
    createFocusTrap: createFocusTrap,
    lockScroll: lockScroll,
    initReveal: initReveal,
    prefersReducedMotion: prefersReducedMotion
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

  // Le thème réinjecte des sections au fil de l'eau (éditeur, pagination Ajax).
  document.addEventListener('shopify:section:load', initReveal);
})();
