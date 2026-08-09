/* Inactivity policy, independent from the authentication provider. */
(function (global) {
  'use strict';
  function create(options) {
    options = options || {};
    let lastActivity = Date.now(), timer = null;
    const touch = () => { lastActivity = Date.now(); };
    function start() {
      ['pointerdown', 'keydown', 'input', 'click'].forEach(type => document.addEventListener(type, touch, {passive: true}));
      timer = setInterval(() => {
        const minutes = Math.max(5, Number(options.minutes()) || 15);
        if (options.isAuthenticated() && Date.now() - lastActivity > minutes * 60000) options.onTimeout();
      }, 60000);
      return api;
    }
    function stop() { if (timer) clearInterval(timer); timer = null; return api; }
    const api = Object.freeze({start, stop, touch});
    return api;
  }
  global.PharmacySessionTimeout = Object.freeze({create});
}(window));
