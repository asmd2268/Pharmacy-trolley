/* Backup retention policy, independent from Supabase transport and UI. */
(function (global) {
  'use strict';
  const MAX_BACKUPS = 30;
  function keepLatest(rows, limit) { const max = Number.isInteger(limit) && limit > 0 ? limit : MAX_BACKUPS; return (rows || []).slice().sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || ''))).slice(0, max); }
  function staleRows(rows, limit) { const kept = new Set(keepLatest(rows, limit).map(row => row.id)); return (rows || []).filter(row => row.id && !kept.has(row.id)); }
  global.PharmacyBackupPolicy = Object.freeze({MAX_BACKUPS, keepLatest, staleRows});
}(window));
