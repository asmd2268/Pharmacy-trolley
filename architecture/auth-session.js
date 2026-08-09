/* Small session contract shared by the legacy shell and the future auth module. */
(function (global) {
  'use strict';
  function createSessionStore(storage, key) {
    return {
      read: function () { try { return JSON.parse(storage.getItem(key) || 'null'); } catch (_) { return null; } },
      write: function (value) {
        try { if (value) storage.setItem(key, JSON.stringify(value)); else storage.removeItem(key); return true; }
        catch (_) { return false; }
      }
    };
  }
  global.PharmacyAuthSession = Object.freeze({ createStore: createSessionStore });
}(window));
