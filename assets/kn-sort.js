/**
 * KINŪ — Menu de tri
 *
 * Le panneau déroulant d'un <select> est dessiné par le système, pas par la
 * page : aucune feuille de style ne peut l'atteindre. On le remplace donc par
 * une liste construite ici, à partir des options du select lui-même.
 *
 * Le select n'est jamais retiré : il garde son nom, son rattachement au
 * formulaire de filtres et son attribut data-kn-sort. kn-catalog.js continue
 * de l'écouter et de le resynchroniser après chaque rendu sans rien savoir de
 * ce menu. On se contente de poser sa valeur puis d'émettre `change`.
 *
 * Sans JavaScript, rien de tout ceci n'existe et le menu natif s'affiche.
 */
(function () {
  'use strict';

  /** Doit rester aligné sur --kn-dur-2 dans kn-sort.css. */
  var CLOSE_MS = 160;

  var initialised = new WeakSet();
  var counter = 0;

  /**
   * @param {unknown} value
   * @returns {value is Element}
   */
  function isElement(value) {
    return value instanceof Element;
  }

  /**
   * @param {HTMLElement} host Conteneur `.kn-toolbar__sort`.
   */
  function setup(host) {
    if (initialised.has(host)) return;

    var select = host.querySelector('[data-kn-sort]');
    if (!(select instanceof HTMLSelectElement) || select.options.length === 0) return;

    initialised.add(host);
    counter += 1;

    var panelId = 'kn-sortmenu-' + counter;
    var labelNode = host.querySelector('label');
    var labelText = labelNode ? (labelNode.textContent || '').trim() : '';

    // Hors du parcours au clavier : c'est le déclencheur qui le remplace.
    select.setAttribute('tabindex', '-1');
    select.setAttribute('aria-hidden', 'true');

    var ui = document.createElement('div');
    ui.className = 'kn-sortmenu';

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'kn-label kn-sortmenu__trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', panelId);
    if (labelText) trigger.setAttribute('aria-label', labelText);

    var valueNode = document.createElement('span');
    valueNode.className = 'kn-sortmenu__value';
    trigger.appendChild(valueNode);

    var svgNS = 'http://www.w3.org/2000/svg';
    var caret = document.createElementNS(svgNS, 'svg');
    caret.setAttribute('class', 'kn-sortmenu__caret');
    caret.setAttribute('viewBox', '0 0 12 8');
    caret.setAttribute('aria-hidden', 'true');
    caret.setAttribute('focusable', 'false');
    var path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M1 1.5 6 6.5 11 1.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.5');
    caret.appendChild(path);
    trigger.appendChild(caret);

    var panel = document.createElement('div');
    panel.className = 'kn-sortmenu__panel';
    panel.id = panelId;
    panel.setAttribute('role', 'listbox');
    panel.setAttribute('tabindex', '-1');
    if (labelText) panel.setAttribute('aria-label', labelText);
    panel.hidden = true;

    /** @type {HTMLElement[]} */
    var items = [];

    Array.prototype.forEach.call(select.options, function (option, index) {
      var item = document.createElement('div');
      item.className = 'kn-label kn-sortmenu__option';
      item.id = panelId + '-' + index;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', 'false');
      item.dataset.knValue = option.value;
      item.textContent = (option.textContent || '').trim();
      panel.appendChild(item);
      items.push(item);
    });

    ui.appendChild(trigger);
    ui.appendChild(panel);
    host.appendChild(ui);
    host.setAttribute('data-kn-sort-enhanced', '');

    var isOpen = false;
    var activeIndex = 0;
    var closeTimer = 0;

    /** @returns {number} Rang de l'option correspondant à la valeur du select. */
    function selectedIndex() {
      for (var i = 0; i < items.length; i += 1) {
        if (items[i].dataset.knValue === select.value) return i;
      }
      return select.selectedIndex > -1 ? select.selectedIndex : 0;
    }

    /**
     * Recopie l'état du select dans le menu.
     * Appelé aussi après un rendu de section : kn-catalog.js y repose
     * `select.value` directement, sans émettre d'événement.
     */
    function sync() {
      var index = selectedIndex();
      items.forEach(function (item, i) {
        item.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      valueNode.textContent = items[index] ? items[index].textContent : '';
    }

    /** @param {number} index */
    function setActive(index) {
      if (items.length === 0) return;
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      activeIndex = index;
      items.forEach(function (item, i) {
        item.classList.toggle('is-active', i === index);
      });
      panel.setAttribute('aria-activedescendant', items[index].id);
      items[index].scrollIntoView({ block: 'nearest' });
    }

    function open() {
      if (isOpen) return;
      isOpen = true;
      window.clearTimeout(closeTimer);
      sync();
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      window.requestAnimationFrame(function () {
        panel.dataset.knOpen = 'true';
      });
      setActive(selectedIndex());
      panel.focus();
      document.addEventListener('pointerdown', onOutside, true);
    }

    /** @param {boolean} refocus */
    function close(refocus) {
      if (!isOpen) return;
      isOpen = false;
      panel.dataset.knOpen = 'false';
      trigger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('pointerdown', onOutside, true);

      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(function () {
        if (!isOpen) panel.hidden = true;
      }, CLOSE_MS);

      if (refocus) trigger.focus();
    }

    /** @param {Event} event */
    function onOutside(event) {
      if (!isElement(event.target) || !ui.contains(event.target)) close(false);
    }

    /** @param {number} index */
    function choose(index) {
      var item = items[index];
      if (!item) return;
      close(true);
      if (item.dataset.knValue === select.value) return;
      select.value = item.dataset.knValue || '';
      sync();
      // C'est cet événement que kn-catalog.js attend pour relancer le rendu.
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    trigger.addEventListener('click', function () {
      if (isOpen) close(true);
      else open();
    });

    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });

    panel.addEventListener('keydown', function (event) {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          close(true);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setActive(activeIndex + 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setActive(activeIndex - 1);
          break;
        case 'Home':
          event.preventDefault();
          setActive(0);
          break;
        case 'End':
          event.preventDefault();
          setActive(items.length - 1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          choose(activeIndex);
          break;
        case 'Tab':
          close(false);
          break;
      }
    });

    panel.addEventListener('click', function (event) {
      if (!isElement(event.target)) return;
      var item = event.target.closest('.kn-sortmenu__option');
      if (!(item instanceof HTMLElement)) return;
      choose(items.indexOf(item));
    });

    panel.addEventListener('pointermove', function (event) {
      if (!isElement(event.target)) return;
      var item = event.target.closest('.kn-sortmenu__option');
      if (item instanceof HTMLElement) setActive(items.indexOf(item));
    });

    select.addEventListener('change', sync);

    // Retour arrière : kn-catalog.js refait un rendu, on se recale après lui.
    window.addEventListener('popstate', function () {
      window.setTimeout(sync, 400);
    });

    sync();
  }

  function init() {
    var hosts = document.querySelectorAll('.kn-toolbar__sort');
    Array.prototype.forEach.call(hosts, function (host) {
      if (host instanceof HTMLElement) setup(host);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', init);
})();
