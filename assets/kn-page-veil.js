/**
 * KINŪ — Passage d'une page à l'autre
 *
 * Au clic sur un lien interne qui mène à une autre page, pose le voile
 * ivoire sous le header (snippets/kn-page-veil.liquid) et annonce le départ
 * par l'événement `kn:leave`, pour que les menus ouverts se referment.
 * L'arrivée est entièrement en CSS (kn-page-veil.css).
 */
(function () {
  'use strict';

  // Filet de sécurité : une navigation qui n'aboutit pas (arrêt du
  // navigateur, réponse sans page) ne doit pas laisser le voile en place.
  var FAILSAFE = 8000;

  /** @type {HTMLElement|null} */
  var veil = null;
  /** @type {number|undefined} */
  var failsafeTimer;

  /**
   * Un lien interne qui mène à une autre page, cliqué sans touche de
   * modification (ces clics ouvrent un nouvel onglet).
   * @param {MouseEvent} event
   * @returns {boolean}
   */
  function isPageNavigation(event) {
    if (event.defaultPrevented || event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;

    var target = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!(target instanceof HTMLAnchorElement)) return false;
    if (target.target && target.target !== '_self') return false;
    if (target.hasAttribute('download')) return false;

    var url;
    try {
      url = new URL(target.href, window.location.href);
    } catch (error) {
      return false;
    }
    if (url.origin !== window.location.origin) return false;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

    return url.pathname !== window.location.pathname || url.search !== window.location.search;
  }

  /** Bas du header à l'écran : le voile commence juste dessous. */
  function headerBottom() {
    var group = document.getElementById('header-group');
    if (!group) return 0;
    return Math.max(0, Math.round(group.getBoundingClientRect().bottom));
  }

  function leave() {
    if (!veil || veil.classList.contains('is-active')) return;

    document.dispatchEvent(new CustomEvent('kn:leave'));
    document.documentElement.classList.add('kn-is-leaving');
    veil.style.setProperty('--kn-veil-top', headerBottom() + 'px');
    veil.classList.add('is-active');

    window.clearTimeout(failsafeTimer);
    failsafeTimer = window.setTimeout(reset, FAILSAFE);
  }

  function reset() {
    window.clearTimeout(failsafeTimer);
    document.documentElement.classList.remove('kn-is-leaving');
    if (veil) veil.classList.remove('is-active');
  }

  /** @param {MouseEvent} event */
  function onClick(event) {
    if (!isPageNavigation(event)) return;
    // Un script qui écoute après nous peut encore annuler le clic (tiroir
    // panier, panneau) : on ne part qu'une fois le clic entièrement traité.
    window.setTimeout(function () {
      if (!event.defaultPrevented) leave();
    }, 0);
  }

  function init() {
    veil = document.querySelector('[data-kn-veil]');
    if (!veil) return;
    // Dans l'éditeur de thème, les liens ne quittent pas l'aperçu.
    var shopify = /** @type {{ Shopify?: { designMode?: boolean } }} */ (/** @type {unknown} */ (window)).Shopify;
    if (shopify && shopify.designMode) return;

    document.addEventListener('click', onClick);
    // Retour arrière depuis le cache : la page revient telle qu'on l'a
    // quittée, voile compris. On le lève.
    window.addEventListener('pageshow', reset);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
