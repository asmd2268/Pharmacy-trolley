/* Shelf domain facade: visibility and cell matching are independent of DOM rendering. */
(function (global) {
  'use strict';
  function createShelfModule(deps) {
    deps = deps || {};
    const normalize = deps.normalize || (v => String(v || '').toLowerCase().trim());
    const rowLabel = deps.rowLabel || (r => String.fromCharCode(65 + r));
    function cellMatches(shelf, data, row, col, query) {
      const q = normalize(query), number = (shelf.startNum || 1) + col, rowName = rowLabel(row), key = String(number) + rowName, display = rowName + String(number), item = data[key];
      return !q || normalize(shelf.name).includes(q) || !!(item && (normalize(item.name).includes(q) || normalize(key).includes(q) || normalize(display).includes(q)));
    }
    function visibleShelves(shelves, data, query) {
      const q = normalize(query);
      return (shelves || []).filter(shelf => {
        if (!q || normalize(shelf.name).includes(q)) return true;
        for (let row = 0; row < (shelf.rows || 4); row++) for (let col = 0; col < (shelf.cols || 5); col++) if (cellMatches(shelf, data, row, col, q)) return true;
        return false;
      });
    }
    return Object.freeze({ cellMatches, visibleShelves });
  }
  global.PharmacyShelfModule = Object.freeze({ create: createShelfModule });
}(window));
