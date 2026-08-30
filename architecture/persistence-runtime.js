function persistPendingWrite(){
  if(sbHydrating) return;
  const ok=window.PharmacyStoragePolicy&&PharmacyStoragePolicy.write(localStorage,SB_PENDING_KEY,{
    createdAt:new Date().toISOString(),baseRevision:sbStateRevision,payload:appStatePayload()
  },(e)=>console.warn('Could not persist pending write',e));
  if(!ok) console.warn('Could not persist pending write');
}

function clearPendingWrite(){
  try{ localStorage.removeItem(SB_PENDING_KEY); }catch(e){}
}

function readPendingWrite(){
  try{return JSON.parse(localStorage.getItem(SB_PENDING_KEY)||'null');}catch(e){return null;}
}

function showSyncConflict(message,conflict={}){
  sbConflict=conflict;
  const banner=document.getElementById('syncConflictBanner');
  const msg=document.getElementById('syncConflictMessage');
  const download=document.getElementById('downloadPendingBtn');
  if(msg) msg.textContent=message;
  if(download) download.style.display=readPendingWrite()?'':'none';
  if(banner) banner.classList.add('show');
  setSbStatus('conflict');
}

function hideSyncConflict(){
  sbConflict=null;
  const banner=document.getElementById('syncConflictBanner');
  if(banner) banner.classList.remove('show');
}

