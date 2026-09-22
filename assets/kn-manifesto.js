/**
 * KINŪ — Manifeste : reflet qui suit le pointeur sur les plaques de verre.
 *
 * Pose la position du pointeur en variables CSS (--kn-mx, --kn-my) sur la
 * plaque survolée ; kn-manifesto.css en fait un halo de lumière. Réservé aux
 * pointeurs fins : au doigt, il n'y a pas de survol à suivre. Écrit une fois
 * par image au plus, pour ne jamais forcer de recalcul inutile.
 */
(function () {
  'use strict';

  var FINE_POINTER = '(hover: hover) and (pointer: fine)';
  var BOUND_ATTR = 'data-kn-glass-bound';

  /** @param {HTMLElement} plate */
  function bindPlate(plate) {
    if (plate.hasAttribute(BOUND_ATTR)) return;
    plate.setAttribute(BOUND_ATTR, '');

    var frame = 0;
    var lastX = 0;
    var lastY = 0;

    function paint() {
      frame = 0;
      var box = plate.getBoundingClientRect();
      plate.style.setProperty('--kn-mx', (lastX - box.left) + 'px');
      plate.style.setProperty('--kn-my', (lastY - box.top) + 'px');
    }

    plate.addEventListener('pointermove', function (event) {
      lastX = event.clientX;
      lastY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    });

    plate.addEventListener('pointerenter', function () {
      plate.classList.add('is-lit');
    });

    plate.addEventListener('pointerleave', function () {
      plate.classList.remove('is-lit');
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    });
  }

  /** @param {ParentNode} root */
  function init(root) {
    if (!window.matchMedia || !window.matchMedia(FINE_POINTER).matches) return;
    var plates = root.querySelectorAll('[data-kn-manifesto] [data-kn-glass]');
    Array.prototype.forEach.call(plates, bindPlate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init(document);
    });
  } else {
    init(document);
  }

  document.addEventListener('shopify:section:load', function (event) {
    var target = event.target;
    if (target && typeof target.querySelectorAll === 'function') init(target);
  });
})();
