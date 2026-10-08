/**
 * KINŪ — Indicateur de chargement
 *
 * Montre le symbole de la marque pendant trois attentes :
 * - un ajout ou une mise à jour du panier (événement standard Shopify
 *   `shopify:cart:lines-update`, dont la promesse dit quand c'est fini) ;
 * - un filtrage du catalogue (`data-kn-loading="true"`, posé par kn-catalog.js) ;
 * - un changement de page qui tarde.
 *
 * Chaque attente est comptée à part : le symbole reste tant qu'une seule
 * n'est pas finie. Il ne paraît qu'après SHOW_DELAY, pour ne pas clignoter
 * sur une réponse rapide, et reste au moins MIN_VISIBLE une fois paru.
 */
(function () {
  'use strict';

  var SHOW_DELAY = 200;
  var NAVIGATION_DELAY = 350;
  var MIN_VISIBLE = 450;
  // Filet de sécurité : une attente dont on n'apprend jamais la fin ne doit
  // pas laisser le symbole tourner indéfiniment.
  var FAILSAFE = 10000;

  /** @type {HTMLElement|null} */
  var root = null;
  /** @type {Set<string>} */
  var pending = new Set();
  /** @type {number|undefined} */
  var showTimer;
  /** @type {number|undefined} */
  var hideTimer;
  var shownAt = 0;
  var sequence = 0;

  function paint() {
    if (!root) return;

    if (pending.size > 0) {
      window.clearTimeout(hideTimer);
      if (root.classList.contains('is-active') || showTimer !== undefined) return;
      showTimer = window.setTimeout(function () {
        showTimer = undefined;
        if (!root || pending.size === 0) return;
        root.classList.add('is-active');
        shownAt = Date.now();
      }, SHOW_DELAY);
      return;
    }

    window.clearTimeout(showTimer);
    showTimer = undefined;
    if (!root.classList.contains('is-active')) return;
    var remaining = Math.max(0, MIN_VISIBLE - (Date.now() - shownAt));
    hideTimer = window.setTimeout(function () {
      if (root && pending.size === 0) root.classList.remove('is-active');
    }, remaining);
  }

  /**
   * Ouvre une attente et renvoie la fonction qui la ferme.
   * @param {string} [key] - Clé stable pour une attente qui peut se répéter.
   * @returns {() => void}
   */
  function begin(key) {
    sequence += 1;
    var id = key || 'wait-' + sequence;
    pending.add(id);
    paint();

    var failsafe = window.setTimeout(end, FAILSAFE);
    function end() {
      window.clearTimeout(failsafe);
      if (!pending.delete(id)) return;
      paint();
    }
    return end;
  }

  /** @param {Event} event */
  function onCartUpdate(event) {
    var end = begin();
    var promise = /** @type {{ promise?: Promise<unknown> }} */ (/** @type {unknown} */ (event)).promise;
    if (promise && typeof promise.then === 'function') {
      promise.then(end, end);
    }
  }

  /**
   * Un lien interne qui mène à une autre page. Les liens interceptés par un
   * script (tiroir panier, panneau de menu) ont déjà annulé leur clic.
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

    var samePage = url.pathname === window.location.pathname && url.search === window.location.search;
    return !samePage;
  }

  /** @param {MouseEvent} event */
  function onClick(event) {
    if (!isPageNavigation(event)) return;
    window.setTimeout(function () {
      if (document.visibilityState === 'visible') begin('navigation');
    }, NAVIGATION_DELAY - SHOW_DELAY);
  }

  /** Retour arrière depuis le cache : la page n'attend plus rien. */
  function onPageShow() {
    pending.clear();
    window.clearTimeout(showTimer);
    showTimer = undefined;
    if (root) root.classList.remove('is-active');
  }

  /** @type {Map<Element, () => void>} */
  var catalogWaits = new Map();

  /** @param {MutationRecord[]} records */
  function onCatalogMutation(records) {
    records.forEach(function (record) {
      var node = record.target;
      if (!(node instanceof HTMLElement)) return;
      var loading = node.dataset.knLoading === 'true';
      var end = catalogWaits.get(node);
      if (loading && !end) {
        catalogWaits.set(node, begin());
      } else if (!loading && end) {
        catalogWaits.delete(node);
        end();
      }
    });
  }

  function init() {
    root = document.querySelector('[data-kn-loader]');
    if (!root) return;

    // En capture : l'événement est émis sur le formulaire, et la capture le
    // reçoit au niveau du document qu'il remonte ou non.
    document.addEventListener('shopify:cart:lines-update', onCartUpdate, true);
    document.addEventListener('click', onClick);
    window.addEventListener('pageshow', onPageShow);

    new MutationObserver(onCatalogMutation).observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-kn-loading']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
