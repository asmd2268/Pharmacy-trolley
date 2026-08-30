/* ââââââââââââââââââââââââââââââââââââââ
   AUDIT LOG MODULE â Ø³Ø¬Ù Ø§ÙØªØ¹Ø¯ÙÙØ§Øª
   Records every user-initiated mutation to Supabase.
   ââââââââââââââââââââââââââââââââââââââ */
(function (global) {
  'use strict';

  const AUDIT_TABLE = 'pharmacy_audit_log';
  const PAGE_SIZE = 50;

  // Action labels (Arabic)
  const ACTION_LABELS = {
    add_drug:        'â Ø¥Ø¶Ø§ÙØ© Ø¯ÙØ§Ø¡',
    edit_drug:       'âï¸ ØªØ¹Ø¯ÙÙ Ø¯ÙØ§Ø¡',
    delete_drug:     'ðï¸ Ø­Ø°Ù Ø¯ÙØ§Ø¡',
    bulk_delete:     'ðï¸ Ø­Ø°Ù ÙØ¬ÙÙØ¹Ø©',
    move_drug:       'ð ÙÙÙ Ø¯ÙØ§Ø¡',
    swap_drugs:      'ð ØªØ¨Ø¯ÙÙ Ø¯ÙØ§Ø¡ÙÙ',
    unassign_drug:   'ð¤ Ø¥ÙØºØ§Ø¡ ØªØ¹ÙÙÙ',
    bulk_add:        'ð Ø¥Ø¶Ø§ÙØ© ÙØ¬ÙÙØ¹Ø©',
    import_data:     'ð¥ Ø§Ø³ØªÙØ±Ø§Ø¯ Ø¨ÙØ§ÙØ§Øª',
    export_data:     'ð¤ ØªØµØ¯ÙØ± Ø¨ÙØ§ÙØ§Øª',
    add_oos:         'ð« Ø¥Ø¶Ø§ÙØ© OOS',
    remove_oos:      'â Ø¥Ø²Ø§ÙØ© OOS',
    edit_shelf_cell: 'ð¦ ØªØ¹Ø¯ÙÙ Ø®ÙÙØ© Ø±Ù',
    clear_shelf_cell:'ðï¸ ÙØ³Ø­ Ø®ÙÙØ© Ø±Ù',
    add_shelf:       'ð¦ Ø¥Ø¶Ø§ÙØ© Ø±Ù',
    edit_shelf:      'ð¦ ØªØ¹Ø¯ÙÙ Ø±Ù',
    delete_shelf:    'ð¦ Ø­Ø°Ù Ø±Ù',
    restore_backup:  'ð Ø§Ø³ØªØ¹Ø§Ø¯Ø© ÙØ³Ø®Ø©',
    settings_change: 'â¦ï¸ ØªØºÙÙØ± Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª'
  };

  // Queue for offline/batched writes
  let writeQueue = [];
  let flushTimer = null;

  /** Log an action to Supabase */
  async function logAction(action, drugKey, drugName, details) {
    if (typeof sbFetch !== 'function') return;
    if (!global.sbConnected) {
      // Queue for later
      writeQueue.push({ action, drug_key: drugKey, drug_name: drugName, details: details || {} });
      return;
    }
    try {
      await sbFetch(AUDIT_TABLE, {
        method: 'POST',
        body: JSON.stringify({
          action: action,
          drug_key: drugKey || null,
          drug_name: drugName || null,
          details: details || {},
          performed_by: global.sbUser ? global.sbUser.id : null
        }),
        headers: { Prefer: 'return=minimal' }
      });
    } catch (e) {
      console.warn('Audit log write failed:', e.message);
      // Don't block the operation â audit is best-effort
    }
  }

  /** Flush queued entries */
  async function flushQueue() {
    if (!writeQueue.length || !global.sbConnected) return;
    const batch = writeQueue.splice(0, writeQueue.length);
    for (const entry of batch) {
      try {
        await sbFetch(AUDIT_TABLE, {
          method: 'POST',
          body: JSON.stringify({
            ...entry,
            performed_by: global.sbUser ? global.sbUser.id : null
          }),
          headers: { Prefer: 'return=minimal' }
        });
      } catch (e) {
        console.warn('Audit flush failed:', e.message);
      }
    }
  }

  /** Fetch audit log entries with pagination and optional filters */
  async function fetchLogs(options) {
    options = options || {};
    const offset = options.offset || 0;
    const limit = options.limit || PAGE_SIZE;
    const actionFilter = options.action || '';
    const searchQuery = options.search || '';

    let path = `${AUDIT_TABLE}?order=performed_at.desc&offset=${offset}&limit=${limit}`;
    if (actionFilter) {
      path += `&action=eq.${encodeURIComponent(actionFilter)}`;
    }
    if (searchQuery) {
      path += `&or=(drug_name.ilike.*${encodeURIComponent(searchQuery)}*,drug_key.ilike.*${encodeURIComponent(searchQuery)}*)`;
    }

    // Request total count via header
    const rows = await sbFetch(path, {
      headers: { Prefer: 'return=representation', Range: `${offset}-${offset + limit - 1}` }
    });
    return rows || [];
  }

  /** Format a timestamp for display */
  function formatTime(isoStr) {
    if (!isoStr) return 'â';
    const d = new Date(isoStr);
    const pad = n => String(n).padStart(2, '0');
    const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return `${date} ${time}`;
  }

  /** Render the audit log tab content */
  let currentOffset = 0;
  let currentAction = '';
  let currentSearch = '';

  async function renderAuditLog() {
    const container = document.getElementById('auditLogContent');
    if (!container) return;
    container.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text3)">â³ Ø¬Ø§Ø±Ù Ø§ÙØªØ­ÙÙÙ...</div>';

    try {
      const rows = await fetchLogs({
        offset: currentOffset,
        action: currentAction,
        search: currentSearch
      });

      if (!rows.length && currentOffset === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)"><div style="font-size:40px;margin-bottom:10px">ð</div>ÙØ§ ØªÙØ¬Ø¯ ØªØ¹Ø¯ÙÙØ§Øª ÙØ³Ø¬ÙØ© Ø¨Ø¹Ø¯</div>';
        return;
      }

      let html = '<div class="audit-log-list">';
      rows.forEach(row => {
        const label = ACTION_LABELS[row.action] || row.action;
        const time = formatTime(row.performed_at);
        const name = row.drug_name ? escapeHtml(row.drug_name.replace(/\n/g, ' ')) : '';
        const key = row.drug_key || '';
        const details = row.details || {};

        // Build detail snippets
        let detailHtml = '';
        if (details.from && details.to) {
          detailHtml += `<span class="audit-detail">ÙÙ <code>${escapeHtml(details.from)}</code> Ø¥ÙÙ <code>${escapeHtml(details.to)}</code></span>`;
        }
        if (details.count) {
          detailHtml += `<span class="audit-detail">Ø§ÙØ¹Ø¯Ø¯: ${details.count}</span>`;
        }
        if (details.changes) {
          const changeItems = [];
          if (details.changes.expiries) changeItems.push('ØªÙØ§Ø±ÙØ® Ø§ÙØ§ÙØªÙØ§Ø¡');
          if (details.changes.types) changeItems.push('Ø§ÙÙÙØ¹');
          if (details.changes.oos !== undefined) changeItems.push('OOS');
          if (details.changes.name) changeItems.push('Ø§ÙØ§Ø³Ù');
          if (details.changes.notes) changeItems.push('Ø§ÙÙÙØ§Ø­Ø¸Ø§Øª');
          if (details.changes.shelf !== undefined) changeItems.push('Ø±Ù');
          if (changeItems.length) detailHtml += `<span class="audit-detail">ØªØºÙÙØ±Ø§Øª: ${changeItems.join('Ø ')}</span>`;
        }
        if (details.mode) {
          const modeLabels = { add: 'Ø¥Ø¶Ø§ÙØ© ÙÙØ·', update: 'ØªØ­Ø¯ÙØ« + Ø¥Ø¶Ø§ÙØ©', replace: 'Ø§Ø³ØªØ¨Ø¯Ø§Ù ÙØ§ÙÙ' };
          detailHtml += `<span class="audit-detail">Ø§ÙÙÙØ·: ${modeLabels[details.mode] || details.mode}</span>`;
        }
        if (details.swappedWith) {
          detailHtml += `<span class="audit-detail">ØªØ¨Ø¯ÙÙ ÙØ¹: ${escapeHtml(details.swappedWith)}</span>`;
        }
        if (details.shelfName) {
          detailHtml += `<span class="audit-detail">Ø§ÙØ±Ù: ${escapeHtml(details.shelfName)}</span>`;
        }

        html += `<div class="audit-row">
          <div class="audit-row-header">
            <span class="audit-action-badge" data-action="${row.action}">${label}</span>
            <span class="audit-time">${time}</span>
          </div>
          <div class="audit-row-body">
            ${name ? `<span class="audit-drug-name">${name}</span>` : ''}
            ${key ? `<code class="audit-key">${escapeHtml(key)}</code>` : ''}
            ${detailHtml}
          </div>
        </div>`;
      });
      html += '</div>';

      // Pagination
      html += '<div class="audit-pagination">';
      if (currentOffset > 0) {
        html += `<button class="btn btn-secondary btn-sm" onclick="PharmacyAuditLog.prevPage()">â Ø§ÙØ³Ø§Ø¨Ù</button>`;
      }
      if (rows.length === PAGE_SIZE) {
        html += `<button class="btn btn-secondary btn-sm" onclick="PharmacyAuditLog.nextPage()">â Ø§ÙØªØ§ÙÙ</button>`;
      }
      html += `<span class="audit-page-info">${currentOffset + 1} â ${currentOffset + rows.length}</span>`;
      html += '</div>';

      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--danger)">â ï¸ ØªØ¹Ø°ÙØ± ØªØ­ÙÙÙ Ø§ÙØ³Ø¬Ù<br><span style="font-size:11px;color:var(--text3)">${escapeHtml(e.message)}</span></div>`;
    }
  }

  function nextPage() { currentOffset += PAGE_SIZE; renderAuditLog(); }
  function prevPage() { currentOffset = Math.max(0, currentOffset - PAGE_SIZE); renderAuditLog(); }
  function filterByAction(action) { currentAction = action; currentOffset = 0; renderAuditLog(); }
  function searchLogs(query) { currentSearch = query; currentOffset = 0; renderAuditLog(); }
  function resetFilters() { currentAction = ''; currentSearch = ''; currentOffset = 0; renderAuditLog(); }

  // Diff helper: compare old and new drug records, return changed fields
  function diffDrug(oldRec, newRec) {
    if (!oldRec || !newRec) return {};
    const changes = {};
    if (oldRec.name !== newRec.name) changes.name = { old: oldRec.name, new: newRec.name };
    if (JSON.stringify(oldRec.expiries || []) !== JSON.stringify(newRec.expiries || []))
      changes.expiries = { old: oldRec.expiries, new: newRec.expiries };
    if (JSON.stringify(oldRec.types || []) !== JSON.stringify(newRec.types || []))
      changes.types = { old: oldRec.types, new: newRec.types };
    if (!!oldRec.oos !== !!newRec.oos) changes.oos = { old: oldRec.oos, new: newRec.oos };
    if (!!oldRec.shelf !== !!newRec.shelf) changes.shelf = { old: oldRec.shelf, new: newRec.shelf };
    if ((oldRec.notes || '') !== (newRec.notes || '')) changes.notes = { old: oldRec.notes, new: newRec.notes };
    return changes;
  }

  // Public API
  global.PharmacyAuditLog = Object.freeze({
    log: logAction,
    flushQueue: flushQueue,
    render: renderAuditLog,
    nextPage: nextPage,
    prevPage: prevPage,
    filterByAction: filterByAction,
    searchLogs: searchLogs,
    resetFilters: resetFilters,
    diffDrug: diffDrug,
    ACTION_LABELS: ACTION_LABELS,
    PAGE_SIZE: PAGE_SIZE
  });
}(window));