function exportUnsavedSnapshot(){
  const pending=readPendingWrite();
  if(!pending) return showToast('لا توجد تغييرات محلية معلّقة');
  const blob=new Blob([JSON.stringify(pending,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`pharmacy_unsaved_${new Date().toISOString().replace(/[:.]/g,'-')}.json`;
  a.click(); URL.revokeObjectURL(a.href);
}

async function reloadLatestAfterConflict(){
  const pending=readPendingWrite();
  if(pending&&!confirm('سيتم حذف التغييرات المحلية غير المحفوظة بعد تحميل أحدث نسخة. نزّلها أولًا إذا كنت تحتاجها. متابعة؟')) return;
  clearTimeout(sbSaveTimer); sbSaveRequested=false; sbDirty=false; clearPendingWrite(); hideSyncConflict();
  await sbLoad({ignorePending:true}); refreshAll(); showToast('✅ تم تحميل أحدث نسخة بأمان');
}

async function sbFetch(path, opts={}){
  if(!SB_URL||!SB_KEY) throw new Error('Supabase غير مهيأ');
  if(!window._pharmacySupabaseRequest) window._pharmacySupabaseRequest=PharmacySupabaseRestClient.create({url:SB_URL,key:SB_KEY,ensureSession:sbEnsureSession,accessToken:()=>sbSession&&sbSession.accessToken,refreshSession:refreshSbSession});
  return window._pharmacySupabaseRequest(path,opts);
}

// Version stamp embedded in SEED_DATA — change this when you export a new JSON.
// sbLoad compares this against what's in Supabase; if different, it pushes the
// new seed. If same, it trusts Supabase (which holds any user edits since last export).
const SEED_VERSION = '2025-07-07';

async function sbLoad({ignorePending=false}={}){
  sbHydrating=true;
  try{
    const rows = await sbFetch(`${SB_TABLE}?id=eq.1&select=payload`);
    const remotePayload = rows&&rows.length&&rows[0].payload ? rows[0].payload : null;
    const remoteVersion = remotePayload&&remotePayload.settings&&remotePayload.settings.seedVersion;

    if(remotePayload){
      if(!validateStatePayload(remotePayload)) throw new Error('رفض تحميل حالة غير صالحة من الخادم');
      // ══ القاعدة الذهبية: Supabase هو دائماً مصدر الحقيقة ══
      // لا نكتب SEED فوق بيانات موجودة أبداً — SEED يُستخدم فقط عند أول تشغيل
      const p = remotePayload;
      data      = p.data      || {};
      shelves   = p.shelves   || [];
      oosManual = p.oosManual || [];
      settings  = sanitizeSettings(p.settings);
      theme     = p.theme     || 'dark';
      sbStateHasRevision=Number.isInteger(p.revision);
      sbStateRevision=sbStateHasRevision?p.revision:0;
      if(!remoteVersion||remoteVersion!==SEED_VERSION) settings.seedVersion=SEED_VERSION;
    } else {
      // ── أول تشغيل فقط: لا توجد بيانات في Supabase → ارفع SEED ──
      if(SEED_DATA){
        data      = SEED_DATA.data      || {};
        shelves   = SEED_DATA.shelves   || [];
        oosManual = SEED_DATA.oosManual || [];
        settings  = sanitizeSettings(SEED_DATA.settings);
        theme     = SEED_DATA.theme     || 'dark';
        settings.seedVersion = SEED_VERSION;
        normalizeShelves();
        migrateLegacyShelfCells();
        const payload={...appStatePayload(),revision:1,updatedAt:new Date().toISOString(),updatedBy:SB_CLIENT_ID};
        await sbFetch(`${SB_TABLE}`,{method:'POST',body:JSON.stringify({id:1,payload})});
        sbStateRevision=1; sbStateHasRevision=true;
        showToast('📥 أول تشغيل — تم رفع البيانات الأولية');
      }
    }
    applyTheme();
    document.getElementById('warnDays').value = settings.warnDays;
    document.getElementById('critDays').value  = settings.critDays;
    normalizeShelves();
    await hydrateShelfPhotoUrls();
    migrateLegacyShelfCells();
    sbConnected=true;
    sbDirty=false;
    setSbStatus('connected');
    if(window.PharmacyAuditLog) try{ PharmacyAuditLog.flushQueue(); }catch(e){}
    if(!ignorePending){
      const pending=readPendingWrite();
      if(pending) showSyncConflict('توجد تغييرات محلية من جلسة سابقة لم يُؤكَّد حفظها. نزّلها أو حمّل أحدث نسخة قبل المتابعة.',{type:'recovery',pending});
      else hideSyncConflict();
    }
    // ── نسخة احتياطية عند الفتح إذا لم تُحفظ نسخة اليوم بعد ──
    scheduleBackupOnOpen();
    return true;
  } catch(e){
    sbConnected=false; setSbStatus('offline'); showToast('⚠️ تعذّر الاتصال بـ Supabase'); throw e;
  } finally { sbHydrating=false; }
}

async function saveOneSnapshot(){
  if(!sbConnected) throw new Error('لا يوجد اتصال مؤكد بقاعدة البيانات');
  if(sbConflict) throw new Error('الحفظ متوقف حتى حل تعارض النسخ');
  const localPayload=appStatePayload();
  const localFingerprint=payloadFingerprint(localPayload);
  const nextRevision=sbStateRevision+1;
  const payload={...localPayload,revision:nextRevision,updatedAt:new Date().toISOString(),updatedBy:SB_CLIENT_ID};
  const revisionFilter=sbStateHasRevision
    ?`payload-%3E%3Erevision=eq.${encodeURIComponent(sbStateRevision)}`
    :'payload-%3E%3Erevision=is.null';
  const rows=await sbFetch(`${SB_TABLE}?id=eq.1&${revisionFilter}`,{
    method:'PATCH',body:JSON.stringify({payload}),headers:{Prefer:'return=representation'}
  });
  if(!rows||rows.length!==1){
    const remote=await sbFetch(`${SB_TABLE}?id=eq.1&select=payload`);
    showSyncConflict('تم إيقاف الحفظ: توجد نسخة أحدث في قاعدة البيانات. لم تُستبدل أي بيانات.',{type:'revision',remote});
    throw new Error('تعارض إصدار: رفض الخادم الكتابة فوق نسخة أحدث');
  }
  sbStateRevision=nextRevision; sbStateHasRevision=true;
  if(payloadFingerprint()===localFingerprint){
    sbDirty=false; clearPendingWrite();
  }else{
    sbSaveRequested=true; persistPendingWrite();
  }
  setSbStatus('saved');
  return payload;
}

async function runSaveLoop(){
  try{
    while(sbSaveRequested&&!sbConflict){ sbSaveRequested=false; await saveOneSnapshot(); }
  }catch(e){
    if(!sbConflict) setSbStatus('offline');
    throw e;
  }finally{ sbSaveLoopPromise=null; }
}

function sbSaveNow(){
  if(window.PharmacySaveCoordinator){
    if(!sbSaveCoordinator) sbSaveCoordinator=PharmacySaveCoordinator.create({
      isHydrating:()=>sbHydrating,
      isAllowed:()=>['writer','admin'].includes(sbUserRole),
      isBlocked:()=>!!sbConflict,
      saveSnapshot:saveOneSnapshot
    });
    return sbSaveCoordinator.request();
  }
  if(sbHydrating) return Promise.resolve(false);
  if(!['writer','admin'].includes(sbUserRole)) return Promise.reject(new Error('الحساب للقراءة فقط'));
  sbSaveRequested=true;
  if(!sbSaveLoopPromise) sbSaveLoopPromise=runSaveLoop();
  return sbSaveLoopPromise;
}

function setSbStatus(s){
  const el=document.getElementById('sbStatus');
  if(!el) return;
  const map={connected:'🟢 Supabase متصل',saved:'✅ تم الحفظ المؤكد',offline:'🔴 غير محفوظ',syncing:'⏳ جاري الحفظ...',conflict:'⛔ تعارض — لم يُحفظ'};
  el.textContent=map[s]||s;
  el.dataset.s=s;
  // always refresh the counts visible in the top bar
  if(s==='connected'||s==='saved') try{ updateStats(); }catch(e){}
}
