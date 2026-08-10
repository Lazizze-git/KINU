/**
 * KINŪ — kn-home : comportements de la page d'accueil.
 *
 * Trois responsabilités, et rien d'autre :
 *  1. la bannière vidéo (sources posées en JS, donc jamais téléchargées quand
 *     le visiteur refuse le mouvement — DIRECTION-ARTISTIQUE.md §8) ;
 *  2. le drapeau `kn-header--over-media` sur <body>, lu par le header ;
 *  3. le message du formulaire newsletter, restreint au formulaire réellement
 *     soumis quand plusieurs coexistent sur la page.
 *
 * Chargé en `defer`, après kn-base.js. Survit à l'éditeur de thème.
 */
(function () {
  'use strict';

  /** Part visible en dessous de laquelle la vidéo est mise en pause. */
  var VISIBILITY_THRESHOLD = 0.1;

  var motion =
    (window.KN && window.KN.prefersReducedMotion) ||
    window.matchMedia('(prefers-reduced-motion: reduce)');

  /** @type {IntersectionObserver | null} Observateur partagé par toutes les bannières. */
  var visibilityObserver = null;

  /**
   * Lance la lecture en absorbant le refus d'autoplay du navigateur :
   * dans ce cas le poster reste affiché, ce qui est le comportement voulu.
   * @param {HTMLVideoElement} video
   */
  function attemptPlay(video) {
    var attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {
        video.classList.remove('is-playing');
      });
    }
  }

  /**
   * @param {IntersectionObserverEntry[]} entries
   */
  function handleVisibility(entries) {
    entries.forEach(function (entry) {
      var video = /** @type {HTMLVideoElement} */ (entry.target);
      if (entry.isIntersecting) {
        attemptPlay(video);
      } else {
        video.pause();
      }
    });
  }

  /**
   * @returns {IntersectionObserver | null}
   */
  function getVisibilityObserver() {
    if (visibilityObserver) return visibilityObserver;
    if (typeof IntersectionObserver === 'undefined') return null;
    visibilityObserver = new IntersectionObserver(handleVisibility, {
      threshold: VISIBILITY_THRESHOLD
    });
    return visibilityObserver;
  }

  /**
   * Pose la source MP4 et démarre la lecture. La vidéo ne se substitue au
   * poster qu'une fois qu'elle joue réellement : aucun cadre noir.
   * @param {HTMLVideoElement} video
   */
  function startVideo(video) {
    if (video.dataset.knReady === 'true') {
      attemptPlay(video);
      return;
    }

    var src = video.dataset.knSrc;
    if (!src) return;

    var source = document.createElement('source');
    source.type = 'video/mp4';
    source.src = src;
    video.appendChild(source);
    video.dataset.knReady = 'true';

    video.addEventListener('playing', function () {
      video.classList.add('is-playing');
    });

    video.load();
    attemptPlay(video);

    var observer = getVisibilityObserver();
    if (observer) observer.observe(video);
  }

  /**
   * Repli vidéo externe : l'iframe n'est créée que si le mouvement est accepté.
   * @param {HTMLElement} container
   */
  function startEmbed(container) {
    if (container.dataset.knReady === 'true') return;

    var src = container.dataset.knSrc;
    if (!src) return;

    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = container.dataset.knTitle || '';
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('tabindex', '-1');
    container.appendChild(iframe);
    container.dataset.knReady = 'true';
  }

  /**
   * @param {ParentNode} root
   */
  function initHeroes(root) {
    var videos = root.querySelectorAll('[data-kn-hero-video]');
    var embeds = root.querySelectorAll('[data-kn-hero-embed]');

    if (motion.matches) {
      Array.prototype.forEach.call(videos, function (video) {
        video.pause();
        video.classList.remove('is-playing');
      });
      return;
    }

    Array.prototype.forEach.call(videos, startVideo);
    Array.prototype.forEach.call(embeds, startEmbed);
  }

  /**
   * @param {ParentNode} root
   */
  function teardownHeroes(root) {
    var observer = visibilityObserver;
    if (!observer) return;
    Array.prototype.forEach.call(root.querySelectorAll('[data-kn-hero-video]'), function (video) {
      observer.unobserve(video);
    });
  }

  /**
   * Le header ne passe au-dessus du média que si la bannière ouvre la page.
   * Le header lit cette classe ; on la maintient à jour dans l'éditeur.
   */
  function syncHeaderOverMedia() {
    var main = document.getElementById('MainContent');
    if (!main) return;
    var first = main.querySelector('.shopify-section');
    var opensWithMedia = Boolean(first && first.querySelector('.kn-hero'));
    document.body.classList.toggle('kn-header--over-media', opensWithMedia);
  }

  /**
   * Shopify renvoie vers l'ancre du formulaire soumis. Quand la page porte
   * plusieurs formulaires client (accueil + pied de page), on masque le message
   * de ceux qui n'ont pas été soumis. Sans JS, tous restent visibles : lisible,
   * jamais cassé.
   * @param {ParentNode} root
   */
  function filterFormMessages(root) {
    var hash = window.location.hash;
    if (hash.length < 2) return;

    Array.prototype.forEach.call(root.querySelectorAll('[data-kn-form-anchor]'), function (el) {
      if ('#' + el.getAttribute('data-kn-form-anchor') !== hash) {
        el.hidden = true;
      }
    });
  }

  /**
   * @param {ParentNode} root
   */
  function init(root) {
    initHeroes(root);
    filterFormMessages(root);
    syncHeaderOverMedia();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init(document);
    });
  } else {
    init(document);
  }

  if (typeof motion.addEventListener === 'function') {
    motion.addEventListener('change', function () {
      initHeroes(document);
    });
  }

  document.addEventListener('shopify:section:load', function (event) {
    var target = /** @type {HTMLElement} */ (event.target);
    if (!target || typeof target.querySelectorAll !== 'function') return;
    init(target);
  });

  document.addEventListener('shopify:section:unload', function (event) {
    var target = /** @type {HTMLElement} */ (event.target);
    if (target && typeof target.querySelectorAll === 'function') {
      teardownHeroes(target);
    }
    // La section n'est retirée du DOM qu'après l'événement.
    window.requestAnimationFrame(syncHeaderOverMedia);
  });
})();
