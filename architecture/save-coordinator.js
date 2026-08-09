/* Persistence orchestration boundary. The legacy snapshot writer is injected. */
(function (global) {
  'use strict';
  function createSaveCoordinator(options) {
    options = options || {};
    let requested = false;
    let running = null;
    async function loop() {
      try {
        while (requested && !options.isBlocked()) {
          requested = false;
          await options.saveSnapshot();
        }
      } finally { running = null; }
    }
    return Object.freeze({
      request: function () {
        if (options.isHydrating()) return Promise.resolve(false);
        if (!options.isAllowed()) return Promise.reject(new Error('الحساب للقراءة فقط'));
        requested = true;
        if (!running) running = loop();
        return running;
      },
      cancel: function () { requested = false; }
    });
  }
  global.PharmacySaveCoordinator = Object.freeze({ create: createSaveCoordinator });
}(window));
