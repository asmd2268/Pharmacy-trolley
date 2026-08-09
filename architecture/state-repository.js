/* Stable state boundary introduced before the legacy UI is split further. */
(function (global) {
  'use strict';
  function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') return Object.keys(value).sort().reduce(function (out, key) {
      out[key] = canonical(value[key]); return out;
    }, {});
    return value;
  }
  function createPayload(state) {
    state = state || {};
    return {data: state.data && typeof state.data === 'object' ? state.data : {}, shelves: Array.isArray(state.shelves) ? state.shelves : [], oosManual: Array.isArray(state.oosManual) ? state.oosManual : [], settings: state.settings && typeof state.settings === 'object' ? state.settings : {}, theme: state.theme || 'dark'};
  }
  global.PharmacyStateRepository = Object.freeze({canonical, createPayload, fingerprint: value => JSON.stringify(canonical(value))});
}(window));
