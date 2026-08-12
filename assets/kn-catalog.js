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

    /* ---- Chargement progressif ------------------------------------------ */

    var loadingMore = false;

    /**
     * Ajoute la page suivante à la suite du champ, sans rechargement.
     *
     * Le serveur renvoie la section entière : on lui prend ses cellules et son
     * bloc « voir plus », qui porte déjà l'adresse suivante et le compteur à
     * jour. Rien n'est recalculé ici. L'URL de la page n'est volontairement pas
     * réécrite : après six pages ajoutées, un retour arrière qui ne restituerait
     * que la sixième serait plus déroutant que l'absence d'historique.
     *
     * @param {HTMLButtonElement} button
     */
    function loadMore(button) {
      var url = button.getAttribute('data-kn-next-url');
      var grid = root.querySelector('[data-kn-grid]');
      var block = button.closest('[data-kn-more]');
      if (!url || !grid || !block || loadingMore) return;

      loadingMore = true;
      button.setAttribute('aria-busy', 'true');

      var separator = url.indexOf('?') === -1 ? '?' : '&';

      window
        .fetch(url + separator + 'section_id=' + encodeURIComponent(sectionId), {
          headers: { Accept: 'text/html' }
        })
        .then(function (response) {
          if (!response.ok) throw new Error('Page suivante indisponible (' + response.status + ')');
          return response.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var incoming = doc.getElementById('shopify-section-' + sectionId) || doc.body;
          var nextGrid = incoming.querySelector('[data-kn-grid]');
          if (!nextGrid) throw new Error('Page suivante illisible');

          var added = Array.prototype.slice.call(nextGrid.children);
          added.forEach(function (item) {
            grid.appendChild(item);
          });

          var nextBlock = incoming.querySelector('[data-kn-more]');
          if (nextBlock) {
            block.replaceWith(nextBlock);
          } else {
            block.remove();
          }

          // Le lecteur d'écran doit apprendre où l'on en est : le compteur
          // fraîchement rendu dit exactement cela.
          var status = root.querySelector('[data-kn-status]');
          var count = nextBlock ? nextBlock.querySelector('.kn-more__count') : null;
          if (status && count) status.textContent = count.textContent;

          // Le bouton vient d'être remplacé : on rend le focus à son
          // remplaçant, ou à défaut à la première pièce ajoutée.
          var successor = root.querySelector('[data-kn-load-more]');
          if (successor instanceof HTMLElement) {
            successor.focus({ preventScroll: true });
          } else if (added.length > 0) {
            var link = added[0].querySelector('[data-kn-card-link]');
            if (link instanceof HTMLElement) link.focus({ preventScroll: true });
          }

          if (window.KN && typeof window.KN.initReveal === 'function') window.KN.initReveal();
          loadingMore = false;
        })
        .catch(function () {
          // Repli : la pagination numérotée mène à la même page, en rechargeant.
          loadingMore = false;
          button.removeAttribute('aria-busy');
          window.location.assign(url);
        });
    }

    /* ---- Nuancier actif -------------------------------------------------- */

    /**
     * Peint un coloris dans le cadre image d'une carte.
     *
     * On remplace `src` et on neutralise `srcset` : laisser le jeu de sources
     * d'origine ferait réafficher l'image initiale au premier changement de
     * largeur. L'état d'origine est mémorisé une fois pour toutes sur l'image.
     *
     * @param {HTMLElement} card
     * @param {string} src Adresse à peindre. Vide = retour à l'image d'origine.
     */
    function paintCard(card, src) {
      var image = card.querySelector('.kn-card__img:not(.kn-card__img--alt)');
      if (!(image instanceof HTMLImageElement)) return;

      if (typeof image.dataset.knSrc !== 'string') {
        image.dataset.knSrc = image.getAttribute('src') || '';
        image.dataset.knSrcset = image.getAttribute('srcset') || '';
      }

      if (src) {
        image.setAttribute('src', src);
        image.setAttribute('srcset', '');
      } else {
        image.setAttribute('src', image.dataset.knSrc || '');
        image.setAttribute('srcset', image.dataset.knSrcset || '');
      }
    }

    /**
     * Rend à la carte le coloris retenu — ou son état d'origine si aucun.
     * @param {HTMLElement} card
     */
    function restoreCard(card) {
      var held = card.querySelector('[data-kn-card-swatch][aria-pressed="true"]');
      var src = held instanceof HTMLElement ? held.getAttribute('data-kn-src') : '';
      paintCard(card, src || '');
    }

    /**
     * Retient un coloris : le cadre le garde, le nom s'écrit sous le titre et
     * la carte pointe désormais vers la variante correspondante.
     * @param {HTMLElement} swatch
     */
    function holdSwatch(swatch) {
      var card = swatch.closest('[data-kn-card]');
      if (!(card instanceof HTMLElement)) return;

      var siblings = card.querySelectorAll('[data-kn-card-swatch]');
      Array.prototype.forEach.call(siblings, function (other) {
        other.setAttribute('aria-pressed', other === swatch ? 'true' : 'false');
      });

      var src = swatch.getAttribute('data-kn-src') || '';
      paintCard(card, src);
      card.dataset.knSwapped = src ? 'true' : 'false';

      var name = card.querySelector('[data-kn-card-colour]');
      var label = swatch.getAttribute('data-kn-name') || '';
      if (name && label) name.textContent = label;

      var link = card.querySelector('[data-kn-card-link]');
      var url = swatch.getAttribute('data-kn-url');
      if (link instanceof HTMLAnchorElement && url) link.setAttribute('href', url);
    }

    /** @param {Event} event */
    function onSwatchEnter(event) {
      if (!isElement(event.target)) return;
      var swatch = event.target.closest('[data-kn-card-swatch]');
      if (!(swatch instanceof HTMLElement)) return;
      var card = swatch.closest('[data-kn-card]');
      if (!(card instanceof HTMLElement)) return;
      paintCard(card, swatch.getAttribute('data-kn-src') || '');
    }

    /** @param {Event} event */
    function onSwatchLeave(event) {
      if (!isElement(event.target)) return;
      var swatch = event.target.closest('[data-kn-card-swatch]');
      if (!(swatch instanceof HTMLElement)) return;
      var card = swatch.closest('[data-kn-card]');
      if (card instanceof HTMLElement) restoreCard(card);
    }

    /* ---- Écoutes -------------------------------------------------------- */

    root.addEventListener('pointerover', onSwatchEnter);
    root.addEventListener('pointerout', onSwatchLeave);
    root.addEventListener('focusin', onSwatchEnter);
    root.addEventListener('focusout', onSwatchLeave);

    root.addEventListener('click', function (event) {
      if (!isElement(event.target)) return;

      var swatch = event.target.closest('[data-kn-card-swatch]');
      if (swatch instanceof HTMLElement) {
        holdSwatch(swatch);
        return;
      }

      var more = event.target.closest('[data-kn-load-more]');
      if (more instanceof HTMLButtonElement) {
        loadMore(more);
        return;
      }

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
