/* Date rules used by expiry badges, reports and shelf cells. */
(function (global) {
  'use strict';
  function isIsoDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
    const parts = String(value).split('-').map(Number), date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    return date.getUTCFullYear() === parts[0] && date.getUTCMonth() === parts[1] - 1 && date.getUTCDate() === parts[2];
  }
  function format(value) { if (!value) return ''; const parts = String(value).split('-'); return parts.length === 3 ? parts[2] + '/' + parts[1] + '/' + parts[0] : ''; }
  function daysLabel(days) { if (days < 0) return 'منتهي منذ ' + Math.abs(days) + ' يوم'; if (days === 0) return 'اليوم!'; return days + ' يوم'; }
  global.PharmacyDatePolicy = Object.freeze({ isIsoDate, format, daysLabel });
  if (typeof global.isValidIsoDate !== 'function') global.isValidIsoDate = isIsoDate;
  if (typeof global.formatDate !== 'function') global.formatDate = format;
  if (typeof global.daysLabel !== 'function') global.daysLabel = daysLabel;
  if (typeof global.normalizeExpiries !== 'function') global.normalizeExpiries = function(values) {
    return [...new Set((values||[]).filter(isIsoDate))].sort();
  };
}(window));
