—/* ══════════════════════════════════════
   AUDIT LOG MODULE — سجل التعديلات
   Records every user-initiated mutation to Supabase.
   ══════════════════════════════════════ */
(function (global) {
  'use strict';

  const AUDIT_TABLE = 'pharmacy_audit_log';
  const PAGE_SIZE = 50;

  // ── local escapeHtml (avoids dependency on app.js) ──
  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ── safe wrappers around globals that may load after this module ──
  function getSbFetch()    { return typeof window.sbFetch === 'function' ? window.sbFetch : null; }
  function isConnected()   { return !!window.sbConnected; }
  function currentUserId() { return window.sbUser ? window.sbUser.id : null; }

  const ACTION_LABELS = {
    add_drug:        '➕ إضافة دواء',
    edit_drug:       '✏️ تعديل دواء',
    delete_drug:     '🗑️ حذف دواء',
    bulk_delete:     '🗑️ حذف مجموعة',
    move_drug:       '🔀 نقل دواء',
    swap_drugs:      '🔄 تبديل دواءين',
    unassign_drug:   '📤 إلغاء تعيين',
    bulk_add:        '📋 إضافة مجموعة',
    import_data:     '📥 استيراد بيانات',
    export_data:     '📤 تصدير بيانات',
    add_oos:         '🚫 إضافة OOS',
    remove_oos:      '✅ إزالة OOS',
    edit_shelf_cell: '📦 تعديل خلية رف',
    clear_shelf_cell:'🗑️ مسح خلية رف',
    add_shelf:       '📦 إضافة رف',
    edit_shelf:      '📦 تعديل رف',
    delete_shelf:    '📦 حذف رف',
    restore_backup:  '🔄 استعادة نسخة',
    settings_change: '⚙️ تغيير إعدادات'
  };

  let writeQueue = [];

  async function logAction(action, drugKey, drugName, details) {
    const fn = getSbFetch();
    if (!fn || !isConnected()) {
      writeQueue.push({ action, drug_key: drugKey||null, drug_name: drugName||null, details: details||{} });
      return;
    }
    try {
      await fn(AUDIT_TABLE, {
        method: 'POST',
        body: JSON.stringify({ action, drug_key: drugKey||null, drug_name: drugName||null, details: details||{}, performed_by: currentUserId() }),
        headers: { Prefer: 'return=minimal' }
      });
    } catch (e) { console.warn('[AuditLog] write failed:', e.message); }
  }

  async function flushQueue() {
    if (!writeQueue.length || !isConnected()) return;
    const fn = getSbFetch(); if (!fn) return;
    const batch = writeQueue.splice(0, writeQueue.length);
    for (const entry of batch) {
      try {
        await fn(AUDIT_TABLE, { method: 'POST', body: JSON.stringify({ ...entry, performed_by: currentUserId() }), headers: { Prefer: 'return=minimal' } });
      } catch (e) { console.warn('[AuditLog] flush failed:', e.message); }
    }
  }

  async function fetchLogs(options) {
    const fn = getSbFetch(); if (!fn) throw new Error('Supabase غير متصل');
    options = options || {};
    const offset = options.offset || 0;
    const limit  = options.limit  || PAGE_SIZE;
    let path = AUDIT_TABLE + '?order=performed_at.desc&offset=' + offset + '&limit=' + limit;
    if (options.action) path += '&action=eq.' + encodeURIComponent(options.action);
    if (options.search) path += '&or=(drug_name.ilike.*' + encodeURIComponent(options.search) + '*,drug_key.ilike.*' + encodeURIComponent(options.search) + '*)';
    const rows = await fn(path, { headers: { Prefer: 'return=representation' } });
    return Array.isArray(rows) ? rows : [];
  }

  function formatTime(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr), pad = n => String(n).padStart(2,'0');
    return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes());
  }

  let currentOffset = 0, currentAction = '', currentSearch = '';

  async function renderAuditLog() {
    const c = document.getElementById('auditLogContent'); if (!c) return;
    c.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text3)">⏳ جاري التحميل...</div>';
    if (!isConnected()) { c.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text3)">⚠️ يحتاج اتصال بـ Supabase</div>'; return; }
    try {
      const rows = await fetchLogs({ offset: currentOffset, action: currentAction, search: currentSearch });
      if (!rows.length && currentOffset === 0) {
        c.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)"><div style="font-size:40px;margin-bottom:10px">📝</div>لا توجد تعديلات مسجلة بعد</div>';
        return;
      }
      let html = '<div class="audit-log-list">';
      rows.forEach(row => {
        const label = ACTION_LABELS[row.action] || esc(row.action);
        const time  = formatTime(row.performed_at);
        const name  = row.drug_name ? esc(row.drug_name.replace(/\n/g,' ')) : '';
        const key   = row.drug_key  ? esc(row.drug_key) : '';
        const d     = row.details   || {};
        let det = '';
        if (d.from && d.to)        det += '<span class="audit-detail">من <code>'+esc(d.from)+'</code> إلى <code>'+esc(d.to)+'</code></span>';
        if (d.count)               det += '<span class="audit-detail">العدد: '+Number(d.count)+'</span>';
        if (d.location)            det += '<span class="audit-detail">الموقع: <code>'+esc(d.location)+'</code></span>';
        if (d.displaced)           det += '<span class="audit-detail">أُزيح: '+esc(d.displaced)+'</span>';
        if (d.swappedWith)         det += '<span class="audit-detail">تبديل مع: '+esc(d.swappedWith)+'</span>';
        if (d.shelfName)           det += '<span class="audit-detail">الرف: '+esc(d.shelfName)+'</span>';
        if (d.unassigned)          det += '<span class="audit-detail">بدون موقع</span>';
        if (d.mode)  { const ml={add:'إضافة فقط',update:'تحديث + إضافة',replace:'استبدال كامل'}; det += '<span class="audit-detail">النمط: '+esc(ml[d.mode]||d.mode)+'</span>'; }
        if (d.changes && typeof d.changes==='object') {
          const ci=[];
          if (d.changes.expiries) ci.push('تواريخ الانتهاء');
          if (d.changes.types)    ci.push('النوع');
          if (d.changes.oos!==undefined) ci.push('OOS');
          if (d.changes.name)     ci.push('الاسم');
          if (d.changes.notes)    ci.push('الملاحظات');
          if (d.changes.shelf!==undefined) ci.push('رف');
          if (ci.length) det += '<span class="audit-detail">تغييرات: '+ci.join('، ')+'</span>';
        }
        html += '<div class="audit-row"><div class="audit-row-header"><span class="audit-action-badge" data-action="'+esc(row.action)+'">'+label+'</span><span class="audit-time">'+time+'</span></div><div class="audit-row-body">'+(name?'<span class="audit-drug-name">'+name+'</span>':'')+(key?'<code class="audit-key">'+key+'</code>':'')+det+'</div></div>';
      });
      html += '</div><div class="audit-pagination">';
      if (currentOffset > 0) html += '<button class="btn btn-secondary btn-sm" onclick="PharmacyAuditLog.prevPage()">→ السابق</button>';
      if (rows.length === PAGE_SIZE) html += '<button class="btn btn-secondary btn-sm" onclick="PharmacyAuditLog.nextPage()">← التالي</button>';
      if (rows.length) html += '<span class="audit-page-info">'+(currentOffset+1)+' – '+(currentOffset+rows.length)+'</span>';
      html += '</div>';
      c.innerHTML = html;
    } catch(e) { c.innerHTML = '<div style="text-align:center;padding:30px;color:var(--danger)">⚠️ تعذّر تحميل السجل<br><span style="font-size:11px;color:var(--text3)">'+esc(e.message)+'</span></div>'; }
  }

  function nextPage()             { currentOffset += PAGE_SIZE; renderAuditLog(); }
  function prevPage()             { currentOffset = Math.max(0, currentOffset-PAGE_SIZE); renderAuditLog(); }
  function filterByAction(action) { currentAction = action; currentOffset = 0; renderAuditLog(); }
  function searchLogs(query)      { currentSearch = query; currentOffset = 0; renderAuditLog(); }
  function resetFilters()         { currentAction=''; currentSearch=''; currentOffset=0; renderAuditLog(); }

  function diffDrug(oldRec, newRec) {
    if (!oldRec || !newRec) return {};
    const changes = {};
    if (oldRec.name !== newRec.name) changes.name = {old:oldRec.name, new:newRec.name};
    if (JSON.stringify(oldRec.expiries||[]) !== JSON.stringify(newRec.expiries||[]))
      changes.expiries = {old:oldRec.expiries, new:newRec.expiries};
    if (JSON.stringify(oldRec.types||[]) !== JSON.stringify(newRec.types||[]))
      changes.types = {old:oldRec.types, new:newRec.types};
    if (!!oldRec.oos   !== !!newRec.oos)   changes.oos   = {old:oldRec.oos,   new:newRec.oos};
    if (!!oldRec.shelf !== !!newRec.shelf) changes.shelf = {old:oldRec.shelf, new:newRec.shelf};
    if ((oldRec.notes||'') !== (newRec.notes||'')) changes.notes = {old:oldRec.notes, new:newRec.notes};
    return changes;
  }

  global.PharmacyAuditLog = Object.freeze({
    log: logAction, flushQueue, render: renderAuditLog,
    nextPage, prevPage, filterByAction, searchLogs, resetFilters,
    diffDrug, ACTION_LABELS, PAGE_SIZE
  });
}(window));
