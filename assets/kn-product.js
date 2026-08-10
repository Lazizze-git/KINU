/**
 * KINŪ — Page produit
 *
 * Galerie, lightbox, sélecteurs de variantes, quantité, bandeau collant.
 *
 * Le tunnel d'achat n'est PAS réécrit : le formulaire reste le
 * `<product-form-component>` d'Horizon (assets/product-form.js), qui envoie
 * l'Ajax vers `/cart/add`, émet `CartLinesUpdateEvent` (assets/events.js) et
 * déclenche l'ouverture du tiroir panier (assets/cart-drawer.js) ainsi que la
 * mise à jour du compteur d'en-tête. Ce script se contente d'écrire
 * l'identifiant de la variante choisie dans le champ `input[name="id"]`.
 *
 * Chargé en `defer`, après kn-base.js. Voir DIRECTION-ARTISTIQUE.md §7.7, §8.
 */
(function () {
  'use strict';

  var ROOT_SELECTOR = '[data-kn-product]';
  var DESKTOP_QUERY = '(min-width: 1024px)';

  /**
   * @typedef {object} KnVariant
   * @property {number} id
   * @property {boolean} available
   * @property {string[]} options
   * @property {string} title
   * @property {string} price
   * @property {string|null} compare
   * @property {string} sku
   * @property {number|null} media
   * @property {string} url
   */

  /**
   * @param {ParentNode} scope
   * @param {string} selector
   * @returns {HTMLElement|null}
   */
  function one(scope, selector) {
    return /** @type {HTMLElement|null} */ (scope.querySelector(selector));
  }

  /**
   * @param {ParentNode} scope
   * @param {string} selector
   * @returns {HTMLElement[]}
   */
  function all(scope, selector) {
    return /** @type {HTMLElement[]} */ (Array.prototype.slice.call(scope.querySelectorAll(selector)));
  }

  /** @returns {boolean} */
  function reducedMotion() {
    return Boolean(window.KN && window.KN.prefersReducedMotion && window.KN.prefersReducedMotion.matches);
  }

  /** @param {boolean} locked */
  function lockScroll(locked) {
    if (window.KN && typeof window.KN.lockScroll === 'function') window.KN.lockScroll(locked);
  }

  /* ------------------------------------------------------------------------
     Galerie
     ---------------------------------------------------------------------- */

  /**
   * @param {HTMLElement} root
   * @returns {{goTo:(i:number)=>void, showMedia:(id:number)=>void}|null}
   */
  function createGallery(root) {
    var gallery = one(root, '[data-kn-gallery]');
    var track = gallery && one(gallery, '[data-kn-track]');
    if (!gallery || !track) return null;

    var slides = all(gallery, '[data-kn-slide]');
    if (slides.length === 0) return null;

    var thumbs = all(gallery, '[data-kn-thumb]');
    var dots = all(gallery, '[data-kn-dot]');
    var desktop = window.matchMedia(DESKTOP_QUERY);
    var byMedia = {};
    var current = 0;
    var ticking = false;

    slides.forEach(function (slide, index) {
      var id = slide.getAttribute('data-kn-media-id');
      if (id) byMedia[id] = index;
    });

    /** @param {number} index */
    function paint(index) {
      current = index;
      slides.forEach(function (slide, n) {
        slide.classList.toggle('is-active', n === index);
      });
      thumbs.forEach(function (thumb, n) {
        var active = n === index;
        thumb.classList.toggle('is-active', active);
        thumb.setAttribute('aria-current', active ? 'true' : 'false');
      });
      dots.forEach(function (dot, n) {
        dot.classList.toggle('is-active', n === index);
      });
    }

    /** @param {number} index */
    function goTo(index) {
      if (index < 0 || index >= slides.length) return;
      var moved = index !== current;
      paint(index);
      if (moved && !desktop.matches) {
        track.scrollTo({
          left: index * track.clientWidth,
          behavior: reducedMotion() ? 'auto' : 'smooth'
        });
      }
    }

    track.addEventListener(
      'scroll',
      function () {
        if (desktop.matches || ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          ticking = false;
          var width = track.clientWidth;
          if (!width) return;
          var index = Math.round(track.scrollLeft / width);
          if (index !== current && index >= 0 && index < slides.length) paint(index);
        });
      },
      { passive: true }
    );

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        goTo(parseInt(thumb.getAttribute('data-kn-index') || '0', 10));
      });
    });

    paint(0);

    return {
      goTo: goTo,
      showMedia: function (id) {
        var index = byMedia[String(id)];
        if (typeof index === 'number') goTo(index);
      }
    };
  }

  /* ------------------------------------------------------------------------
     Lightbox
     ---------------------------------------------------------------------- */

  /**
   * @param {HTMLElement} root
   * @param {ReturnType<typeof createGallery>} gallery
   * @returns {{open:(i:number)=>void}|null}
   */
  function createLightbox(root, gallery) {
    var box = one(root, '[data-kn-lightbox]');
    var track = box && one(box, '[data-kn-lb-track]');
    if (!box || !track) return null;

    var slides = all(box, '[data-kn-lb-slide]');
    var counter = one(box, '[data-kn-lb-count]');
    var closeButton = one(box, '[data-kn-lb-close]');
    var previousButton = one(box, '[data-kn-lb-prev]');
    var nextButton = one(box, '[data-kn-lb-next]');
    var current = 0;
    var ticking = false;
    /** @type {Element|null} */
    var restoreFocus = null;
    /** @type {((event: KeyboardEvent) => void)|null} */
    var trap = null;

    /** @param {number} index */
    function setCounter(index) {
      current = index;
      if (counter) counter.textContent = index + 1 + ' / ' + slides.length;
    }

    /**
     * @param {number} index
     * @param {ScrollBehavior} behavior
     */
    function goTo(index, behavior) {
      if (index < 0 || index >= slides.length) return;
      setCounter(index);
      track.scrollTo({ left: index * track.clientWidth, behavior: behavior });
    }

    /** @param {KeyboardEvent} event */
    function onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (event.key === 'ArrowRight') {
        goTo(current + 1, 'auto');
      } else if (event.key === 'ArrowLeft') {
        goTo(current - 1, 'auto');
      }
    }

    function close() {
      box.hidden = true;
      lockScroll(false);
      document.removeEventListener('keydown', onKeydown);
      if (trap) box.removeEventListener('keydown', /** @type {EventListener} */ (trap));
      trap = null;
      if (gallery) gallery.goTo(current);
      if (restoreFocus instanceof HTMLElement) restoreFocus.focus();
      restoreFocus = null;
    }

    /** @param {number} index */
    function open(index) {
      restoreFocus = document.activeElement;
      box.hidden = false;
      // Force un calcul de mise en page : sans cela, la piste n'a pas encore
      // de largeur et le défilement initial partirait à zéro.
      void track.clientWidth;
      goTo(index, 'auto');
      lockScroll(true);
      if (window.KN && typeof window.KN.createFocusTrap === 'function') {
        trap = window.KN.createFocusTrap(box);
        box.addEventListener('keydown', /** @type {EventListener} */ (trap));
      }
      document.addEventListener('keydown', onKeydown);
      if (closeButton) closeButton.focus();
    }

    track.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          ticking = false;
          var width = track.clientWidth;
          if (!width) return;
          var index = Math.round(track.scrollLeft / width);
          if (index !== current && index >= 0 && index < slides.length) setCounter(index);
        });
      },
      { passive: true }
    );

    if (closeButton) closeButton.addEventListener('click', close);
    if (previousButton) {
      previousButton.addEventListener('click', function () {
        goTo(current - 1, reducedMotion() ? 'auto' : 'smooth');
      });
    }
    if (nextButton) {
      nextButton.addEventListener('click', function () {
        goTo(current + 1, reducedMotion() ? 'auto' : 'smooth');
      });
    }

    return { open: open };
  }

  /* ------------------------------------------------------------------------
     Sélecteurs de variantes
     ---------------------------------------------------------------------- */

  /**
   * @param {HTMLElement} root
   * @returns {KnVariant[]}
   */
  function readVariants(root) {
    var node = one(root, '[data-kn-variants]');
    if (!node || !node.textContent) return [];
    try {
      var parsed = JSON.parse(node.textContent);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * @param {HTMLElement} root
   * @param {ReturnType<typeof createGallery>} gallery
   */
  function createPicker(root, gallery) {
    var variants = readVariants(root);
    var idInput = /** @type {HTMLInputElement|null} */ (one(root, 'input[name="id"]'));
    if (variants.length === 0 || !idInput) return;

    var groups = all(root, '[data-kn-option-group]').sort(function (a, b) {
      return Number(a.dataset.knOptionIndex) - Number(b.dataset.knOptionIndex);
    });
    var buttons = /** @type {HTMLButtonElement[]} */ (all(root, '[data-kn-atc]'));
    var labels = all(root, '[data-kn-btn-label]');
    var prices = all(root, '[data-kn-price]');
    var compare = one(root, '[data-kn-compare]');
    var skuRow = one(root, '[data-kn-sku-row]');
    var sku = one(root, '[data-kn-sku]');
    var availability = one(root, '[data-kn-availability]');
    var availabilityDot = one(root, '[data-kn-availability-dot]');
    var live = one(root, '[data-kn-live]');
    var pickup = one(root, '[data-kn-pickup]');
    /** @type {AbortController|null} */
    var pickupRequest = null;

    var text = {
      add: root.dataset.knLabelAdd || '',
      soldOut: root.dataset.knLabelSoldOut || '',
      unavailable: root.dataset.knLabelUnavailable || '',
      inStock: root.dataset.knLabelInStock || '',
      selected: root.dataset.knLabelSelected || ''
    };

    /** @returns {(string|null)[]} */
    function selection() {
      return groups.map(function (group) {
        if (typeof group.dataset.knValue === 'string') return group.dataset.knValue;
        var checked = /** @type {HTMLInputElement|null} */ (
          group.querySelector('[data-kn-option-input]:checked')
        );
        return checked ? checked.value : null;
      });
    }

    /**
     * @param {KnVariant} variant
     * @param {(string|null)[]} choice
     * @returns {boolean}
     */
    function fits(variant, choice) {
      return choice.every(function (value, index) {
        return value === null || variant.options[index] === value;
      });
    }

    /**
     * @param {(string|null)[]} choice
     * @returns {KnVariant|null}
     */
    function exact(choice) {
      for (var i = 0; i < variants.length; i += 1) {
        var candidate = variants[i];
        var same = true;
        for (var j = 0; j < choice.length; j += 1) {
          if (candidate.options[j] !== choice[j]) {
            same = false;
            break;
          }
        }
        if (same) return candidate;
      }
      return null;
    }

    /** @param {(string|null)[]} choice */
    function refreshOptionStates(choice) {
      groups.forEach(function (group, groupIndex) {
        var value = one(group, '[data-kn-option-value]');
        if (value && typeof choice[groupIndex] === 'string') value.textContent = choice[groupIndex];

        all(group, '[data-kn-option-item]').forEach(function (item) {
          var input = /** @type {HTMLInputElement|null} */ (one(item, '[data-kn-option-input]'));
          if (!input) return;
          var probe = choice.slice();
          probe[groupIndex] = input.value;
          var reachable = variants.some(function (variant) {
            return variant.available && fits(variant, probe);
          });
          item.setAttribute('data-kn-unavailable', reachable ? 'false' : 'true');
          var note = one(item, '[data-kn-option-oos]');
          if (note) note.hidden = reachable;
        });
      });
    }

    /** @param {KnVariant} variant */
    function pushUrl(variant) {
      if (!window.history || typeof window.history.replaceState !== 'function') return;
      try {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', String(variant.id));
        window.history.replaceState({}, '', url.toString());
      } catch (error) {
        // L'adresse n'a pas pu être réécrite : sans conséquence sur l'achat.
      }
    }

    /** @param {KnVariant} variant */
    function refreshPickup(variant) {
      if (!pickup) return;
      var url = root.dataset.knProductUrl;
      var sectionId = root.dataset.knSectionId;
      if (!url || !sectionId) return;

      if (pickupRequest) pickupRequest.abort();
      pickupRequest = new AbortController();

      fetch(url + '?variant=' + variant.id + '&section_id=' + sectionId, {
        signal: pickupRequest.signal,
        credentials: 'same-origin'
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Retrait en magasin indisponible');
          return response.text();
        })
        .then(function (html) {
          var next = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-kn-pickup]');
          if (!next) {
            pickup.hidden = true;
            return;
          }
          pickup.innerHTML = next.innerHTML;
          pickup.hidden = false;
        })
        .catch(function (error) {
          if (error && error.name === 'AbortError') return;
          pickup.hidden = true;
        });
    }

    /** @param {boolean} announce */
    function update(announce) {
      var choice = selection();
      var variant = exact(choice);
      var canAdd = Boolean(variant && variant.available);
      var label = variant ? (variant.available ? text.add : text.soldOut) : text.unavailable;

      refreshOptionStates(choice);

      idInput.value = variant ? String(variant.id) : '';
      buttons.forEach(function (button) {
        button.disabled = !canAdd;
      });
      labels.forEach(function (node) {
        node.textContent = label;
      });

      if (availability) availability.textContent = canAdd ? text.inStock : label;
      if (availabilityDot) availabilityDot.setAttribute('data-kn-in-stock', canAdd ? 'true' : 'false');

      if (variant) {
        prices.forEach(function (node) {
          node.textContent = variant.price;
        });
        if (compare) {
          compare.textContent = variant.compare || '';
          compare.hidden = !variant.compare;
        }
        if (sku) sku.textContent = variant.sku;
        if (skuRow) skuRow.hidden = !variant.sku;
        if (gallery && variant.media !== null) gallery.showMedia(variant.media);
        if (announce) {
          pushUrl(variant);
          refreshPickup(variant);
        }
      }

      if (announce && live) {
        var name = variant ? variant.title : choice.filter(Boolean).join(' / ');
        live.textContent = name + ' ' + text.selected + ' — ' + (variant ? variant.price + ' — ' : '') + label;
      }
    }

    root.addEventListener('change', function (event) {
      var target = event.target;
      if (target instanceof HTMLElement && target.hasAttribute('data-kn-option-input')) update(true);
    });

    update(false);
  }

  /* ------------------------------------------------------------------------
     Quantité
     ---------------------------------------------------------------------- */

  /** @param {HTMLElement} root */
  function createQuantity(root) {
    var input = /** @type {HTMLInputElement|null} */ (one(root, '[data-kn-qty-input]'));
    if (!input) return;

    /** @returns {number} */
    function floor() {
      return parseInt(input.min, 10) || 1;
    }

    function normalise() {
      var value = parseInt(input.value, 10);
      input.value = String(!value || value < floor() ? floor() : value);
    }

    all(root, '[data-kn-qty-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        var step = parseInt(button.dataset.knQtyStep || '1', 10) || 1;
        input.value = String(Math.max(floor(), (parseInt(input.value, 10) || floor()) + step));
      });
    });

    input.addEventListener('change', normalise);
    input.addEventListener('blur', normalise);
  }

  /* ------------------------------------------------------------------------
     Bandeau d'achat collant (mobile)
     ---------------------------------------------------------------------- */

  /** @param {HTMLElement} root */
  function createStickyBar(root) {
    var bar = one(root, '[data-kn-sticky]');
    var anchor = one(root, '[data-kn-atc-anchor]');
    if (!bar || !anchor || typeof IntersectionObserver === 'undefined') return;

    bar.hidden = false;

    new IntersectionObserver(
      function (entries) {
        var entry = entries[0];
        if (!entry) return;
        var scrolledPast = entry.boundingClientRect.top < 0;
        bar.classList.toggle('is-visible', !entry.isIntersecting && scrolledPast);
      },
      { threshold: 0 }
    ).observe(anchor);
  }

  /* ------------------------------------------------------------------------
     Amorçage
     ---------------------------------------------------------------------- */

  /** @param {HTMLElement} root */
  function initRoot(root) {
    if (root.dataset.knReady === 'true') return;
    root.dataset.knReady = 'true';

    var gallery = createGallery(root);
    var lightbox = createLightbox(root, gallery);

    if (lightbox) {
      all(root, '[data-kn-zoom]').forEach(function (button) {
        button.addEventListener('click', function () {
          lightbox.open(parseInt(button.getAttribute('data-kn-index') || '0', 10));
        });
      });
    }

    createQuantity(root);
    createPicker(root, gallery);
    createStickyBar(root);
  }

  /** @param {ParentNode} [scope] */
  function init(scope) {
    all(scope || document, ROOT_SELECTOR).forEach(initRoot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
    });
  } else {
    init();
  }

  // Le thème réinjecte des sections au fil de l'eau (éditeur, recommandations).
  document.addEventListener('shopify:section:load', function (event) {
    var target = event.target;
    init(target instanceof Element ? target : document);
  });
})();
