/* Pure shelf search policy. Rendering stays in the legacy view for now. */
(function (global) {
  'use strict';
  function matches(shelf, data, query, rowLabel) {
    const q = String(query || '');
    if (!q || String(shelf && shelf.name || '').includes(q)) return true;
    const cols = shelf.cols || 5, rows = shelf.rows || 4, start = shelf.startNum || 1;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const row = rowLabel(r), key = String(start + c) + row, display = row + String(start + c), item = data[key];
      if (item && (item.name.includes(q) || key.includes(q) || display.includes(q))) return true;
    }
    return false;
  }
  global.PharmacyShelfSearch = Object.freeze({ matches });
}(window));
