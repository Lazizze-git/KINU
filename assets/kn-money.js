/**
 * KINŪ — Mise en forme des montants
 *
 * Reproduit le filtre Liquid `money` à partir du format de la boutique
 * (`shop.money_format` ou `shop.money_with_currency_format`), pour qu'un
 * montant calculé dans le navigateur s'écrive exactement comme ceux rendus
 * par Shopify. Expose `window.KN.formatMoney`.
 *
 * Chargé en `defer`, après kn-base.js et avant kn-product.js.
 */
(function () {
  'use strict';

  /**
   * Séparateurs par variante de format : [décimales, milliers, décimal].
   * @type {Record<string, [number, string, string]>}
   */
  var STYLES = {
    amount: [2, ',', '.'],
    amount_no_decimals: [0, ',', '.'],
    amount_with_comma_separator: [2, '.', ','],
    amount_no_decimals_with_comma_separator: [0, '.', ','],
    amount_with_apostrophe_separator: [2, "'", '.'],
    amount_no_decimals_with_space_separator: [0, ' ', ''],
    amount_with_space_separator: [2, ' ', ','],
    amount_with_period_and_space_separator: [2, ' ', '.']
  };

  var PLACEHOLDER = /\{\{\s*(\w+)\s*\}\}/;

  /**
   * @param {number} cents
   * @param {[number, string, string]} style
   * @returns {string}
   */
  function delimit(cents, style) {
    var fixed = (cents / 100).toFixed(style[0]);
    var parts = fixed.split('.');
    var whole = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, style[1]);
    return parts[1] ? whole + style[2] + parts[1] : whole;
  }

  /**
   * @param {number} cents - Montant en centimes.
   * @param {string} format - Format de la boutique, par ex. « CHF {{amount}} ».
   * @returns {string|null} Le montant en texte brut, ou null si le format est illisible.
   */
  function formatMoney(cents, format) {
    if (!isFinite(cents) || typeof format !== 'string') return null;
    var match = format.match(PLACEHOLDER);
    var style = match ? STYLES[match[1]] : undefined;
    if (!match || !style) return null;
    return format
      .replace(PLACEHOLDER, delimit(cents, style))
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  window.KN = window.KN || {};
  window.KN.formatMoney = formatMoney;
})();
