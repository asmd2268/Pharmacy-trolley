/* Medication and expiry classification rules, independent of rendering. */
(function (global) {
  'use strict';
  function expiryStatus(days, settings) {
    const n = Number(days), cfg = settings || {};
    if (!Number.isFinite(n)) return 'none';
    if (n < 0) return 'expired';
    if (n <= Number(cfg.critDays || 7)) return 'critical';
    if (n <= Number(cfg.warnDays || 30)) return 'warn';
    return 'ok';
  }
  function itemStatus(item, daysUntil, settings) {
    if (!item || !Array.isArray(item.expiries) || !item.expiries.length) return 'none';
    let status = 'ok';
    for (const expiry of item.expiries) {
      const current = expiryStatus(daysUntil(expiry), settings);
      if (current === 'expired' || current === 'critical') return 'danger';
      if (current === 'warn') status = 'warn';
    }
    return status;
  }
  function hasExpiry(item) { return !!(item && Array.isArray(item.expiries) && item.expiries.length); }
  global.PharmacyMedicationPolicy = Object.freeze({expiryStatus, itemStatus, hasExpiry});
}(window));
