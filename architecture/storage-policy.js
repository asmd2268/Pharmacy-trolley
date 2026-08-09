/* Storage writes are isolated so quota and privacy failures are observable. */
(function (global) {
  'use strict';
  function write(storage, key, value, onError) {
    try {
      storage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      return true;
    } catch (error) {
      if (typeof onError === 'function') onError(error, key);
      return false;
    }
  }
  global.PharmacyStoragePolicy = Object.freeze({ write });
}(window));
