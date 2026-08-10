/**
 * KINŪ — Catalogue
 *
 * Transforme le panneau de filtres en drawer latéral et met à jour la grille
 * sans rechargement (API de rendu de section de Shopify).
 *
 * Sans JavaScript, la page reste entièrement utilisable : le panneau s'affiche
 * en ligne et le formulaire GET recharge la page. Ici on n'ajoute que du
 * confort — si une requête échoue, on retombe sur une navigation classique.
 *
 * Voir DIRECTION-ARTISTIQUE.md §7.7, §8.
 */
(function () {
  'use strict';

  /** Durée d'un déplacement de plan, alignée sur --kn-dur-4 (DA §8). */
  var DRAWER_MS = 560;

  /** Temporisation des champs de prix, saisis caractère par caractère. */
  var PRICE_DEBOUNCE_MS = 500;

  var initialised = new WeakSet();

  /**
   * Rendu de la section actuellement montée, rejoué au retour arrière.
   * @type {((url: string) => void) | null}
   */
  var activeRender = null;

  /**
   * @param {unknown} value
   * @returns {value is Element}
   */
  function isElement(value) {
    return value instanceof Element;
  }

  /**
   * Recopie le contenu d'une région depuis le document fraîchement rendu.
   * @param {ParentNode} source
   * @param {ParentNode} target
   * @param {string} selector
   */
  function replaceRegion(source, target, selector) {
    var next = source.querySelector(selector);
    var current = target.querySelector(selector);
    if (next && current) current.innerHTML = next.innerHTML;
  }

  /**
   * @param {HTMLElement} root Racine de la section collection.
   */
  function setupSection(root) {
    if (initialised.has(root)) return;
    initialised.add(root);

    var sectionId = root.dataset.knSectionId || '';
    var panel = /** @type {HTMLElement | null} */ (root.querySelector('[data-kn-facets]'));
    var scrim = /** @type {HTMLElement | null} */ (root.querySelector('[data-kn-facets-scrim]'));
    var form = /** @type {HTMLFormElement | null} */ (root.querySelector('[data-kn-facets-form]'));

    if (!panel || !form) return;

    root.setAttribute('data-kn-enhanced', '');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');

    var trapHandler = null;
    var lastFocused = null;
    var hideScrimTimer = 0;
    var debounceTimer = 0;
    var requestId = 0;

    /* ---- Drawer --------------------------------------------------------- */

    function onKeydown(event) {
      if (event.key === 'Escape') closePanel();
    }

    function openPanel() {
      if (panel.dataset.knOpen === 'true') return;
      lastFocused = document.activeElement;
      window.clearTimeout(hideScrimTimer);

      if (scrim) scrim.hidden = false;
      window.requestAnimationFrame(function () {
        panel.dataset.knOpen = 'true';
        if (scrim) scrim.dataset.knOpen = 'true';
      });

      var trigger = root.querySelector('[data-kn-facets-open]');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');

      if (window.KN && typeof window.KN.lockScroll === 'function') window.KN.lockScroll(true);
      if (window.KN && typeof window.KN.createFocusTrap === 'function') {
        trapHandler = window.KN.createFocusTrap(panel);
        document.addEventListener('keydown', trapHandler);
      }
      document.addEventListener('keydown', onKeydown);

      var closeButton = panel.querySelector('[data-kn-facets-close]');
      if (closeButton instanceof HTMLElement) closeButton.focus();
    }

    function closePanel() {
      if (panel.dataset.knOpen !== 'true') return;
      panel.dataset.knOpen = 'false';
      if (scrim) scrim.dataset.knOpen = 'false';

      var trigger = root.querySelector('[data-kn-facets-open]');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');

      if (window.KN && typeof window.KN.lockScroll === 'function') window.KN.lockScroll(false);
      if (trapHandler) {
        document.removeEventListener('keydown', trapHandler);
        trapHandler = null;
      }
      document.removeEventListener('keydown', onKeydown);

      hideScrimTimer = window.setTimeout(function () {
        if (scrim) scrim.hidden = true;
      }, DRAWER_MS);

      if (lastFocused instanceof HTMLElement) lastFocused.focus();
      lastFocused = null;
    }

    /* ---- Rendu ---------------------------------------------------------- */

    /** @returns {string} URL correspondant à l'état courant du formulaire. */
    function buildUrl() {
      var params = new URLSearchParams();
      new FormData(form).forEach(function (value, key) {
        if (typeof value === 'string' && value.trim() !== '') params.append(key, value);
      });
      var base = form.getAttribute('action') || window.location.pathname;
      var query = params.toString();
      return query ? base + '?' + query : base;
    }

    /**
     * @param {Document} doc Document renvoyé par l'API de rendu de section.
     */
    function swap(doc) {
      var incoming = doc.getElementById('shopify-section-' + sectionId) || doc.body;
      var activeId = document.activeElement ? document.activeElement.id : '';

      replaceRegion(incoming, root, '[data-kn-results]');
      replaceRegion(incoming, root, '[data-kn-facets-body]');
      replaceRegion(incoming, root, '[data-kn-filter-count]');

      var status = root.querySelector('[data-kn-status]');
      var nextStatus = incoming.querySelector('[data-kn-status]');
      if (status && nextStatus) status.textContent = nextStatus.textContent;

      var clear = root.querySelector('[data-kn-toolbar-clear]');
      var nextClear = incoming.querySelector('[data-kn-toolbar-clear]');
      if (clear && nextClear) clear.toggleAttribute('hidden', nextClear.hasAttribute('hidden'));

      var sort = root.querySelector('[data-kn-sort]');
      var nextSort = incoming.querySelector('[data-kn-sort]');
      if (sort instanceof HTMLSelectElement && nextSort instanceof HTMLSelectElement) {
        if (sort !== document.activeElement) sort.value = nextSort.value;
      }

      if (activeId) {
        var restored = document.getElementById(activeId);
        if (restored instanceof HTMLElement) restored.focus({ preventScroll: true });
      }

      if (window.KN && typeof window.KN.initReveal === 'function') window.KN.initReveal();
    }

    /**
     * @param {string} url
     * @param {{ push?: boolean, scroll?: boolean }} [options]
     */
    function render(url, options) {
      var opts = options || {};
      var ticket = ++requestId;
      var separator = url.indexOf('?') === -1 ? '?' : '&';
      root.dataset.knLoading = 'true';

      window
        .fetch(url + separator + 'section_id=' + encodeURIComponent(sectionId), {
          headers: { Accept: 'text/html' }
        })
        .then(function (response) {
          if (!response.ok) throw new Error('Rendu de section indisponible (' + response.status + ')');
          return response.text();
        })
        .then(function (html) {
          if (ticket !== requestId) return;
          swap(new DOMParser().parseFromString(html, 'text/html'));
          if (opts.push !== false) window.history.pushState({ knCatalog: true }, '', url);
          if (opts.scroll) {
            var anchor = root.querySelector('.kn-toolbar');
            if (anchor instanceof HTMLElement) anchor.scrollIntoView({ block: 'start' });
          }
          root.dataset.knLoading = 'false';
        })
        .catch(function () {
          if (ticket !== requestId) return;
          // Repli : une navigation classique donne le même résultat, en moins fluide.
          window.location.assign(url);
        });
    }

    /** @param {number} delay */
    function apply(delay) {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(function () {
        render(buildUrl(), { scroll: false });
      }, delay);
    }

    /* ---- Écoutes -------------------------------------------------------- */

    root.addEventListener('click', function (event) {
      if (!isElement(event.target)) return;

      if (event.target.closest('[data-kn-facets-open]')) {
        openPanel();
        return;
      }
      if (event.target.closest('[data-kn-facets-close]')) {
        closePanel();
        return;
      }

      // Cmd/Ctrl/Maj/clic du milieu : on laisse le navigateur ouvrir l'onglet.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }

      var clear = event.target.closest('[data-kn-clear]');
      if (clear instanceof HTMLAnchorElement) {
        event.preventDefault();
        closePanel();
        render(clear.getAttribute('href') || form.getAttribute('action') || '', { scroll: false });
        return;
      }

      var page = event.target.closest('.kn-pagination a');
      if (page instanceof HTMLAnchorElement) {
        event.preventDefault();
        render(page.getAttribute('href') || '', { scroll: true });
      }
    });

    if (scrim) {
      scrim.addEventListener('click', closePanel);
    }

    root.addEventListener('change', function (event) {
      var field = event.target;
      if (!(field instanceof HTMLInputElement) && !(field instanceof HTMLSelectElement)) return;
      if (!field.name || field.type === 'number') return;
      if (!field.closest('[data-kn-facets-form]') && !field.hasAttribute('data-kn-sort')) return;
      apply(0);
    });

    root.addEventListener('input', function (event) {
      var field = event.target;
      if (!(field instanceof HTMLInputElement)) return;
      if (field.type !== 'number' || !field.name) return;
      if (!field.closest('[data-kn-facets-form]')) return;
      apply(PRICE_DEBOUNCE_MS);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      closePanel();
      apply(0);
    });

    activeRender = function (url) {
      render(url, { push: false, scroll: false });
    };
  }

  window.addEventListener('popstate', function () {
    if (activeRender) activeRender(window.location.href);
  });

  function init() {
    var sections = document.querySelectorAll('[data-kn-collection]');
    Array.prototype.forEach.call(sections, function (section) {
      if (section instanceof HTMLElement) setupSection(section);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', init);
})();
