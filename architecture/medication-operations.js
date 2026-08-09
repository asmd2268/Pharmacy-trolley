/* Pure medication record operations. */
(function (global) {
  'use strict';
  function createRecord(name, options) {
    options = options || {};
    const record = {name: String(name || '').trim(), expiries: Array.isArray(options.expiries) ? options.expiries.slice() : [], types: Array.isArray(options.types) ? options.types.slice() : [], oos: options.oos === true, shelf: options.shelf === true, notes: String(options.notes || '')};
    ['extra','drawerNum','drawerSlot'].forEach(function (key) { if (Object.prototype.hasOwnProperty.call(options, key)) record[key] = options[key]; });
    return record;
  }
  function assign(records, fromKey, toKey) {
    const next = {...records}, source = next[fromKey]; if (!source) return next;
    if (toKey !== fromKey) { next[toKey] = {...source}; delete next[fromKey]; }
    return next;
  }
  function remove(records, key) { const next = {...records}; delete next[key]; return next; }
  function unassign(records, fromKey, toKey) {
    const next = {...records}, source = next[fromKey]; if (!source) return next;
    next[toKey] = {...source, drawerNum: null, drawerSlot: null, extra: true};
    delete next[fromKey];
    return next;
  }
  global.PharmacyMedicationOperations = Object.freeze({createRecord, assign, remove, unassign});
}(window));
