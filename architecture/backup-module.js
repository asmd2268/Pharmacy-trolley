async function scheduleBackupOnOpen() {
  const todayKey = new Date().toISOString().slice(0, 10);
  const lastKey = localStorage.getItem('lastAutoBackupDate');
  if (lastKey === todayKey) return; // نسخة اليوم محفوظة مسبقاً
  // انتظر لحظة ثم احفظ (نعطي sbLoad وقت ينتهي أولاً)
  setTimeout(async () => {
    if (!sbConnected) return;
    if(await doBackup('auto')) PharmacyStoragePolicy.write(localStorage,'lastAutoBackupDate',todayKey);
  }, 2000);
}

// يشتغل كل دقيقة للتحقق من الساعة 23:00
function startBackupScheduler() {
  setInterval(checkAutoBackup, 60 * 1000);
}

async function checkAutoBackup() {
  if (!sbConnected) return;
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  if (h !== 23 || m > 5) return; // بس بين 23:00–23:05

  const todayKey = now.toISOString().slice(0, 10);
  const lastKey = localStorage.getItem('lastAutoBackupDate');
  if (lastKey === todayKey) return; // محفوظة اليوم

  if(await doBackup('auto')) PharmacyStoragePolicy.write(localStorage,'lastAutoBackupDate',todayKey);
}

async function doBackup(type = 'manual') {
  if (!sbConnected) { showToast('⚠️ غير متصل بـ Supabase'); return; }
  if(!['writer','admin'].includes(sbUserRole)) return false;
  const now = new Date();
  const label = now.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    + ' — ' + now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  const payload = {...appStatePayload(),sourceRevision:sbStateRevision};
  const row = {
    created_at: now.toISOString(),
    label,
    type,
    payload
  };

  try {
    // Insert new backup
    const inserted=await sbFetch(BACKUP_TABLE,{method:'POST',body:JSON.stringify(row)});
    if(!inserted||!inserted.length) throw new Error('لم يؤكد الخادم إنشاء النسخة');

    // Keep a wider safety window than the previous seven-copy policy.
    await pruneOldBackups();

    updateBackupBadge(now.toISOString().slice(0, 10));
    if (type === 'manual') showToast('✅ تم حفظ النسخة الاحتياطية');
    else if(type === 'pre_restore') showToast('🛡️ تم حفظ نسخة أمان قبل الاستعادة');
    else showToast('💾 تم الحفظ التلقائي الليلي');
    return true;
  } catch (e) {
    showToast('⚠️ فشل حفظ النسخة الاحتياطية');
    return false;
  }
}

async function pruneOldBackups() {
  if(!['writer','admin'].includes(sbUserRole)) return;
  try {
    // Get all backups ordered by date
    const rows=await sbFetch(BACKUP_TABLE+'?select=id,created_at&order=created_at.desc');
    // Delete any beyond the 30th
    const policy=window.PharmacyBackupPolicy;
    const toDelete = policy?policy.staleRows(rows,policy.MAX_BACKUPS):(rows.length>30?rows.slice(30):[]);
    if (toDelete.length) {
      for (const row of toDelete) {
        await sbFetch(BACKUP_TABLE+'?id=eq.'+encodeURIComponent(row.id),{method:'DELETE'});
      }
    }
  } catch (e) { /* silent */ }
}

