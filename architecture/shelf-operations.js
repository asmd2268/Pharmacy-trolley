/* Pure shelf state operations. These functions never touch the DOM or network. */
(function (global) {
  'use strict';
  function create() {
    return Object.freeze({
      add: function (shelves, shelf) { return (shelves || []).concat([shelf]); },
      update: function (shelves, id, changes) { return (shelves || []).map(s => s.id === id ? {...s, ...changes} : s); },
      remove: function (shelves, id) { return (shelves || []).filter(s => s.id !== id); }
    });
  }
  global.PharmacyShelfOperations = Object.freeze({create});
}(window));
