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
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var el = /** @type {HTMLElement} */ (entry.target);
          var siblings = el.parentElement
            ? Array.prototype.filter.call(el.parentElement.children, function (child) {
                return child.classList.contains('kn-reveal');
              })
            : [];
          var index = siblings.indexOf(el);

          el.style.setProperty('--kn-reveal-delay', Math.max(index, 0) * REVEAL_STAGGER + 'ms');
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      { threshold: REVEAL_THRESHOLD }
    );

    Array.prototype.forEach.call(targets, function (el) {
      observer.observe(el);
    });
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