async function loadBackupList() {
  const container = document.getElementById('backupListContainer');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center;color:var(--text3);padding:20px;font-size:12px">جاري التحميل...</div>';

  if (!sbConnected) {
    container.innerHTML = '<div style="text-align:center;color:var(--danger);padding:20px;font-size:12px">⚠️ غير متصل بـ Supabase</div>';
    return;
  }

  try {
    const rows=await sbFetch(BACKUP_TABLE+'?select=id,created_at,label,type&order=created_at.desc&limit=30');

    if (!rows.length) {
      container.innerHTML = '<div style="text-align:center;color:var(--text3);padding:20px;font-size:12px">لا توجد نسخ احتياطية بعد</div>';
      return;
    }

    container.innerHTML = rows.map((r, i) => {
      const date = new Date(r.created_at);
      const dateStr = date.toLocaleDateString('ar-SA', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
      const timeStr = date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      const typeIcon = r.type === 'auto' ? '🤖' : '👤';
      const typeLabel = r.type === 'auto' ? 'تلقائي' : 'يدوي';
      const isLatest = i === 0;
      return `
        <div style="display:flex;align-items:center;gap:8px;padding:9px 10px;border:1px solid var(--border);border-radius:7px;margin-bottom:6px;background:var(--surface2)">
          <div style="font-size:18px">${typeIcon}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:600;color:var(--text)">${dateStr} — ${timeStr}</div>
            <div style="font-size:10px;color:var(--text3);margin-top:1px">${typeLabel}${isLatest ? ' · <span style="color:var(--success)">الأحدث</span>' : ''}</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="promptRestore('${r.id}','${dateStr} ${timeStr}')">🔄 استعادة</button>
        </div>`;
    }).join('');
  } catch (e) {
    container.innerHTML = '<div style="text-align:center;color:var(--danger);padding:20px;font-size:12px">⚠️ تعذّر تحميل القائمة</div>';
  }
}

function openBackupModal() {
  document.getElementById('backupModal').classList.add('open');
  loadBackupList();
}

function triggerManualBackup() {
  requireWriteAuth('حفظ نسخة احتياطية', async () => {
    await doBackup('manual');
    loadBackupList();
  });
}

function promptRestore(id, label) {
  requireWriteAuth('استعادة نسخة احتياطية', () => {
    pendingRestoreId = id;
    document.getElementById('restoreConfirmInfo').innerHTML =
      'ستُستعاد النسخة المحفوظة بتاريخ: <strong>' + label + '</strong>';
    document.getElementById('restoreConfirmModal').classList.add('open');
  });
}

async function confirmRestore() {
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  if (!pendingRestoreId) return;
  closeModal('restoreConfirmModal');
  showToast('⏳ جاري الاستعادة...');
  const beforeRestore=structuredClone(appStatePayload());
  const wasDirtyBeforeRestore=sbDirty;
  try {
    if(sbDirty) await sbSaveNow();
    if(!await doBackup('pre_restore')) throw new Error('تعذر إنشاء نسخة الأمان قبل الاستعادة');
    const rows=await sbFetch(BACKUP_TABLE+'?id=eq.'+encodeURIComponent(pendingRestoreId)+'&select=payload');
    if (!rows.length||!validateStatePayload(rows[0].payload)) throw new Error('النسخة المختارة غير صالحة');
    const p = rows[0].payload;

    applyStatePayload(p);
    applyTheme();
    refreshAll();
    sbDirty=true; persistPendingWrite();
    await sbSaveNow();
    if(window.PharmacyAuditLog){ PharmacyAuditLog.log('restore_backup',null,null,{backupId:pendingRestoreId}); }
    showToast('✅ تمت الاستعادة بنجاح');
    closeModal('backupModal');
  } catch (e) {
    applyStatePayload(beforeRestore); applyTheme(); refreshAll();
    sbDirty=wasDirtyBeforeRestore;
    if(sbDirty) persistPendingWrite(); else clearPendingWrite();
    showToast('⚠️ أُوقفت الاستعادة ولم تُستبدل الحالة الحالية');
    console.warn(e.message);
  }
  pendingRestoreId = null;
}

function updateBackupBadge(todayStr) {
  const el = document.getElementById('backupStatusText');
  if (el) {
    el.textContent = 'آخر نسخة: اليوم';
  }
}

async function initBackupBadge() {
  // Show date of last backup in badge
  if (!sbConnected) return;
  try {
    const rows=await sbFetch(BACKUP_TABLE+'?select=created_at&order=created_at.desc&limit=1');
    if (!rows.length) return;
    const d = new Date(rows[0].created_at);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const el = document.getElementById('backupStatusText');
    if (el) el.textContent = isToday ? '✅ نسخة اليوم' : '💾 ' + d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  } catch (e) { /* silent */ }
}
