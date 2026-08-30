// ══════════════════════════════════════
//  DRUGS (50 × 4)
// ══════════════════════════════════════
const RAW_DRUGS = [
  ["ACETYL SALISYLIC ACID TABLET\n75-100 MG","ACYCLOVIR TABLET\n200 MG","ALBENDAZOLE TABLET\n200 MG","ACYCLOVIR TABLET\n800 MG"],
  ["ALLOPURINOL TABLET\n100 MG","ALENDRONATE SOD TABLET\n70 MG","ALLOPURINOL TABLET\n300 MG","ALUMINIUM HYDROXIDE CAPSULE\n400-500 MG"],
  ["AMLODIPINE TABLET OR CAPSULE\n5 MG","AMIODARONE HCL TABLET\n200 MG","AMLODIPINE TABLET OR CAPSULE\n10 MG","ATENOLOL TABLETS\n50 MG"],
  ["AMOXICILLIN CAPSULE\n250 MG","AMOXICILLIN 500 MG + POT. CLAVULANATE 125 MG","AMOXICILLIN CAPSULE\n500 MG","AMOXICILLIN 875 MG + CLAVULANIC ACID 125 MG"],
  ["APIXABAN TABLET\n2.5 MG","ATORVASTATIN TABLET\n10 MG","APIXABAN TABLET\n5 MG","ATORVASTATIN TABLET\n20 MG"],
  ["ATORVASTATIN TABLET\n40 MG","AZITHROMYCIN TABLET\n250 MG","BACLOFEN SCORED TABLET\n10 MG","BETAHISTINE TABLETS\n8 MG"],
  ["BISACODYL TABLETS\n5 MG","BETAHISTINE TABLETS\n16 MG","BISOPROLOL TABLET\n5 MG","BROMHEXINE HCL TABLET\n8 MG"],
  ["CABERGOLINE TABLET\n0.5 MG","CALCUM LACTATE TABLETS\n300 MG","CAPTOPRIL TABLET\n25 MG","CALCUM CARBONATE TABLET\n500-600 MG"],
  ["CARVEDILOL TABLET\n6.25 MG","CARBIMAZOLE TABLET\n5 MG","CARVEDILOL TABLET\n25 MG","CARBAMAZEPINE TABLET\n200 MG"],
  ["CARBAMZEPINE SCORED TAB\n200 MG","CEFUROXIME TABLET\n250 MG","CARBAMAZEPINE CR TABLET\n400 MG","CELECOXIB CAPSULE\n200 MG"],
  ["CETIRIZINE HCL TABLET\n10 MG","CHLORPHENIRAMINE TABLET\n4 MG","CHLORZOXAZONE 250 MG + PARACETAMOL 500 MG CAPSULE","CHOLECALCIFEROL TABLET\n50000 IU"],
  ["CINACALCET TABLET\n30 MG","CINNARIZINE CAPSULES\n75 MG","CINACALCET TABLET\n60 MG","CIPROFLOXACIN TABLET\n500 MG"],
  ["CLARITHROMYCIN TABLET\n250 MG","CLOMIPHENE CITRATE TABLET\n50 MG","CLOPIDOGREL TABLET\n75 MG","DEXAMETHASONE TABLET\n0.5 MG"],
  ["DEXAMETHASONE TABLET\n2 MG","DICLOFENAC SODIUM TABLET\n50 MG","DILTIAZEM HCL TABLET\n60 MG","DIGOXIN SCORED TABLET\n0.125 MG"],
  ["DIGOXIN SCORED TABLET\n0.250 MG","DILTIAZEM SR TABLET\n90 MG","DOMPERIDONE TABLET\n10 MG","DOXYCYCLINE CAPSULE OR TABLET\n100 MG"],
  ["EMPAGLIFLOZIN TABLET\n10 MG","DYDROGESTERONE TABLET\n10 MG","EMPAGLIFLOZIN TABLET\n25 MG","ENALAPRIL TABLET\n10MG"],
  ["ERYTHROMYCIN TABLET\n250 MG","ESOMEPRAZOLE TABLET\n20 MG","ETHAMBUTOL HCL TABLET\n400 MG","EZETIMIBE TABLET\n10 MG"],
  ["FENOFIBRATE TABLET\n145 MG","FERROUS SULFATE TABLET\n190 MG","FINASTERIDE TABLET\n5 MG","FLUCONAZOLE TABLETS OR CAPSULE\n50 MG"],
  ["FLUDROCORTISONE ACETATE TABLET\n0.1 MG","FUROSEMIDE TABLET\n40 MG","GLICLAZIDE MR TABLET\n30 MG","GLIBENCLAMIDE TABLET\n5 MG"],
  ["GLICLAZIDE MR TABLET\n60 MG","GLIMEPRIDE TABLET\n2 MG","HYDRALAZINE TABLET\n25 MG","HYDROCHLORTHIAZIDE TABLET\n25 MG"],
  ["HYDROCORTISONE TABLET\n10 MG","HYDROXY UREA CAPSULE\n500 MG","HYDROXYCHLOROQUINE SULPHATE TABLET\n200 MG","HYOSCINE-N-BUTYL BROMIDE TABLET\n10 MG"],
  ["IBUPROFEN TABLET\n400 MG","INDAPAMIDE S.R. TABLET\n1.5 MG","INDOMETHACIN CAPSULE\n25 MG","IRON (ELEMENTAL 45-105 MG) + FOLIC ACID"],
  ["ISONIAZID TABLETS\n100 MG","ISOSORBIDE DINITRATE SL TABLET\n5 MG","ISOSORBIDE DINITRATE TABLET\n20 MG","ITRACONAZOLE TABLET\n100 MG"],
  ["LABETALOL TABLET\n100 MG","LAMOTRIGINE TABLET\n50 MG","LACOSAMIDE TABLET\n50 MG","LAMOTRIGINE TABLET\n100 MG"],
  ["LEVETIRACETAM TABLET\n500 MG","LACOSAMIDE TABLET\n100 MG","LEVODOPA 100 MG + CARBIDOPA 10 MG TABLET","LACOSAMIDE TABLET\n150 MG"],
  ["LEVODOPA 100 MG + CARBIDOPA 25 MG TABLET","LEVOFLOXACIN TABLET\n500 MG","LEVODOPA 250 MG + CARBIDOPA 25 MG","LEVOFLOXACIN TABLET\n750 MG"],
  ["LINAGLIPTIN TABLET\n5 MG","LINEZOLID TABLET\n600 MG","LOPERAMIDE HCL CAPSULES\n2 MG","LORNOXICAM TABLET\n8 MG"],
  ["LOSARTAN TABLET\n50 MG","MEBENDAZOLE CAPSULE OR TABLET\n100 MG","MEBEVERINE HCL TABLETS\n100-135 MG","MECLOZINE HCL 25 MG + VIT. B6 50 MG TABLET"],
  ["MEBEVERINE SR TABLET\n200 MG","MEFLOQUINE TABLET\n250 MG","MELOXICAM TABLET\n7.5 MG","METFORMIN HCL TABLET\n500 MG"],
  ["MELOXICAM TABLET\n15 MG","METFORMIN XR TABLET\n750 MG","METHOTREXATE TABLET\n2.5 MG","METHYL DOPA TABLET\n250 MG"],
  ["METOCLOPRAMIDE TABLET\n10 MG","METOPROLOL TABLET\n50 MG","MONTELUKAST TABLET\n5 MG","METRONIDAZOLE TABLET\n500MG"],
  ["MONTELUKAST TABLET\n10 MG","MOXIFLOXACIN TABLET\n400 MG","MYCOFENOLATE TABLET\n500 MG","NIFEDIPINE TABLE LONG ACTING\n30 MG"],
  ["NAPROXEN TABLET\n250 MG","NIFEDIPINE SR TABLET\n60 MG","NITROFURNATOIN CAPSULE OR TABLET\n100 MG","NORETHISTERONE TABLET\n5 MG"],
  ["OMEPRAZOLE TABLET\n20 MG","PANTOPRAZOLE TABLET\n20 MG","PARACETAMOL 500 MG + CODEINE 8 MG + CAFFEINE 30 MG","PANTOPRAZOLE TABLET\n40 MG"],
  ["PARACETAMOL TABLET\n500 MG","PENTOXYFILLINE HCL TABLET\n400 MG","PRAMIPEXOLE HCL 250 MCG (SIFROL 0.18MG)","PRAZOSIN HCL CAPSULE OR TABLET\n1 MG"],
  ["PERINDOPRIL TABLET\n5 MG","PREDNISOLONE TABLET\n5 MG","PERINDOPRIL TABLET\n10 MG","PIOGLITAZONE TABLET\n15 MG"],
  ["PROMETHAZINE HCL TABLET\n10 MG","PROPRANOLOL HCL TABLET\n10 MG","PROMETHAZINE HCL TABLET\n25 MG","PROPRANOLOL HCL TABLET\n40 MG"],
  ["PROPYLTHIOURACIL TABLET\n50 MG","PYRAZINAMIDE TABLET\n500 MG","PYRIDOXINE HCL (VITAMIN B6) TABLET\n10 MG","QUININE SULPHATE TABLET\n300 MG"],
  ["RAMIPRIL TABLET\n2.5 MG","RIFAMPICIN CAPSULES\n150 MG","RAMIPRIL TABLET\n5 MG","RIFAMPICIN CAPSULES\n300 MG"],
  ["ROSUVASTATIN TABLET\n10 MG","SACUBITRIL 24 MG + VALSARTAN 26 MG","ROSUVASTATIN TABLET\n20 MG","SACUBITRIL 49 MG + VALSARTAN 51 MG"],
  ["SILDENAFIL TABLET\n20 MG","SULFAMETHOXAZOLE 800 + TRIMETHOPRIM 160","SIMETHICONE TABLET\n42 MG","SITAGLIPTIN TABLET\n100 MG"],
  ["SOLIFENACIN TABLET\n5 MG","SOTALOL HCL TABLET\n80 MG","SPIRONOLACTONE TABLET\n25 MG","SULFASALAZINE TABLET\n500 MG"],
  ["SUMATRIPTAN SUCCINATE TABLET\n100 MG","TADALAFIL TABLET\n5 MG","TAMOXIFEN TABLET\n10 MG","TAMSULOSIN MR TABLET\n0.4 MG"],
  ["TELMISARTAN TABLET\n40 MG","TERBINAFINE TABLET\n250 MG","TELMISARTAN TABLET\n80 MG","THIAMINE (VITAMIN B1) TABLET\n100 MG"],
  ["THYROXINE SODIUM TABLET\n25 MCG","THEOPHYLLINE S.R. TABLET OR CAP\n200-300 MG","THYROXINE SODIUM TABLET\n50 MCG","TICAGRELOR TABLET\n90 MG"],
  ["THYROXINE SODIUM TABLET\n100 MCG","TOPIRAMATE TABLET\n15 MG","TRANEXAMIC ACID TABLET\n500 MG","TOPIRAMATE TABLET\n25 MG"],
  ["TOPIRAMATE TABLET\n100 MG","TRIMETAZIDINE MR TABLET\n35 MG","URSODEOXYCHOLIC ACID CAPSULE\n250 MG","VALPROIC ACID TABLET\n200 MG"],
  ["VALPROIC ACID TABLET\n500 MG","VALSARTAN TABLET\n80 MG","VERAPAMIL HCL TABLET\n40 MG","VARENICLINE TABLET\n0.5 MG"],
  ["VERAPAMIL HCL TABLET\n80 MG","VITAMIN ALFACALCIDOL\n0.25 MICROGRAMS","VITAMIN B1+B6+B12 TABLET","VITAMIN ALFACALCIDOL\n1 MICROGRAMS"],
  ["VITAMIN FOLIC ACID TABLET\n1 MG","VITAMIN D3\n1000 I.U.","VITAMIN FOLIC ACID TABLET\n5 MG","VITAMIN D3\n5000 I.U."]
];

const KNOWN_EXP = {
  "45D":["2026-05-11"],"46B":["2026-05-13"],"46C":["2026-05-15"],
  "46D":["2026-05-14"],"47A":["2026-05-12"],"47B":["2026-05-16"],
  "47C":["2026-05-17"],"48A":["2026-05-18"]
};
const SLOTS = ['A','B','C','D'];
const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ══ STATE ══
let data      = {};


let shelves   = [];   // { id, name, cols, rows, cells: { "A1": {drug,types[],expiries[],notes} } }
let oosManual = [];
let settings  = { warnDays:30, critDays:7 };
let theme     = 'dark';
let editingKey=null, editingShelfId=null, editingCellKey=null;

// ══ INIT ══
// ══ EXPORTED SEED DATA (your last manual export) ══
// Used ONLY when Supabase has no row yet (first-ever launch on a new browser).
// After that, Supabase is the single source of truth — localStorage is never used.
const SEED_DATA = {data:{},shelves:[],oosManual:[],settings:{warnDays:30,critDays:7,authMinutes:15,deletedKeys:[]},theme:'dark'};

function initData() {
  // Apply default settings only — data comes from Supabase, not localStorage
  settings = sanitizeSettings(settings);
  document.getElementById('warnDays').value = settings.warnDays;
  document.getElementById('critDays').value  = settings.critDays;
  applyTheme();
  updateShelfCapLabel();
}

// Seed a shelf's drug grid straight into the main `data` object, using the
// exact same key format as drawers (number+slot, e.g. "51A"). This is what
// makes the shelf page a real, live view of the database instead of a
// separate copy -- anything here shows up in search, alerts, and the DB tab too.
// Shelf layouts are loaded only from authenticated Supabase data.
// One-time migration: pull drug names out of any legacy shelf.cells (from an
// older version of this app) into the main `data` object so they become real,
// searchable, database-linked entries instead of a disconnected copy.
function migrateLegacyShelfCells(){
  let changed=false;
  shelves.forEach(sh=>{
    if(!sh.cells) return;
    const startNum=sh.startNum||1;
    for(const ck in sh.cells){
      const c=sh.cells[ck];
      if(!c||!c.drug) continue;
      const m=ck.match(/^([A-F])(\d+)$/); if(!m) continue;
      const rowLetter=m[1], colIdx=parseInt(m[2],10)-1;
      const key=`${startNum+colIdx}${rowLetter}`;
      if(!data[key]){
        data[key]=window.PharmacyMedicationOperations?PharmacyMedicationOperations.createRecord(c.drug,{expiries:c.expiries,types:c.types,shelf:true,notes:c.notes}):{name:c.drug, expiries:c.expiries||[], types:c.types||[], oos:false, shelf:true, notes:c.notes||''};
        changed=true;
      }
    }
    delete sh.cells;
  });
  if(changed){ saveData(); if(typeof sbSaveNow==='function') sbSaveNow(); }
}
// Assign startNum (continuing right after drawers 1-50) to any shelf that
// doesn't have one yet — fixes shelves saved before the numbering system
// existed (they used to show columns starting at 1).
function normalizeShelves(){
  let changed=false;
  let maxEnd=50;
  shelves.forEach(s=>{
    if(s.startNum==null){
      s.startNum = maxEnd+1;
      changed=true;
    }
    maxEnd = Math.max(maxEnd, s.startNum + (s.cols||5) - 1);
  });
  if(changed){ saveData(); if(typeof sbSaveNow==='function') sbSaveNow(); }
}

function saveSettings() {
  settings.warnDays=parseInt(document.getElementById('warnDays').value)||30;
  settings.critDays=parseInt(document.getElementById('critDays').value)||7;
  saveData();
}
function saveShelfSettings() { updateShelfCapLabel(); saveData(); }
function updateShelfCapLabel() {
  const c=parseInt(document.getElementById('shelfCols').value)||5;
  const r=parseInt(document.getElementById('shelfRows').value)||4;
  document.getElementById('shelfCapLabel').textContent=`${c} عامود × ${r} صف = ${c*r} خلية/رف`;
}

// ══ THEME ══
function toggleTheme() {
  theme = theme==='dark'?'light':'dark';
  applyTheme(); saveData();
}
function applyTheme() {
  document.body.classList.toggle('light', theme==='light');
  document.getElementById('themeBtn').textContent = theme==='light'?'🌙':'☀️';
}

// ══ HELPERS ══
function expStatus(d){ const n=daysUntil(d); return window.PharmacyMedicationPolicy?PharmacyMedicationPolicy.expiryStatus(n,settings):(n<0?'expired':n<=settings.critDays?'critical':n<=settings.warnDays?'warn':'ok'); }
function slotExpSt(key){ const d=data[key]; if(window.PharmacyMedicationPolicy)return PharmacyMedicationPolicy.itemStatus(d,daysUntil,settings); if(!d||!d.expiries||!d.expiries.length)return'none'; let w='ok'; for(const e of d.expiries){const s=expStatus(e);if(s==='expired'||s==='critical')return'danger';if(s==='warn')w='warn';} return w; }

// ══ ROLE-BASED WRITE PROTECTION ══
function invalidateDoseCountMap(){ /* no-op — dose-count cache not used in this build */ }
function isWriteAuthFresh(){ return ['writer','admin'].includes(sbUserRole); }
function requireWriteAuth(label, callback){
  if(isWriteAuthFresh()){ if(callback) callback(); return true; }
  showToast(`⛔ لا تملك صلاحية تنفيذ: ${label}`);
  return false;
}
// ── duplicate-name badge helper ──
function dupBadgeHtml(item, key){
  const norm=item.name.replace(/\n/g,' ').trim().toLowerCase();
  const hasDup=Object.keys(data).some(k=>k!==key &&
    data[k].name.replace(/\n/g,' ').trim().toLowerCase()===norm);
  if(!hasDup) return '';
  const dt=item.dupType||'';
  if(dt==='dose')  return `<span class="dup-badge dup-dose" title="نفس الدواء — جرعة مختلفة">💊 جرعة مختلفة</span>`;
  if(dt==='dup')   return `<span class="dup-badge" title="مكرر — يحتاج مراجعة">🔁 مكرر</span>`;
  return `<span class="dup-badge" title="يوجد دواء آخر بنفس الاسم — انقر لتحديد النوع">🔁 تكرار</span>`;
}
function rowLabel(r){ return ROW_LABELS[r]||String(r+1); } // A,B,C...

// ══ TABS ══
function switchTab(name,el){
  document.querySelectorAll('.tab-content').forEach(e=>e.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(e=>e.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  el.classList.add('active');
  document.querySelector('main').classList.toggle('main-wide', name==='shelf');
  if(name==='alerts') renderAlerts();
  if(name==='db')     renderDB();
  if(name==='voice')  initVoice();
  if(name==='search'){document.getElementById('searchInput').focus();doSearch();}
  if(name==='shelf')  renderShelves();
  if(name==='oos')    renderOOS();
  if(name==='table')  renderTable();
  if(name==='audit' && window.PharmacyAuditLog) PharmacyAuditLog.render();
}

// ══ ZOOM ══
let zoomLevel=0;
const ZOOM_STEPS=[280,320,360,420,500,600];
// ══ SHELF POSITION LOOKUP ══
function zoomDrawers(dir){
  zoomLevel=Math.max(0,Math.min(ZOOM_STEPS.length-1,zoomLevel+dir));
  const minW=ZOOM_STEPS[zoomLevel];
  const g=zoomLevel<=1?4:zoomLevel<=3?6:8;
  const el=document.getElementById('drawersGrid');
  el.style.gridTemplateColumns=`repeat(auto-fill,minmax(${minW}px,1fr))`;
  el.style.gap=g+'px';
  const pct=Math.round((minW/360)*100);
  document.getElementById('zoomLabel').textContent=pct+'%';
}

// helper: is a drug assigned to any shelf cell?
// ══ DATABASE ══
function renderDB(){
  const q=(document.getElementById('dbSearch').value||'').trim().toLowerCase();
  const f=document.getElementById('dbFilter').value;
  const sortEl=document.getElementById('dbSort');
  const sort=sortEl?sortEl.value:'drawer';
  const tbody=document.getElementById('dbTableBody');
  tbody.innerHTML='';
  let entries=[];
  for(const key in data){
    const item=data[key];
    const nm=!q||item.name.replace(/\n/g,' ').toLowerCase().includes(q)||key.toLowerCase().includes(q);
    if(!nm) continue;
    const exSt=slotExpSt(key);
    const assignedDrawer=isAssignedToDrawer(key);
    const numMatch=key.match(/\d+/);
    const assignedShelf=item.shelf||(!!numMatch&&parseInt(numMatch[0],10)>50);
    let pass=true;
    if(f==='has-exp')    pass=(item.expiries||[]).length>0;
    else if(f==='no-exp')  pass=(item.expiries||[]).length===0;
    else if(f==='expired') pass=exSt==='danger'&&(item.expiries||[]).some(e=>daysUntil(e)<0);
    else if(f==='warn')    pass=exSt==='warn';
    else if(f==='hazard')  pass=(item.types||[]).includes('hazard');
    else if(f==='lasa')    pass=(item.types||[]).includes('lasa');
    else if(f==='high-alert') pass=(item.types||[]).includes('high-alert');
    else if(f==='oos')     pass=item.oos;
    else if(f==='dup-name'){
      const norm2=item.name.replace(/\n/g,' ').trim().toLowerCase();
      pass=Object.keys(data).some(k2=>k2!==key&&data[k2].name.replace(/\n/g,' ').trim().toLowerCase()===norm2);
    }
    else if(f==='shelf')   pass=item.shelf||assignedShelf;
    else if(f==='unassigned-drawer') pass=!assignedDrawer;
    else if(f==='unassigned-shelf')  pass=!assignedShelf;
    else if(f==='unassigned-all')    pass=!assignedDrawer&&!assignedShelf;
    if(!pass) continue;
    entries.push({key,item,exSt,assignedDrawer,assignedShelf});
  }
  // ── Sort ──
  const bestExp=e=>e.item.expiries&&e.item.expiries.length?e.item.expiries.slice().sort()[0]:'9999';
  if(sort==='az') entries.sort((a,b)=>a.item.name.localeCompare(b.item.name,'en'));
  else if(sort==='za') entries.sort((a,b)=>b.item.name.localeCompare(a.item.name,'en'));
  else if(sort==='exp-asc') entries.sort((a,b)=>bestExp(a).localeCompare(bestExp(b)));
  else if(sort==='exp-desc') entries.sort((a,b)=>bestExp(b).localeCompare(bestExp(a)));
  else if(sort==='oos-first') entries.sort((a,b)=>(b.item.oos?1:0)-(a.item.oos?1:0));
  else entries.sort((a,b)=>{
    const na=parseInt(a.key.match(/\d+/)||[999]),nb=parseInt(b.key.match(/\d+/)||[999]);
    return na!==nb?na-nb:a.key.localeCompare(b.key);
  });

  // Build rows
  let html='';
  entries.forEach(({key,item,exSt,assignedDrawer,assignedShelf})=>{
    const nameClean=escapeHtml(item.name.replace(/\n/g,' '));
    const exHtml=(item.expiries||[]).length
      ?item.expiries.map(e=>{const s=expStatus(e),d=daysUntil(e);return`<span class="exp-tag ${s==='critical'?'danger':s}">${formatDate(e)} <small>(${daysLabel(d)})</small></span>`;}).join(' ')
      :`<span style="color:var(--noexp);font-size:11px;font-weight:600">— بدون تاريخ</span>`;
    let tHtml='';
    if((item.types||[]).includes('hazard'))     tHtml+=`<span class="type-badge hazard">⚠️H</span> `;
    if((item.types||[]).includes('lasa'))       tHtml+=`<span class="type-badge lasa">🔵L</span> `;
    if((item.types||[]).includes('high-alert')) tHtml+=`<span class="type-badge high-alert">🔴!</span> `;
    if(item.shelf||assignedShelf) tHtml+=`<span class="shelf-badge">📦</span> `;
    if(item.oos) tHtml+=`<span class="oos-badge">OOS</span> `;
    tHtml+=dupBadgeHtml(item,key);
    const stIcon=item.oos?'⬛':!(item.expiries||[]).length?`<span style="color:var(--noexp)">●</span>`:exSt==='danger'?'🔴':exSt==='warn'?'🟡':'🟢';
    let locHtml='';
    if(!assignedDrawer){
      locHtml=`<span style="color:var(--warn);font-size:10px;font-style:italic">بدون درج</span>
        <button class="btn btn-secondary btn-sm" style="margin-top:3px;display:block;font-size:10px" onclick="event.stopPropagation();openAssignDrawerModal('${key}')">📍 تعيين</button>`;
    } else {
      const dr=key.match(/\d+/)[0], sl=key.match(/[A-F]/)[0];
      locHtml=`<span style="font-family:var(--mono);font-size:11px;color:var(--accent2)">درج ${dr}—${sl}</span>
        <button class="btn btn-secondary btn-sm" style="margin-top:2px;display:block;font-size:10px" onclick="event.stopPropagation();openMoveDrawerModal('${key}')">🔀 نقل</button>`;
    }
    const oosClass=item.oos?' class="cell-oos"':'';
    html+=`<tr${oosClass} style="cursor:pointer" onclick="openExpModal('${key}')">
      <td style="text-align:center;vertical-align:middle"><input type="checkbox" class="db-row-chk" data-key="${key}" style="width:15px;height:15px;cursor:pointer" onclick="event.stopPropagation()" onchange="dbUpdateBulkBar()"></td>
      <td class="loc-cell" style="vertical-align:top;padding-top:8px">${locHtml}</td>
      <td class="name-cell" style="max-width:260px;word-break:break-word;white-space:normal;line-height:1.4;font-weight:600">${nameClean}</td>
      <td>${tHtml||'<span style="color:var(--text3)">—</span>'}</td>
      <td>${exHtml}</td>
      <td style="text-align:center;font-size:14px">${stIcon}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();openMoveDrawerModal('${key}')">🔀</button></td>
      <td><button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();openExpModal('${key}')">✏️</button></td>
    </tr>`;
  });
  tbody.innerHTML=html;
  document.getElementById('dbCountLabel').textContent=`${entries.length} دواء`;
  dbUpdateBulkBar();
  updateStats();
}
// ── Bulk selection helpers ──
function dbUpdateBulkBar(){
  const chks=[...document.querySelectorAll('.db-row-chk')];
  const sel=chks.filter(c=>c.checked);
  const bar=document.getElementById('dbBulkBar');
  const allChk=document.getElementById('dbSelectAllChk');
  document.getElementById('dbBulkCount').textContent=`${sel.length} محدد`;
  bar.style.display=sel.length>0?'flex':'none';
  if(allChk) allChk.checked=chks.length>0&&sel.length===chks.length;
}
function dbToggleAll(checked){
  document.querySelectorAll('.db-row-chk').forEach(c=>c.checked=checked);
  dbUpdateBulkBar();
}
function dbSelectAll(){ dbToggleAll(true); }
function dbDeselectAll(){
  dbToggleAll(false);
  const p=document.getElementById('dbBulkPass'); if(p) p.value='';
}
async function dbBulkDelete(){
  if(!requireWriteAuth('حذف مجموعة أدوية')) return;
  const keys=[...document.querySelectorAll('.db-row-chk:checked')].map(c=>c.dataset.key);
  if(!keys.length){ showToast('⚠️ لم تحدد أي دواء'); return; }
  if(!confirm(`حذف ${keys.length} دواء نهائياً؟`)) return;
  const _deletedNames=keys.map(k=>data[k]?data[k].name:'').filter(Boolean);
  keys.forEach(k=>{ delete data[k]; });
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('bulk_delete',null,null,{count:keys.length,keys,names:_deletedNames.slice(0,20)}); }
  saveData();
  let confirmed=false;
  try{ await sbSaveNow(); confirmed=true; } catch(e){}
  document.getElementById('dbBulkPass').value='';
  renderDB(); // immediate refresh — no need to reload page
  showToast(confirmed?`🗑️ تم حذف ${keys.length} دواء وحُفظ التغيير ✅`:'⚠️ لم يتأكد الحذف — احتفظنا بنسخة محلية للاسترداد');
}

// ══ IMPORT/EXPORT MODAL ══
let _importMode='add';
function openImportExportModal(){ document.getElementById('importExportModal').classList.add('open'); }
function triggerImport(mode){
  _importMode=mode;
  document.getElementById('importFileHidden').accept = mode==='replace'?'.json':'.json,.csv';
  document.getElementById('importFileHidden').value='';
  document.getElementById('importFileHidden').click();
}
function doImportFile(input){
  const file=input.files[0]; if(!file){ return; }
  requireWriteAuth('استيراد بيانات', ()=>{
    const r=new FileReader();
    r.onload=e=>{
      try{
        const text=e.target.result;
        if(file.name.endsWith('.csv') && _importMode!=='replace'){
          // CSV: merge/add
          const lines=text.replace(/^\ufeff/,'').split('\n').slice(1);
          let count=0;
          lines.forEach(line=>{
            if(!line.trim()) return;
            const cols=[];let cur='',inQ=false;
            for(const ch of line){ if(ch==='"'){inQ=!inQ;} else if(ch===','&&!inQ){cols.push(cur);cur='';}else cur+=ch; }
            cols.push(cur);
            const key=cols[0]?.replace(/"/g,'').trim();
            const name=cleanUserText(cols[1]?.replace(/"/g,''),500);
            const expiries=normalizeExpiries((cols[8]||'').replace(/"/g,'').split('|').map(s=>s.trim()));
            const notes=cleanUserText((cols[9]||'').replace(/"/g,''),1000);
            if(!isValidDataKey(key)||!name) return;
            if(_importMode==='add' && data[key]) return; // skip existing
            if(!data[key]) data[key]=window.PharmacyMedicationOperations?PharmacyMedicationOperations.createRecord(name):{name,expiries:[],types:[],oos:false,shelf:false,notes:''};
            data[key].name=name;
            if(expiries.length) data[key].expiries=expiries;
            if(notes) data[key].notes=notes;
            count++;
          });
          saveData();closeModal('importExportModal');renderDB();
          if(window.PharmacyAuditLog){ PharmacyAuditLog.log('import_data',null,null,{mode:_importMode,format:'csv',count}); }
          showToast(`✅ تم استيراد ${count} دواء من CSV`);
        } else {
          // JSON
          const p=JSON.parse(text);
          if(_importMode==='replace'){
            if(!validateStatePayload(p)) throw new Error('بنية JSON أو التواريخ غير صالحة');
            applyStatePayload(p); settings.seedVersion=SEED_VERSION;
            document.getElementById('warnDays').value=settings.warnDays;
            document.getElementById('critDays').value=settings.critDays;
            applyTheme();
          } else {
            const src=p.data||{};
            Object.keys(src).forEach(k=>{
              if(_importMode==='add' && data[k]) return;
              if(!validateStatePayload({data:{[k]:src[k]},shelves:[],oosManual:[]})) throw new Error(`سجل غير صالح: ${k}`);
              data[k]=window.PharmacyMedicationOperations?PharmacyMedicationOperations.fromRaw(src[k],src[k]&&src[k].name):src[k];
            });
          }
          saveData();closeModal('importExportModal');refreshAll();
          if(window.PharmacyAuditLog){ PharmacyAuditLog.log('import_data',null,null,{mode:_importMode,format:'json'}); }
          showToast('✅ تم الاستيراد وحفظه في Supabase');
        }
      }catch(err){showToast('❌ خطأ في الملف: '+err.message);}
    };
    r.readAsText(file,'utf-8');
  });
  input.value='';
}

// ══ ADD NEW DRUG ══
function openAddDrugModal(){
  document.getElementById('newDrugName').value='';
  document.getElementById('newDrugDrawer').value='';
  document.getElementById('newDrugSlot').value='A';
  document.getElementById('newDrugDupWarn').style.display='none';
  document.getElementById('newDrugSlotWarn').style.display='none';
  document.getElementById('newDrugHazard').checked=false;
  document.getElementById('newDrugLasa').checked=false;
  document.getElementById('newDrugHighAlert').checked=false;
  document.getElementById('addDrugModal').classList.add('open');
}
function checkNewDrugSlot(){
  const dr=document.getElementById('newDrugDrawer').value.trim();
  const sl=document.getElementById('newDrugSlot').value;
  const slotWarn=document.getElementById('newDrugSlotWarn');
  if(dr&&sl){
    const key=`${dr}${sl}`;
    const existing=data[key];
    if(existing){
      slotWarn.style.display='block';
      slotWarn.textContent=`⚠️ هذه الخانة (درج ${dr}—${sl}) مشغولة بـ: ${existing.name.replace(/\n/g,' ')}`;
    } else { slotWarn.style.display='none'; }
  } else { slotWarn.style.display='none'; }
  // check drug name dup
  const nameVal=document.getElementById('newDrugName').value.trim().toLowerCase();
  checkNewDrugNameDup(nameVal);
}
function checkNewDrugNameDup(nameVal){
  const dupWarn=document.getElementById('newDrugDupWarn');
  if(!nameVal){dupWarn.style.display='none';return;}
  const existing=Object.values(data).find(d=>d.name.replace(/\n/g,' ').trim().toLowerCase()===nameVal);
  if(existing){
    dupWarn.style.display='block';
    dupWarn.textContent=`⚠️ هذا الدواء موجود بالفعل في القاعدة: ${existing.name.replace(/\n/g,' ')}`;
  } else { dupWarn.style.display='none'; }
}
function saveNewDrug(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  const nameVal=document.getElementById('newDrugName').value.trim();
  if(!nameVal) return showToast('⚠️ أدخل اسم الدواء');
  // dup check
  const norm=nameVal.replace(/\n/g,' ').trim().toLowerCase();
  const dup=Object.values(data).find(d=>d.name.replace(/\n/g,' ').trim().toLowerCase()===norm);
  if(dup) return showToast('❌ هذا الدواء موجود بالفعل في قاعدة البيانات');
  const dr=document.getElementById('newDrugDrawer').value.trim();
  const sl=document.getElementById('newDrugSlot').value;
  const types=[];
  if(document.getElementById('newDrugHazard').checked)    types.push('hazard');
  if(document.getElementById('newDrugLasa').checked)      types.push('lasa');
  if(document.getElementById('newDrugHighAlert').checked) types.push('high-alert');
  if(dr&&sl){
    // assign to fixed slot
    const key=`${dr}${sl}`;
    if(data[key]){
      const occupantName=data[key].name.replace(/\n/g,' ');
      const choice=confirm(
        `الخانة درج ${dr}—${sl} مشغولة بـ:\n"${occupantName}"\n\n` +
        `اضغط موافق ← تبديل (الدواء الجديد يأخذ المكان، القديم يبقى بدون تعيين)\n` +
        `اضغط إلغاء ← حفظ الجديد بدون موقع الآن`
      );
      if(choice){
        const oldKey='x_'+uid();
        data[oldKey]={...data[key], drawerNum:null, drawerSlot:null, extra:true};
        data[key]=window.PharmacyMedicationOperations?PharmacyMedicationOperations.createRecord(nameVal,{types,extra:true}):{name:nameVal,expiries:[],types,oos:false,shelf:false,notes:'',extra:true};
        saveData(); refreshAll(); closeModal('addDrugModal');
        if(window.PharmacyAuditLog){ PharmacyAuditLog.log('add_drug',key,nameVal,{location:`${dr}${sl}`,displaced:occupantName,displacedTo:oldKey}); }
        showToast(`✅ تمت الإضافة في درج ${dr}—${sl} — "${occupantName}" أصبح بدون تعيين`);
      } else {
        const newKey='x_'+uid();
        data[newKey]=window.PharmacyMedicationOperations?PharmacyMedicationOperations.createRecord(nameVal,{types,extra:true,drawerNum:null,drawerSlot:null}):{name:nameVal,expiries:[],types,oos:false,shelf:false,notes:'',extra:true,drawerNum:null,drawerSlot:null};
        saveData(); refreshAll(); closeModal('addDrugModal');
        if(window.PharmacyAuditLog){ PharmacyAuditLog.log('add_drug',newKey,nameVal,{unassigned:true}); }
        showToast('✅ تمت إضافة الدواء بدون موقع');
      }
      return;
    }
    data[key]=window.PharmacyMedicationOperations?PharmacyMedicationOperations.createRecord(nameVal,{types,extra:true}):{name:nameVal,expiries:[],types,oos:false,shelf:false,notes:'',extra:true};
  } else {
    // no slot yet — store as extra
    const key='x_'+uid();
    data[key]=window.PharmacyMedicationOperations?PharmacyMedicationOperations.createRecord(nameVal,{types,extra:true,drawerNum:null,drawerSlot:null}):{name:nameVal,expiries:[],types,oos:false,shelf:false,notes:'',extra:true,drawerNum:null,drawerSlot:null};
  }
  saveData(); refreshAll(); closeModal('addDrugModal');
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('add_drug',dr&&sl?`${dr}${sl}`:'x_unassigned',nameVal,{location:dr&&sl?`${dr}${sl}`:'unassigned',types}); }
  showToast('✅ تمت إضافة الدواء للقاعدة'+(dr?` (درج ${dr}—${sl})`:'، بدون موقع بعد'));
}

// ══ BULK ADD (paste table) ══
function openBulkAddModal(){
  document.getElementById('bulkPasteArea').value='';
  document.getElementById('bulkPreviewArea').innerHTML='';
  document.getElementById('bulkAddModal').classList.add('open');
}
function parseBulkDrugs(){
  const raw=document.getElementById('bulkPasteArea').value.trim();
  if(!raw) return showToast('⚠️ الصق النص أولاً');
  const lines=raw.split('\n').map(l=>l.trim()).filter(Boolean);
  const preview=document.getElementById('bulkPreviewArea');
  preview.innerHTML='';
  let parsed=[];
  lines.forEach((line,i)=>{
    // support: tab-separated (col1 = name, col2 optional = drawer num, col3 optional = slot)
    const parts=line.split(/\t|,/).map(p=>p.trim());
    const name=parts[0];
    const dr=parts[1]||'';
    const sl=(parts[2]||'').toUpperCase();
    if(!name){return;}
    const norm=name.toLowerCase();
    const isDup=Object.values(data).some(d=>d.name.replace(/\n/g,' ').trim().toLowerCase()===norm);
    const slotTaken=dr&&sl&&data[`${dr}${sl}`];
    parsed.push({name,dr,sl,isDup,slotTaken});
    const color=isDup?'var(--warn)':slotTaken?'var(--danger)':'var(--success)';
    const icon=isDup?'⚠️ مكرر':slotTaken?'❌ خانة مشغولة':'✅';
    preview.innerHTML+=`<div style="display:flex;align-items:center;gap:8px;padding:4px 8px;border-bottom:1px solid var(--border);font-size:11px">
      <span style="color:${color};width:80px;flex-shrink:0">${icon}</span>
      <span style="flex:1;font-weight:600">${name}</span>
      ${dr?`<span style="font-family:var(--mono);color:var(--accent2);font-size:10px">درج ${dr}${sl||''}</span>`:'<span style="color:var(--text3);font-size:10px">بدون موقع</span>'}
    </div>`;
  });
  preview._parsed=parsed;
}
function saveBulkDrugs(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  const preview=document.getElementById('bulkPreviewArea');
  const parsed=preview._parsed;
  if(!parsed||!parsed.length) return showToast('⚠️ اضغط "معاينة" أولاً');
  let added=0, skipped=0;
  parsed.forEach(({name,dr,sl,isDup,slotTaken})=>{
    if(isDup||slotTaken){skipped++;return;}
    if(dr&&sl){
      const key=`${dr}${sl}`;
      if(!data[key]){data[key]=window.PharmacyMedicationOperations?PharmacyMedicationOperations.createRecord(name,{extra:true}):{name,expiries:[],types:[],oos:false,shelf:false,notes:'',extra:true};added++;}
      else skipped++;
    } else {
      const key='x_'+uid();
      data[key]=window.PharmacyMedicationOperations?PharmacyMedicationOperations.createRecord(name,{extra:true,drawerNum:null,drawerSlot:null}):{name,expiries:[],types:[],oos:false,shelf:false,notes:'',extra:true,drawerNum:null,drawerSlot:null};
      added++;
    }
  });
  saveData();refreshAll();closeModal('bulkAddModal');
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('bulk_add',null,null,{count:added,skipped}); }
  showToast(`✅ تمت إضافة ${added} دواء، تخطي ${skipped} مكرر/خانة مشغولة`);
}

// ══ MOVE DRAWER ══
let movingKey=null;
function openMoveDrawerModal(key){
  movingKey=key;
  const item=data[key];
  const dr=key.match(/\d+/)[0], sl=key.match(/[A-F]/)[0];
  document.getElementById('moveDrawerInfo').innerHTML=`<strong>${escapeHtml(item.name.replace(/\n/g,' '))}</strong><br>
    الموقع الحالي: <span style="font-family:var(--mono);color:var(--accent)">درج ${dr} — ${sl}</span>`;
  document.getElementById('moveTargetDrawer').value='';
  document.getElementById('moveTargetSlot').value=sl;
  document.getElementById('moveTargetWarn').style.display='none';
  document.getElementById('moveDrawerModal').classList.add('open');
}
function checkMoveTarget(){
  const dr=document.getElementById('moveTargetDrawer').value.trim();
  const sl=document.getElementById('moveTargetSlot').value;
  const warn=document.getElementById('moveTargetWarn');
  if(dr&&sl){
    const key=`${dr}${sl}`;
    if(key===movingKey){warn.style.display='none';return;}
    const existing=data[key];
    if(existing){
      warn.style.display='block';
      warn.style.color='var(--warn)';
      warn.innerHTML=`⚠️ الخانة درج ${escapeHtml(dr)}—${escapeHtml(sl)} مشغولة بـ: <strong>${escapeHtml(existing.name.replace(/\n/g,' '))}</strong><br><span style="font-size:10px;color:var(--text3)">عند التأكيد: تبديل الموقعين أو إزاحة الموجود لـ"بدون تعيين"</span>`;
    } else { warn.style.display='none'; }
  } else { warn.style.display='none'; }
}
function confirmMoveDrawer(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  const dr=document.getElementById('moveTargetDrawer').value.trim();
  const sl=document.getElementById('moveTargetSlot').value;
  if(!dr) return showToast('⚠️ أدخل رقم الدرج');
  const newKey=`${dr}${sl}`;
  if(newKey===movingKey){closeModal('moveDrawerModal');return;}

  if(data[newKey]){
    // Slot is occupied → offer two choices
    const occupantName=data[newKey].name.replace(/\n/g,' ');
    const choice=confirm(
      `الخانة درج ${dr}—${sl} مشغولة بـ:\n"${occupantName}"\n\n` +
      `اضغط موافق ← تبديل (كل دواء يأخذ مكان الآخر)\n` +
      `اضغط إلغاء ← أخذ الخانة وإبقاء الآخر بدون تعيين`
    );
    if(choice){
      // swap
      const movingName=data[movingKey].name.replace(/\n/g,' ');
      const tmp={...data[newKey]};
      data[newKey]={...data[movingKey]};
      data[movingKey]=tmp;
      saveData();refreshAll();closeModal('moveDrawerModal');
      if(window.PharmacyAuditLog){ PharmacyAuditLog.log('swap_drugs',movingKey,movingName,{from:movingKey,to:newKey,swappedWith:occupantName}); }
      showToast(`🔄 تم تبديل الدواءين`);
    } else {
      // take slot, old drug becomes unassigned (x_)
      const movingName=data[movingKey].name.replace(/\n/g,' ');
      const oldKey='x_'+uid();
      data[oldKey]={...data[newKey], drawerNum:null, drawerSlot:null, extra:true};
      data[newKey]={...data[movingKey]};
      delete data[movingKey];
      saveData();refreshAll();closeModal('moveDrawerModal');
      if(window.PharmacyAuditLog){ PharmacyAuditLog.log('move_drug',newKey,movingName,{from:movingKey,to:newKey,displaced:occupantName}); }
      showToast(`✅ تم النقل — "${occupantName}" أصبح بدون تعيين`);
    }
    return;
  }

  // slot is free — simple move
  const _moveName=data[movingKey]?data[movingKey].name.replace(/\n/g,' '):'';
  if(window.PharmacyMedicationOperations) data=PharmacyMedicationOperations.assign(data,movingKey,newKey);
  else { data[newKey]={...data[movingKey]}; delete data[movingKey]; }
  saveData();refreshAll();closeModal('moveDrawerModal');
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('move_drug',newKey,_moveName,{from:movingKey,to:newKey}); }
  showToast(`✅ تم نقل الدواء إلى درج ${dr}—${sl}`);
}

// ══ ASSIGN DRAWER (for x_ extras) ══
let assigningKey=null;
function openAssignDrawerModal(key){
  assigningKey=key;
  const item=data[key];
  document.getElementById('assignDrugInfo').innerHTML=`<strong>${escapeHtml(item.name.replace(/\n/g,' '))}</strong>`;
  document.getElementById('assignTargetDrawer').value='';
  document.getElementById('assignTargetSlot').value='A';
  document.getElementById('assignTargetWarn').style.display='none';
  document.getElementById('assignDrawerModal').classList.add('open');
}
function checkAssignTarget(){
  const dr=document.getElementById('assignTargetDrawer').value.trim();
  const sl=document.getElementById('assignTargetSlot').value;
  const warn=document.getElementById('assignTargetWarn');
  if(dr&&sl){
    const key=`${dr}${sl}`;
    const existing=data[key];
    if(existing){
      warn.style.display='block';
      warn.style.color='var(--warn)';
      warn.innerHTML=`⚠️ الخانة درج ${escapeHtml(dr)}—${escapeHtml(sl)} مشغولة بـ: <strong>${escapeHtml(existing.name.replace(/\n/g,' '))}</strong><br><span style="font-size:10px;color:var(--text3)">عند التأكيد: تبديل الموقعين أو إزاحة الموجود لـ"بدون تعيين"</span>`;
    } else { warn.style.display='none'; }
  } else { warn.style.display='none'; }
}
function confirmAssignDrawer(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  const dr=document.getElementById('assignTargetDrawer').value.trim();
  const sl=document.getElementById('assignTargetSlot').value;
  if(!dr) return showToast('⚠️ أدخل رقم الدرج');
  const newKey=`${dr}${sl}`;

  if(data[newKey]){
    const occupantName=data[newKey].name.replace(/\n/g,' ');
    const choice=confirm(
      `الخانة درج ${dr}—${sl} مشغولة بـ:\n"${occupantName}"\n\n` +
      `اضغط موافق ← تبديل (كل دواء يأخذ مكان الآخر)\n` +
      `اضغط إلغاء ← أخذ الخانة وإبقاء الآخر بدون تعيين`
    );
    const _assignName=data[assigningKey]?data[assigningKey].name.replace(/\n/g,' '):'';
    if(choice){
      // swap: old slot drug goes to x_ temporarily, then assigningKey's data goes to newKey, old goes to x_
      const tmpOld={...data[newKey]};
      data[newKey]={...data[assigningKey]};
      delete data[assigningKey];
      const oldKey='x_'+uid();
      data[oldKey]={...tmpOld, drawerNum:null, drawerSlot:null, extra:true};
      saveData();refreshAll();closeModal('assignDrawerModal');
      if(window.PharmacyAuditLog){ PharmacyAuditLog.log('swap_drugs',newKey,_assignName,{from:assigningKey,to:newKey,swappedWith:occupantName}); }
      showToast(`🔄 تم التبديل — "${occupantName}" أصبح بدون تعيين`);
    } else {
      const oldKey='x_'+uid();
      data[oldKey]={...data[newKey], drawerNum:null, drawerSlot:null, extra:true};
      data[newKey]={...data[assigningKey]};
      delete data[assigningKey];
      saveData();refreshAll();closeModal('assignDrawerModal');
      if(window.PharmacyAuditLog){ PharmacyAuditLog.log('move_drug',newKey,_assignName,{from:assigningKey,to:newKey,displaced:occupantName}); }
      showToast(`✅ تم التعيين — "${occupantName}" أصبح بدون تعيين`);
    }
    return;
  }

  const _assignDrugName=data[assigningKey]?data[assigningKey].name.replace(/\n/g,' '):'';
  if(window.PharmacyMedicationOperations) data=PharmacyMedicationOperations.assign(data,assigningKey,newKey);
  else { data[newKey]={...data[assigningKey]}; delete data[assigningKey]; }
  saveData();refreshAll();closeModal('assignDrawerModal');
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('move_drug',newKey,_assignDrugName,{from:assigningKey,to:newKey}); }
  showToast(`✅ تم تعيين الدواء في درج ${dr}—${sl}`);
}

// ══ DRAWERS ══
let drawerView='card';
function setDrawerView(v){
  drawerView=v;
  document.getElementById('viewBtnCard').classList.toggle('active',v==='card');
  document.getElementById('viewBtnTable').classList.toggle('active',v==='table');
  renderDrawers();
}

function renderDrawers(){
  const q=(document.getElementById('drawerFilter').value||'').trim().toLowerCase();
  const grid=document.getElementById('drawersGrid');
  grid.innerHTML='';

  if(drawerView==='table'){
    grid.style.display='block';
    const wrap=document.createElement('div');wrap.style.overflowX='auto';
    const tbl=document.createElement('table');tbl.className='drawers-table';
    tbl.innerHTML=`<thead><tr>
      <th style="width:80px">الموقع</th>
      <th>اسم الدواء</th>
      <th style="width:120px">النوع</th>
      <th style="width:160px">تواريخ الانتهاء</th>
      <th style="width:60px"></th>
    </tr></thead>`;
    const tbody=document.createElement('tbody');
    for(let r=1;r<=50;r++){
      SLOTS.forEach(sl=>{
        const key=`${r}${sl}`,item=data[key];
        if(q&&!item.name.toLowerCase().includes(q))return;
        const exSt=slotExpSt(key);
        const expsHtml=item.expiries.length
          ?item.expiries.map(e=>{const s=expStatus(e),d=daysUntil(e);return`<span class="exp-tag ${s==='critical'?'danger':s}">${formatDate(e)}</span>`;}).join(' ')
          :'<span style="color:var(--text3)">—</span>';
        let tHtml='';
        if(item.types.includes('hazard'))     tHtml+=`<span class="type-badge hazard">⚠️</span>`;
        if(item.types.includes('lasa'))       tHtml+=`<span class="type-badge lasa">🔵</span>`;
        if(item.types.includes('high-alert')) tHtml+=`<span class="type-badge high-alert">🔴</span>`;
        if(item.shelf) tHtml+=`<span class="shelf-badge">📦</span>`;
        if(item.oos)   tHtml+=`<span class="oos-badge">OOS</span>`;
        tHtml+=dupBadgeHtml(item,key);
        const nameClean=escapeHtml(item.name.replace(/\n/g,' '));
        const tr=document.createElement('tr');
        if(item.oos) tr.classList.add('cell-oos');
        tr.innerHTML=`<td class="loc-cell">درج ${r} — ${sl}</td>
          <td class="name-cell">${nameClean}</td>
          <td>${tHtml||'—'}</td>
          <td>${expsHtml}</td>
          <td><button class="btn btn-secondary btn-sm" onclick="openExpModal('${key}')">✏️</button></td>`;
        tbody.appendChild(tr);
      });
    }
    tbl.appendChild(tbody);wrap.appendChild(tbl);grid.appendChild(wrap);
    updateStats();return;
  }

  // ── CARD VIEW ──
  grid.style.display='';
  for(let r=1;r<=50;r++){
    const allKeys=SLOTS.map(sl=>`${r}${sl}`);
    // guard: skip if any slot is completely missing from data
    if(allKeys.some(k=>!data[k])) continue;
    const anyMatch=!q||allKeys.some(k=>data[k].name.toLowerCase().includes(q));
    if(!anyMatch)continue;

    const card=document.createElement('div');card.className='drawer-card';

    // status dots for header preview
    const dots=SLOTS.map(sl=>{
      const key=`${r}${sl}`,item=data[key];
      const exSt=slotExpSt(key);
      let dotColor='var(--text3)';
      if(item.oos) dotColor='#6e7681';
      else if(!item.expiries.length) dotColor='var(--noexp)';
      else if(exSt==='danger') dotColor='var(--danger)';
      else if(exSt==='warn')   dotColor='var(--warn)';
      else dotColor='var(--success)';
      return `<span class="status-dot-sm" style="background:${dotColor}" title="${sl}"></span>`;
    }).join('');

    card.innerHTML=`<div class="drawer-card-header" style="direction:ltr">
      <span class="drawer-num">${r}</span>
      <span style="font-size:10px;color:var(--text3);font-family:var(--mono)">A→D</span>
      <div class="drawer-status-dots">${dots}</div>
    </div>`;

    SLOTS.forEach(sl=>{
      const key=`${r}${sl}`,item=data[key];
      const dim=q&&!item.name.toLowerCase().includes(q);
      const exSt=slotExpSt(key);

      let rowCls='drawer-row';
      if(dim){rowCls+=' dimmed';}
      else{
        if(!item.expiries.length) rowCls+=' no-expiry';
        else if(exSt==='danger')  rowCls+=' has-alert';
        else if(exSt==='warn')    rowCls+=' has-warn';
        if(item.types.includes('high-alert')) rowCls+=' type-high-alert';
        else if(item.types.includes('lasa'))  rowCls+=' type-lasa';
        else if(item.types.includes('hazard'))rowCls+=' type-hazard';
        if(item.oos) rowCls+=' cell-oos';
      }

      const row=document.createElement('div');row.className=rowCls;
      if(dim)row.style.opacity='.18';

      // badges (icon only to save space)
      let badgeHtml='';
      if(item.types.includes('hazard'))     badgeHtml+=`<span class="type-badge hazard" style="padding:0 3px">⚠️</span>`;
      if(item.types.includes('lasa'))       badgeHtml+=`<span class="type-badge lasa" style="padding:0 3px">🔵</span>`;
      if(item.types.includes('high-alert')) badgeHtml+=`<span class="type-badge high-alert" style="padding:0 3px">🔴</span>`;
      if(item.shelf)                        badgeHtml+=`<span class="shelf-badge" style="padding:0 3px">📦</span>`;
      if(item.oos)                          badgeHtml+=`<span class="oos-badge" style="padding:0 3px">OOS</span>`;
      badgeHtml+=dupBadgeHtml(item,key);

      // expiry tags inline (only earliest)
      let expHtml='';
      if(item.expiries.length){
        const earliest=[...item.expiries].sort()[0];
        const s=expStatus(earliest),d=daysUntil(earliest);
        expHtml=`<span class="exp-tag ${s==='critical'?'danger':s}" style="font-size:8px;padding:0 4px">${formatDate(earliest)}</span>`;
      }

      const nameClean=escapeHtml(item.name.replace(/\n/g,' '));
      const drugCls='row-drug'+((!item.expiries.length&&!dim)?' no-expiry-text':'');

      row.innerHTML=`
        <div class="row-label">${sl}</div>
        <div class="row-body">
          ${badgeHtml?`<div class="row-badges">${badgeHtml}</div>`:''}
          <div class="${drugCls}" title="${nameClean}">${nameClean}</div>
        </div>
        <div class="row-right">
          ${expHtml}
          <button class="add-exp-btn" style="margin-top:0;padding:1px 6px;font-size:10px" onclick="event.stopPropagation();openExpModal('${key}')">✏️</button>
        </div>`;
      row.addEventListener('click',()=>openExpModal(key));
      card.appendChild(row);
    });

    grid.appendChild(card);
  }
  updateStats();
}

// ══ STATS ══
function updateStats(){
  const total = Object.keys(data).length;
  // update the header drug count badge (hardcoded 200 before, now live)
  const countBadge = document.querySelector('.stat-badge span:first-child') || document.querySelector('.stats .stat-badge:first-child span');
  if(countBadge) countBadge.textContent = total;
  // also update via id if present
  const totalEl = document.getElementById('totalDrugCount');
  if(totalEl) totalEl.textContent = total;

  let alerts=0;
  for(const key in data){ for(const e of (data[key].expiries||[])){ if(daysUntil(e)<=settings.warnDays) alerts++; } }
  const oos=Object.values(data).filter(d=>d.oos).length+oosManual.length;
  document.getElementById('alertCount').textContent=alerts;
  document.getElementById('alertCountBadge').textContent=alerts;
  document.getElementById('oosCount').textContent=oos;
  document.getElementById('oosCountBadge').textContent=oos;
  document.getElementById('shelfCount').textContent=shelves.length;
  document.getElementById('alertStatBadge').style.color=alerts>0?'var(--danger)':'var(--text2)';
  document.getElementById('oosStatBadge').style.color=oos>0?'var(--warn)':'var(--text2)';
}

// ══ DRUG MODAL ══
function openExpModal(key){
  editingKey=key; const item=data[key];
  const isExtra=key.startsWith('x_');
  const numMatch=key.match(/\d+/), slotMatch=key.match(/[A-F]/);
  const num=numMatch?parseInt(numMatch[0],10):null;
  const isShelfNum = num!=null && num>50;
  const locText=isExtra
    ? '<span style="color:var(--warn)">بدون موقع محدد</span>'
    : `${isShelfNum?'رقم':'درج'} ${numMatch[0]} — خانة ${slotMatch[0]}`;

  // ── detect name duplicates ──
  const normThisName=item.name.replace(/\n/g,' ').trim().toLowerCase();
  const dupKeys=Object.keys(data).filter(k=>k!==key &&
    data[k].name.replace(/\n/g,' ').trim().toLowerCase()===normThisName);
  const hasDup=dupKeys.length>0;

  document.getElementById('modalDrugInfo').innerHTML=`<strong>${escapeHtml(item.name.replace(/\n/g,' '))}</strong><br>الموقع: <span style="color:var(--accent);font-family:var(--mono)">${locText}</span>`
    +(hasDup?`<div class="dup-row" style="margin-top:5px">⚠️ <span style="color:var(--warn);font-size:11px">يوجد <strong>${dupKeys.length}</strong> دواء آخر بنفس الاسم</span></div>`:'');
  document.getElementById('modalDrugName').value = item.name;
  document.getElementById('typeHazard').checked   =item.types.includes('hazard');
  document.getElementById('typeLasa').checked     =item.types.includes('lasa');
  document.getElementById('typeHighAlert').checked=item.types.includes('high-alert');
  document.getElementById('flagOOS').checked      =item.oos;
  document.getElementById('flagShelf').checked    =item.shelf;
  document.getElementById('drugNotes').value      =item.notes||'';
  renderExpRows(item.expiries,'expListEdit');

  // dup type field
  const dupGroup=document.getElementById('dupTypeGroup');
  const dupSel=document.getElementById('dupTypeSelect');
  dupGroup.style.display=hasDup?'':'none';
  dupSel.value=item.dupType||'';

  // delete btn: only shelf-page entries (number > 50)
  document.getElementById('modalDeleteBtn').style.display = isShelfNum ? '' : 'none';
  // unassign btn: any drawer slot (not x_ and not shelf-num)
  document.getElementById('modalUnassignBtn').style.display = (!isExtra && !isShelfNum) ? '' : 'none';
  document.getElementById('expModal').classList.add('open');
}
function deleteShelfDrugEntry(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  if(!editingKey) return;
  if(!confirm('حذف هذا الدواء من الخانة؟')) return;
  const _delName=data[editingKey]?data[editingKey].name:'';
  if(window.PharmacyMedicationOperations) data=PharmacyMedicationOperations.remove(data,editingKey); else delete data[editingKey];
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('delete_drug',editingKey,_delName,{}); }
  saveData(); closeModal('expModal'); refreshAll(); showToast('🗑️ تم الحذف');
}
// unassign: move drawer slot drug to x_ key so it stays in DB without a location
function unassignDrugSlot(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  if(!editingKey) return;
  if(!confirm('سيُبقى الدواء في قاعدة البيانات لكن بدون موقع محدد. تأكيد؟')) return;
  const _unName=data[editingKey]?data[editingKey].name:'';
  const _oldKey=editingKey;
  const newKey='x_'+uid();
  if(window.PharmacyMedicationOperations) data=PharmacyMedicationOperations.unassign(data,editingKey,newKey);
  else { data[newKey]={...data[editingKey], drawerNum:null, drawerSlot:null, extra:true}; delete data[editingKey]; }
  editingKey=newKey;
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('unassign_drug',newKey,_unName,{from:_oldKey}); }
  saveData(); closeModal('expModal'); refreshAll();
  showToast('📤 تم إلغاء الموقع — الدواء لا يزال في قاعدة البيانات بدون تعيين');
}
function renderExpRows(expiries,containerId){
  const c=document.getElementById(containerId); c.innerHTML='';
  const list=expiries.length?expiries:[''];
  list.forEach((e,i)=>{
    const s=e?expStatus(e):'ok', dot=s==='ok'?'var(--success)':s==='warn'?'var(--warn)':'var(--danger)';
    const row=document.createElement('div'); row.className='exp-row';
    row.innerHTML=`<span class="exp-num">${i+1}</span>
      <input type="date" value="${e||''}" oninput="updateDot(this,'${containerId}',${i})">
      <div class="status-dot" style="background:${dot}" id="dot_${containerId}_${i}"></div>
      <button class="btn btn-danger btn-sm" onclick="removeExpRowFrom('${containerId}',${i})">×</button>`;
    c.appendChild(row);
  });
}
function updateDot(input,cid,idx){
  const s=input.value?expStatus(input.value):'ok';
  document.getElementById(`dot_${cid}_${idx}`).style.background=s==='ok'?'var(--success)':s==='warn'?'var(--warn)':'var(--danger)';
}
function removeExpRowFrom(cid,idx){
  const inputs=document.querySelectorAll(`#${cid} input[type=date]`);
  renderExpRows(Array.from(inputs).map(i=>i.value).filter((_,ii)=>ii!==idx),cid);
}
function addExpRow(){
  const rows=document.querySelectorAll('#expListEdit .exp-row');
  if(rows.length>=10)return;
  const i=rows.length; const row=document.createElement('div'); row.className='exp-row';
  row.innerHTML=`<span class="exp-num">${i+1}</span>
    <input type="date" value="" oninput="updateDot(this,'expListEdit',${i})">
    <div class="status-dot" style="background:var(--success)" id="dot_expListEdit_${i}"></div>
    <button class="btn btn-danger btn-sm" onclick="removeExpRowFrom('expListEdit',${i})">×</button>`;
  document.getElementById('expListEdit').appendChild(row);
}
function saveExpiries(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  const inputs=document.querySelectorAll('#expListEdit input[type=date]');
  const types=[];
  if(document.getElementById('typeHazard').checked)    types.push('hazard');
  if(document.getElementById('typeLasa').checked)      types.push('lasa');
  if(document.getElementById('typeHighAlert').checked) types.push('high-alert');
  const changes={expiries:normalizeExpiries(Array.from(inputs).map(i=>i.value)),types,oos:document.getElementById('flagOOS').checked,shelf:document.getElementById('flagShelf').checked,notes:cleanUserText(document.getElementById('drugNotes').value,1000),name:cleanUserText(document.getElementById('modalDrugName').value,500)||data[editingKey].name,dupType:document.getElementById('dupTypeSelect').value||undefined};
  const _oldRec=data[editingKey]?{...data[editingKey]}:null;
  if(window.PharmacyMedicationOperations) data=PharmacyMedicationOperations.update(data,editingKey,changes); else Object.assign(data[editingKey],changes);
  if(window.PharmacyAuditLog){ const diff=PharmacyAuditLog.diffDrug(_oldRec,data[editingKey]); if(Object.keys(diff).length) PharmacyAuditLog.log('edit_drug',editingKey,data[editingKey].name,{changes:diff}); }
  saveData(); closeModal('expModal'); refreshAll(); showToast('✅ تم الحفظ');
}

// ══ ALERTS ══
function renderAlerts(){
  const list=document.getElementById('alertList'); list.innerHTML='';
  const items=[];
  for(const key in data){ for(const e of data[key].expiries){ const d=daysUntil(e); if(d<=settings.warnDays) items.push({key,name:data[key].name,date:e,days:d}); } }
  for(const sh of shelves){ for(const ck in sh.cells||{}){ const c=sh.cells[ck]; (c.expiries||[]).forEach(e=>{ const d=daysUntil(e); if(d<=settings.warnDays) items.push({key:`📦 ${sh.name} ${ck}`,name:c.drug||ck,date:e,days:d}); }); } }
  items.sort((a,b)=>a.days-b.days);
  document.getElementById('alertCountBadge').textContent=items.length;
  if(!items.length){list.innerHTML='<div class="empty"><div class="icon">✅</div>لا توجد تنبيهات</div>';return;}
  items.forEach(item=>{
    const s=expStatus(item.date); const card=document.createElement('div');
    card.className=`alert-card ${s==='warn'?'warn-card':''}`;
    const cls=item.days<0?'expired':s==='critical'?'critical':'warn';
    card.innerHTML=`<div class="drug-name">${escapeHtml(item.name.replace(/\n/g,' '))}</div>
      <div class="drug-loc">${escapeHtml(item.key)}</div>
      <div style="font-size:10px;color:var(--text2)">📅 ${formatDate(item.date)}</div>
      <div class="days-left ${cls}">${daysLabel(item.days)}</div>`;
    list.appendChild(card);
  });
}

// ══ SEARCH ══
function doSearch(){
  const q=normalizeSearchText(document.getElementById('searchInput').value);
  const f=document.getElementById('searchFilter').value;
  const container=document.getElementById('searchResults');
  if(!q&&f==='all'){container.innerHTML='<div class="empty"><div class="icon">🔍</div>اكتب اسم الدواء للبحث</div>';return;}
  const results=[];
  for(const key in data){
    const item=data[key];
    const nm=!q||normalizeSearchText(item.name).includes(q)||normalizeSearchText(key).includes(q);
    let tm=true;
    if(f==='hazard') tm=item.types.includes('hazard');
    else if(f==='lasa') tm=item.types.includes('lasa');
    else if(f==='high-alert') tm=item.types.includes('high-alert');
    else if(f==='oos') tm=item.oos;
    else if(f==='shelf') tm=item.shelf;
    else if(f==='no-exp') tm=item.expiries.length===0;
    if(nm&&tm) results.push({key,item});
  }
  if(!results.length){container.innerHTML='<div class="empty"><div class="icon">😕</div>لا توجد نتائج</div>';return;}
  container.innerHTML='';
  results.forEach(({key,item})=>{
    const cleanName=escapeHtml(item.name.replace(/\n/g,' '));
    const hl=q?cleanName.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),m=>`<mark>${m}</mark>`):cleanName;
    const isExtra=key.startsWith('x_');
    const dr=isExtra?'':key.match(/\d+/)[0], sl=isExtra?'':key.match(/[A-F]/)[0];
    let badges='';
    if(item.types.includes('hazard'))     badges+=`<span class="type-badge hazard">⚠️ Hazard</span>`;
    if(item.types.includes('lasa'))       badges+=`<span class="type-badge lasa">🔵 LASA</span>`;
    if(item.types.includes('high-alert')) badges+=`<span class="type-badge high-alert">🔴 High Alert</span>`;
    if(item.shelf) badges+=`<span class="shelf-badge">📦 درج العلب</span>`;
    if(item.oos)   badges+=`<span class="oos-badge">🚫 OOS</span>`;
    badges+=dupBadgeHtml(item,key);
    const expsHtml=item.expiries.length
      ?item.expiries.map(e=>{const s=expStatus(e),d=daysUntil(e);return`<span class="exp-tag ${s==='critical'?'danger':s}">${formatDate(e)} (${daysLabel(d)})</span>`;}).join('')
      :'<span style="color:var(--text3);font-size:10px">لا يوجد تاريخ</span>';
    const div=document.createElement('div'); div.className='search-result';
    div.innerHTML=`
      <div class="loc-badge">درج ${dr}<br>${sl}</div>
      <div class="info">
        <div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:4px">${badges}</div>
        <div class="name">${hl}</div>
        <div class="exps">${expsHtml}</div>
        <div style="margin-top:6px"><button class="btn btn-secondary btn-sm" onclick="openExpModal('${key}')">✏️ تعديل</button></div>
      </div>`;
    container.appendChild(div);
  });
}

// ══ TABLE ══
function renderTable(){
  const q=document.getElementById('tableSearch').value.trim().toLowerCase();
  const tf=document.getElementById('tableTypeFilter').value;
  const tbody=document.getElementById('tableBody'); tbody.innerHTML='';
  for(const key in data){
    const item=data[key];
    if(key.startsWith('x_')) continue; // extras without a fixed drawer slot yet — skip in this table
    if(q&&!item.name.toLowerCase().includes(q)&&!key.toLowerCase().includes(q)) continue;
    let tm=true;
    if(tf==='hazard') tm=item.types.includes('hazard');
    else if(tf==='lasa') tm=item.types.includes('lasa');
    else if(tf==='high-alert') tm=item.types.includes('high-alert');
    else if(tf==='oos') tm=item.oos;
    else if(tf==='shelf') tm=item.shelf;
    if(!tm) continue;
    const drMatch=key.match(/\d+/), slMatch=key.match(/[A-F]/);
    if(!drMatch||!slMatch) continue; // safety: skip malformed keys instead of crashing
    if(parseInt(drMatch[0],10)>50) continue; // this list is drawers 1-50 only; 51+ lives on the shelf page
    const dr=drMatch[0], sl=slMatch[0];
    const exHtml=item.expiries.length?item.expiries.map(e=>{const s=expStatus(e);return`<span class="exp-tag ${s==='critical'?'danger':s}">${formatDate(e)}</span>`;}).join(' '):'<span style="color:var(--text3)">—</span>';
    let tHtml='';
    if(item.types.includes('hazard'))     tHtml+=`<span class="type-badge hazard">⚠️</span>`;
    if(item.types.includes('lasa'))       tHtml+=`<span class="type-badge lasa">🔵</span>`;
    if(item.types.includes('high-alert')) tHtml+=`<span class="type-badge high-alert">🔴</span>`;
    if(item.oos)   tHtml+=`<span class="oos-badge">OOS</span>`;
    if(item.shelf) tHtml+=`<span class="shelf-badge">📦</span>`;
    tHtml+=dupBadgeHtml(item,key);
    const st=!item.expiries.length?'⬜':slotExpSt(key)==='danger'?'🔴':slotExpSt(key)==='warn'?'🟡':'🟢';
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><span style="font-family:var(--mono);color:var(--accent);font-size:11px">درج ${dr} — ${sl}</span></td>
      <td style="max-width:220px;font-size:12px;font-weight:600;line-height:1.4">${escapeHtml(item.name).replace(/\n/g,'<br>')}</td>
      <td>${tHtml||'—'}</td>
      <td>${exHtml} <button class="btn btn-secondary btn-sm" onclick="openExpModal('${key}')">✏️</button></td>
      <td>${st}</td>
      <td style="font-size:10px;color:var(--text2);max-width:140px">${escapeHtml(item.notes||'—')}</td>`;
    tbody.appendChild(tr);
  }
}

// ══ OOS ══
function renderOOS(){
  const list=document.getElementById('oosList'); list.innerHTML='';
  const items=[];
  for(const key in data){ if(data[key].oos) items.push({key,name:data[key].name,note:data[key].notes,fromData:true}); }
  for(const m of oosManual) items.push({key:'—',name:m.name,note:m.note,id:m.id,fromData:false});
  document.getElementById('oosCountBadge').textContent=items.length;
  document.getElementById('oosCount').textContent=items.length;
  if(!items.length){list.innerHTML='<div class="empty"><div class="icon">✅</div>لا يوجد أدوية OOS</div>';return;}
  items.forEach(item=>{
    const div=document.createElement('div'); div.className='oos-item';
    const btn=item.fromData
      ?`<button class="btn btn-secondary btn-sm" onclick="openExpModal('${item.key}')">✏️</button>`
      :`<button class="btn btn-danger btn-sm" onclick="removeManualOOS('${item.id}')">🗑️</button>`;
    div.innerHTML=`<div class="loc">${escapeHtml(item.key)}</div>
      <div class="info"><div class="name">${escapeHtml(item.name.replace(/\n/g,' '))}</div>${item.note?`<div class="note">${escapeHtml(item.note)}</div>`:''}</div>
      ${btn}`;
    list.appendChild(div);
  });
}
function openAddOOSModal(){document.getElementById('oosManualName').value='';document.getElementById('oosManualNote').value='';document.getElementById('addOOSModal').classList.add('open');}
function saveManualOOS(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  const name=cleanUserText(document.getElementById('oosManualName').value,500);
  if(!name)return showToast('⚠️ أدخل اسم الدواء');
  const note=cleanUserText(document.getElementById('oosManualNote').value,1000);
  oosManual.push({id:uid(),name,note});
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('add_oos',null,name,{note}); }
  saveData();closeModal('addOOSModal');renderOOS();updateStats();showToast('✅ تمت الإضافة');
}
function removeManualOOS(id){if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');const _oos=oosManual.find(m=>m.id===id);oosManual=oosManual.filter(m=>m.id!==id);if(window.PharmacyAuditLog&&_oos){ PharmacyAuditLog.log('remove_oos',null,_oos.name,{}); }saveData();renderOOS();updateStats();}

// ══ SHELF ══
function getNewShelfSize(){
  return {
    cols:parseInt(document.getElementById('shelfCols').value)||5,
    rows:parseInt(document.getElementById('shelfRows').value)||4
  };
}

function shelfHasSearchMatch(shelf,q){
  if(window.PharmacyShelfSearch){
    const norm=v=>normalizeSearchText(v);
    const normalizedData=Object.keys(data).reduce((out,key)=>{const item=data[key];out[key]=item&&typeof item.name==='string'?{...item,name:norm(item.name)}:item;return out;},{});
    return PharmacyShelfSearch.matches({...shelf,name:norm(shelf.name)},normalizedData,norm(q),rowLabel);
  }
  if(!q||normalizeSearchText(shelf.name).includes(q)) return true;
  const cols=shelf.cols||5,rows=shelf.rows||4,startNum=shelf.startNum||1;
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
    const key=`${startNum+c}${rowLabel(r)}`,displayKey=`${rowLabel(r)}${startNum+c}`,item=data[key];
    if(item&&(normalizeSearchText(item.name).includes(q)||normalizeSearchText(key).includes(q)||normalizeSearchText(displayKey).includes(q))) return true;
  }
  return false;
}

function renderShelves(){
  const q=normalizeSearchText(document.getElementById('shelfSearch').value||'');
  const wrap=document.getElementById('shelfWrap'); wrap.innerHTML='';
  const shelfModule=window.PharmacyShelfModule&&PharmacyShelfModule.create({normalize:normalizeSearchText,rowLabel});
  const filtered=shelfModule?shelfModule.visibleShelves(shelves,data,q):shelves.filter(s=>shelfHasSearchMatch(s,q));
  if(!filtered.length){wrap.innerHTML='<div class="empty"><div class="icon">🔎</div>لا يوجد رف أو دواء مطابق للبحث</div>';updateStats();return;}

  filtered.forEach(shelf=>{
    const cols=shelf.cols||5, rows=shelf.rows||4;
    const startNum=shelf.startNum||1;
    const total=cols*rows;
    let filled=0;
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){ if(data[`${startNum+c}${rowLabel(r)}`]) filled++; }

    const section=document.createElement('div'); section.className='shelf-section'; section.dataset.shelfId=shelf.id;

    // header
    const hdr=document.createElement('div'); hdr.className='shelf-header';
    const photoSrc=safeImageSrc(shelf.photo);
    const photoHtml=photoSrc?`<img src="${photoSrc}" onclick="event.stopPropagation();openShelfPhotoPreview('${escapeHtml(shelf.id)}')" style="width:34px;height:34px;object-fit:cover;border-radius:6px;cursor:pointer;border:1px solid var(--border)">`:'';
    hdr.innerHTML=`${photoHtml}<div class="shelf-title">📦 ${escapeHtml(shelf.name)} <span style="color:var(--accent2);font-family:var(--mono);font-size:11px">(${startNum}-${startNum+cols-1})</span></div>
      <div class="shelf-meta">${cols} عامود × ${rows} صف | ${filled}/${total} مملوء</div>
      <div style="display:flex;gap:5px" class="no-print">
        <button class="btn btn-secondary btn-sm" onclick="printShelf('${shelf.id}')">🖨️ طباعة</button>
        <button class="btn btn-secondary btn-sm" onclick="openEditShelfModal('${shelf.id}')">✏️ تعديل الرف</button>
      </div>`;
    section.appendChild(hdr);

    // grid wrap
    const gwrap=document.createElement('div'); gwrap.className='shelf-grid-wrap';

    // Build grid: (rows+1) rows × (cols+1) cols  (first row = col headers, first col per row = row header)
    const grid=document.createElement('div'); grid.className='shelf-grid';
    // grid-template-columns: header + cols
    grid.style.gridTemplateColumns=`28px repeat(${cols},1fr)`;
    grid.style.gridTemplateRows=`auto repeat(${rows},1fr)`;

    // top-left empty corner
    const corner=document.createElement('div');
    corner.style.cssText='display:flex;align-items:center;justify-content:center';
    grid.appendChild(corner);

    // column headers: continuing numbers (51, 52, 53 ...)
    for(let c=0;c<cols;c++){
      const h=document.createElement('div'); h.className='shelf-col-header';
      h.textContent=startNum+c; grid.appendChild(h);
    }

    // rows
    for(let r=0;r<rows;r++){
      // row header: A, B, C ...
      const rh=document.createElement('div'); rh.className='shelf-row-header';
      rh.textContent=rowLabel(r); grid.appendChild(rh);

      // cells — read straight from the main `data` object, keyed exactly like
      // drawers (e.g. "51A"), so anything in the database with a matching
      // number+slot shows up here automatically and stays in sync everywhere.
      for(let c=0;c<cols;c++){
        const num=startNum+c;
        const key=`${num}${rowLabel(r)}`; // real database key, e.g. "51A"
        const dispLabel=`${rowLabel(r)}${num}`; // e.g. A51 — shown to the user
        const item=data[key];
        const div=document.createElement('div');
        const cellMatches=shelfModule?shelfModule.cellMatches(shelf,data,r,c,q):(!q||normalizeSearchText(shelf.name).includes(q)||(item&&(normalizeSearchText(item.name).includes(q)||normalizeSearchText(key).includes(q)||normalizeSearchText(dispLabel).includes(q))));
        let cellCls='shelf-cell';
        if(item){
          const cSt=slotExpSt(key);
          const expCls=!item.expiries.length?'noexp':cSt==='danger'?'danger':cSt==='warn'?'warn':'ok';
          cellCls+=` filled ${expCls}`;
          if(item.types.includes('high-alert'))     cellCls+=' type-high-alert';
          else if(item.types.includes('lasa'))      cellCls+=' type-lasa';
          else if(item.types.includes('hazard'))    cellCls+=' type-hazard';
          if(item.oos) cellCls+=' cell-oos';
        }
        div.className=cellCls;
        if(q&&!cellMatches) div.style.opacity='.16';
        if(q&&cellMatches) div.style.outline='2px solid var(--accent)';

        if(item){
          let bestExp='', bestSt='ok';
          if(item.expiries.length){
            const sorted=[...item.expiries].sort();
            bestExp=sorted[0]; bestSt=expStatus(bestExp);
            if(bestSt==='critical') bestSt='danger';
          }
          div.innerHTML=`<span class="cell-label">${dispLabel}</span>
            <div class="cell-drug">${escapeHtml(item.name.replace(/\n/g,' '))}</div>
            ${bestExp?`<div class="cell-exp ${bestSt}">${formatDate(bestExp)}</div>`:'<div class="cell-exp noexp">— بدون تاريخ</div>'}
            ${item.oos?'<span class="oos-badge" style="position:absolute;top:2px;right:3px;font-size:7px">OOS</span>':''}
            ${dupBadgeHtml(item,key)?'<span style="position:absolute;bottom:2px;left:2px;font-size:7px;background:#7c3aed22;color:#7c3aed;border-radius:6px;padding:0 3px;font-weight:700">🔁</span>':''}
            <div class="cell-actions" style="position:absolute;bottom:2px;right:2px;display:none;gap:2px;z-index:5">
              <button style="font-size:8px;padding:1px 4px;background:var(--surface);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--text1)" onclick="event.stopPropagation();openExpModal('${key}')" title="تعديل البيانات">✏️</button>
              <button style="font-size:8px;padding:1px 4px;background:var(--surface);border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--accent)" onclick="event.stopPropagation();createShelfDrug('${key}')" title="تغيير الدواء">🔄</button>
            </div>`;
          div.onmouseenter=()=>{ const a=div.querySelector('.cell-actions'); if(a) a.style.display='flex'; };
          div.onmouseleave=()=>{ const a=div.querySelector('.cell-actions'); if(a) a.style.display='none'; };
          div.onclick=()=>openExpModal(key);
        } else {
          div.innerHTML=`<span class="cell-label" style="position:static;color:var(--text3);font-size:9px">${dispLabel}</span><div class="cell-add">+</div>`;
          div.onclick=()=>createShelfDrug(key);
        }
        grid.appendChild(div);
      }
    }
    gwrap.appendChild(grid);
    section.appendChild(gwrap);
    wrap.appendChild(section);
  });
  updateStats();
}

// Clicking an empty shelf cell searches the database for an existing,
// not-yet-placed drug and links it here — manual/free-text creation of new
// drugs only happens from the "قاعدة البيانات" tab (openAddDrugModal).
let pickExtraTargetKey=null;
// Print just one shelf, filling an A4 page with no empty margins.
function printShelf(shelfId){
  document.querySelectorAll('.shelf-section').forEach(s=>{
    s.classList.toggle('print-target', s.dataset.shelfId===shelfId);
  });
  document.body.classList.add('printing-shelf');
  window.print();
}
window.addEventListener('afterprint', ()=>{
  document.body.classList.remove('printing-shelf');
  document.querySelectorAll('.shelf-section').forEach(s=>s.classList.remove('print-target'));
});
function createShelfDrug(key){
  pickExtraTargetKey=key;
  const num=key.match(/\d+/)[0], sl=key.match(/[A-F]/)[0];
  document.getElementById('pickExtraTargetInfo').innerHTML=
    `الخانة: <span style="color:var(--accent);font-family:var(--mono)">${num}${sl}</span>`;
  document.getElementById('pickExtraSearch').value='';
  // reset scope to 'all'
  const allRadio=document.querySelector('input[name="pickExtraScope"][value="all"]');
  if(allRadio) allRadio.checked=true;
  renderPickExtraResults();
  document.getElementById('pickExtraModal').classList.add('open');
}
function renderPickExtraResults(){
  const q=(document.getElementById('pickExtraSearch').value||'').trim().toLowerCase();
  const scope=(document.querySelector('input[name="pickExtraScope"]:checked')||{}).value||'all';
  const box=document.getElementById('pickExtraResults'); box.innerHTML='';
  const entries=Object.entries(data)
    .filter(([k,v])=>{
      if(k===pickExtraTargetKey) return false; // skip the target cell itself
      if(scope==='unassigned') return k.startsWith('x_');
      return true; // 'all' — every drug in the DB
    })
    .filter(([k,v])=>!q||v.name.toLowerCase().includes(q)||k.toLowerCase().includes(q))
    .slice(0,50);
  if(!entries.length){
    box.innerHTML=`<div class="empty" style="padding:14px"><div class="icon">🔎</div>${q?'لا توجد نتائج':'اكتب اسم الدواء للبحث'}</div>`;
    return;
  }
  entries.forEach(([k,v])=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);cursor:pointer';
    const isX=k.startsWith('x_');
    const loc=isX?'<span style="font-size:9px;color:var(--text3)">بدون موقع</span>'
      :`<span style="font-size:9px;font-family:var(--mono);color:var(--accent2)">${k}</span>`;
    row.innerHTML=`<div style="flex:1;font-size:12px">${escapeHtml(v.name.replace(/\n/g,' '))}</div>${loc}`;
    row.onclick=()=>selectExtraForShelf(k);
    box.appendChild(row);
  });
}
function selectExtraForShelf(srcKey){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  if(!pickExtraTargetKey) return;
  const targetOccupied=!!data[pickExtraTargetKey];
  if(targetOccupied){
    const occupant=data[pickExtraTargetKey].name.replace(/\n/g,' ');
    const choice=confirm(
      `الخانة ${pickExtraTargetKey} مشغولة بـ:\n"${occupant}"\n\n` +
      `موافق = تبديل (الدواء المختار يأخذ المكان، القديم يصبح بدون تعيين)\n` +
      `إلغاء = إلغاء العملية`
    );
    if(!choice) return;
    // move old drug to x_
    const oldKey='x_'+uid();
    if(window.PharmacyMedicationOperations) data=PharmacyMedicationOperations.unassign(data,pickExtraTargetKey,oldKey);
    else { data[oldKey]={...data[pickExtraTargetKey], shelf:false, extra:true, drawerNum:null, drawerSlot:null}; delete data[pickExtraTargetKey]; }
  }
  // place selected drug in target
  data[pickExtraTargetKey]={...data[srcKey], shelf:true, extra:false};
  delete data[srcKey];
  closeModal('pickExtraModal');
  refreshAll();
  sbDirty=true;persistPendingWrite();setSbStatus('syncing');clearTimeout(sbSaveTimer);
  sbSaveNow().then(()=>showToast('✅ تم ربط الدواء وحفظه بشكل مؤكد')).catch(()=>showToast('⚠️ لم يتأكد الحفظ — احتفظنا بنسخة محلية للاسترداد'));
}

function openAddShelfModal(){
  document.getElementById('newShelfName').value='';
  const {cols,rows}=getNewShelfSize();
  document.getElementById('newShelfCols').value=cols;
  document.getElementById('newShelfRows').value=rows;
  const photoInput=document.getElementById('newShelfPhoto'); if(photoInput) photoInput.value='';
  const next=getNextShelfStartNum();
  document.getElementById('addShelfModal').querySelector('h2').textContent=`📦 إضافة درج علب جديد (سيبدأ من ${next})`;
  document.getElementById('addShelfModal').classList.add('open');
}
function getNextShelfStartNum(){
  let maxEnd=50;
  shelves.forEach(s=>{
    const start=s.startNum||1;
    const cols=s.cols||5;
    maxEnd=Math.max(maxEnd, start+cols-1);
  });
  return maxEnd+1;
}
async function saveNewShelf(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  const name=cleanUserText(document.getElementById('newShelfName').value,200);
  if(!name)return showToast('⚠️ أدخل اسم الرف');
  const cols=Math.min(50,Math.max(1,parseInt(document.getElementById('newShelfCols').value)||5));
  const rows=Math.min(26,Math.max(1,parseInt(document.getElementById('newShelfRows').value)||4));
  const startNum=getNextShelfStartNum();
  const photoInput=document.getElementById('newShelfPhoto');
  const file=photoInput&&photoInput.files&&photoInput.files[0];
  const finish=async(photoPath)=>{
    const shelf={id:uid(),name,cols,rows,startNum,cells:{},photo:null,photoPath:photoPath||null};
    shelves=window.PharmacyShelfOperations?PharmacyShelfOperations.create().add(shelves,shelf):shelves.concat([shelf]);
    if(window.PharmacyAuditLog){ PharmacyAuditLog.log('add_shelf',null,name,{cols,rows,startNum}); }
    saveData();closeModal('addShelfModal');renderShelves();showToast(`✅ تمت إضافة درج العلب (${startNum}-${startNum+cols-1})`);
  };
  if(file){ try{ const id=uid(); const path=await uploadShelfPhoto(file,id); const shelf={id,name,cols,rows,startNum,cells:{},photo:null,photoPath:path}; shelves=window.PharmacyShelfOperations?PharmacyShelfOperations.create().add(shelves,shelf):shelves.concat([shelf]); if(window.PharmacyAuditLog){ PharmacyAuditLog.log('add_shelf',null,name,{cols,rows,startNum}); } saveData();closeModal('addShelfModal');renderShelves();showToast(`✅ تمت إضافة درج العلب (${startNum}-${startNum+cols-1})`); }catch(e){showToast('⚠️ '+e.message);} }
  else finish(null);
}

async function uploadShelfPhoto(file,shelfId){
  if(!window.PharmacyShelfStorage) throw new Error('وحدة تخزين صور الأرفف غير متاحة');
  if(!window._pharmacyShelfStorage) window._pharmacyShelfStorage=PharmacyShelfStorage.create({url:SB_URL,key:SB_KEY,token:()=>sbSession?.accessToken,userId:()=>sbUser?.id||''});
  return window._pharmacyShelfStorage.upload(file,shelfId);
}
async function shelfPhotoUrl(path){
  if(!window._pharmacyShelfStorage) window._pharmacyShelfStorage=PharmacyShelfStorage.create({url:SB_URL,key:SB_KEY,token:()=>sbSession?.accessToken,userId:()=>sbUser?.id||''});
  return window._pharmacyShelfStorage.signedUrl(path);
}
async function deleteShelfPhoto(path){
  if(!window._pharmacyShelfStorage) window._pharmacyShelfStorage=PharmacyShelfStorage.create({url:SB_URL,key:SB_KEY,token:()=>sbSession?.accessToken,userId:()=>sbUser?.id||''});
  return window._pharmacyShelfStorage.remove(path);
}
async function hydrateShelfPhotoUrls(){
  if(!sbSession?.accessToken)return;
  await Promise.all(shelves.map(async sh=>{ if(sh.photoPath){ const url=await shelfPhotoUrl(sh.photoPath); if(url)sh.photo=url; } }));
  if(!window._shelfPhotoRefreshTimer) window._shelfPhotoRefreshTimer=setInterval(()=>hydrateShelfPhotoUrls().then(renderShelves).catch(()=>{}),50*60*1000);
}

function openEditShelfModal(id){
  editingShelfId=id;
  const sh=shelves.find(s=>s.id===id);
  document.getElementById('editShelfName').value=sh.name;
  document.getElementById('editShelfCols').value=sh.cols;
  document.getElementById('editShelfRows').value=sh.rows;
  document.getElementById('editShelfStartNum').value=sh.startNum||1;
  document.getElementById('editShelfPhoto').value='';
  const currentPhoto=safeImageSrc(sh.photo);
  document.getElementById('editShelfPhotoCurrent').innerHTML=currentPhoto
    ?`<img src="${currentPhoto}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:1px solid var(--border)"> <button class="btn btn-secondary btn-sm" onclick="removeShelfPhoto()">🗑️ إزالة الصورة</button>`
    :'<span style="font-size:11px;color:var(--text3)">لا توجد صورة</span>';
  document.getElementById('editShelfModal').classList.add('open');
}
function removeShelfPhoto(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  const sh=shelves.find(s=>s.id===editingShelfId);
  if(sh){ sh.photo=null; sh.photoPath=null; }
  document.getElementById('editShelfPhotoCurrent').innerHTML='<span style="font-size:11px;color:var(--text3)">لا توجد صورة</span>';
}
async function saveEditShelf(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  const sh=shelves.find(s=>s.id===editingShelfId);
  if(!sh)return;
  const changes={name:cleanUserText(document.getElementById('editShelfName').value,200)||sh.name,cols:Math.min(50,Math.max(1,parseInt(document.getElementById('editShelfCols').value)||sh.cols)),rows:Math.min(26,Math.max(1,parseInt(document.getElementById('editShelfRows').value)||sh.rows)),startNum:Math.min(999,Math.max(1,parseInt(document.getElementById('editShelfStartNum').value)||sh.startNum||1))};
  if(window.PharmacyShelfOperations){ shelves=PharmacyShelfOperations.create().update(shelves,editingShelfId,changes); }
  else Object.assign(sh,changes);
  const current=shelves.find(s=>s.id===editingShelfId);
  const photoInput=document.getElementById('editShelfPhoto');
  const file=photoInput&&photoInput.files&&photoInput.files[0];
  const finish=()=>{ if(window.PharmacyAuditLog){ PharmacyAuditLog.log('edit_shelf',null,changes.name,{shelfId:editingShelfId,changes}); } saveData();closeModal('editShelfModal');renderShelves();showToast('✅ تم تعديل درج العلب'); };
  if(file){ try{ const oldPath=current.photoPath; const newPath=await uploadShelfPhoto(file,current.id); if(window.PharmacyShelfOperations)shelves=PharmacyShelfOperations.create().update(shelves,editingShelfId,{photoPath:newPath,photo:null});else{current.photoPath=newPath;current.photo=null;} if(oldPath) await deleteShelfPhoto(oldPath); finish(); }catch(e){showToast('⚠️ '+e.message);} }
  else finish();
}
function openShelfPhotoPreview(id){
  const sh=shelves.find(s=>s.id===id),src=sh&&safeImageSrc(sh.photo); if(!src)return;
  document.getElementById('shelfPhotoPreviewImg').src=src;
  document.getElementById('shelfPhotoModal').classList.add('open');
}
async function deleteShelf(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  if(!confirm('حذف تعريف الرف؟ ستبقى سجلات الأدوية وتواريخها محفوظة في قاعدة البيانات.'))return;
  const sh=shelves.find(s=>s.id===editingShelfId);
  const _shelfName=sh?sh.name:'';
  shelves=window.PharmacyShelfOperations?PharmacyShelfOperations.create().remove(shelves,editingShelfId):shelves.filter(s=>s.id!==editingShelfId);
  if(sh?.photoPath) await deleteShelfPhoto(sh.photoPath);
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('delete_shelf',null,_shelfName,{shelfId:editingShelfId}); }
  saveData();closeModal('editShelfModal');renderShelves();showToast('🗑️ تم الحذف');
}

// ══ CELL MODAL ══
function addCellExpRow(){
  const rows=document.querySelectorAll('#cellExpList .exp-row');
  if(rows.length>=10)return;
  const i=rows.length; const row=document.createElement('div'); row.className='exp-row';
  row.innerHTML=`<span class="exp-num">${i+1}</span>
    <input type="date" value="" oninput="updateDot(this,'cellExpList',${i})">
    <div class="status-dot" style="background:var(--success)" id="dot_cellExpList_${i}"></div>
    <button class="btn btn-danger btn-sm" onclick="removeExpRowFrom('cellExpList',${i})">×</button>`;
  document.getElementById('cellExpList').appendChild(row);
}
function saveCell(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  const sh=shelves.find(s=>s.id===editingShelfId); if(!sh)return;
  if(!sh.cells) sh.cells={};
  const name=document.getElementById('cellDrugName').value.trim();
  const inputs=document.querySelectorAll('#cellExpList input[type=date]');
  const types=[];
  if(document.getElementById('cellHazard').checked)    types.push('hazard');
  if(document.getElementById('cellLasa').checked)      types.push('lasa');
  if(document.getElementById('cellHighAlert').checked) types.push('high-alert');
  if(!name){ delete sh.cells[editingCellKey]; }
  else {
    sh.cells[editingCellKey]={
      drug:name, types, notes:document.getElementById('cellNotes').value,
      expiries:normalizeExpiries(Array.from(inputs).map(i=>i.value))
    };
    // keep data[] in sync so DB tab and stats reflect the change
    if(data[editingCellKey]){
      data[editingCellKey].name=name;
      data[editingCellKey].types=types;
      data[editingCellKey].notes=document.getElementById('cellNotes').value;
      data[editingCellKey].expiries=normalizeExpiries(Array.from(inputs).map(i=>i.value));
      data[editingCellKey].shelf=true;
    }
  }
  closeModal('cellModal'); refreshAll();
  if(window.PharmacyAuditLog){ const sh=shelves.find(s=>s.id===editingShelfId); PharmacyAuditLog.log('edit_shelf_cell',editingCellKey,name,{shelfName:sh?sh.name:'',types}); }
  sbDirty=true;persistPendingWrite();setSbStatus('syncing');clearTimeout(sbSaveTimer);
  sbSaveNow().then(()=>showToast('✅ تم الحفظ المؤكد في Supabase')).catch(()=>showToast('⚠️ لم يتأكد الحفظ — احتفظنا بنسخة محلية للاسترداد'));
}
function clearCell(){
  if(!isWriteAuthFresh()) return showToast('⛔ الحساب للقراءة فقط');
  const sh=shelves.find(s=>s.id===editingShelfId);
  const _cellDrug=sh&&sh.cells&&sh.cells[editingCellKey]?sh.cells[editingCellKey].drug:'';
  if(sh&&sh.cells) delete sh.cells[editingCellKey];
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('clear_shelf_cell',editingCellKey,_cellDrug,{shelfName:sh?sh.name:''}); }
  saveData();closeModal('cellModal');renderShelves();showToast('🗑️ تم مسح الخلية');
}

// ══ MODALS ══
function closeModal(id){document.getElementById(id).classList.remove('open')}
document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open')}));

// ══ TOAST ══
function showToast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

// ══ EXPORT/IMPORT ══
function exportData(){
  const blob=new Blob([JSON.stringify({data,shelves,oosManual,settings,theme},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='pharmacy_v3.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),0);
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('export_data',null,null,{format:'json',drugCount:Object.keys(data).length}); }
}

function exportCSV(){
  // Columns: Location, Name, Type, OOS, Hazard, LASA, High Alert, Shelf, Expiry Dates, Notes
  const rows=[['الموقع','الاسم','نوع','OOS','Hazard','LASA','High Alert','درج علب','تواريخ الانتهاء','ملاحظات']];
  // Sort keys: drawers 1-50 first, then shelf 51+, then extras
  const sorted=Object.keys(data).sort((a,b)=>{
    const na=parseInt(a.match(/\d+/)||[999]),nb=parseInt(b.match(/\d+/)||[999]);
    return na!==nb?na-nb:a.localeCompare(b);
  });
  sorted.forEach(key=>{
    const item=data[key];
    rows.push([
      key,
      item.name.replace(/\n/g,' '),
      (item.types||[]).join('+'),
      item.oos?'نعم':'',
      (item.types||[]).includes('hazard')?'نعم':'',
      (item.types||[]).includes('lasa')?'نعم':'',
      (item.types||[]).includes('high-alert')?'نعم':'',
      item.shelf?'نعم':'',
      (item.expiries||[]).join(' | '),
      item.notes||''
    ]);
  });
  const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  // UTF-8 BOM so Excel/Sheets reads Arabic correctly
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='pharmacy_data.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),0);
  if(window.PharmacyAuditLog){ PharmacyAuditLog.log('export_data',null,null,{format:'csv',drugCount:Object.keys(data).length}); }
  showToast('📊 تم التصدير — افتح الملف في Google Sheets أو Excel');
}

// ══ REFRESH ══
function refreshAll(){
  renderDrawers();renderAlerts();renderTable();renderShelves();renderOOS();
  if(document.getElementById('tab-db').classList.contains('active'))renderDB();
}

// ══════════════════════════════════════
//  SUPABASE CONFIG
// ══════════════════════════════════════
const SB_TABLE= 'pharmacy_state';
let SB_URL  = 'https://ivavwzqdqausirioqwts.supabase.co';
let SB_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YXZ3enFkcWF1c2lyaW9xd3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NjQyMTYsImV4cCI6MjA5NjQ0MDIxNn0.iVdXLQL3eIcF60_Dtye-BKWd_ZnIYUJNyvSpmuRwxo0';

let sbSaveTimer = null;
let sbConnected  = false;
let sbHydrating = false;
let sbSaveRequested = false;
let sbSaveLoopPromise = null;
let sbSaveCoordinator = null;
let sbStateRevision = 0;
let sbStateHasRevision = false;
let sbDirty = false;
let sbConflict = null;
const SB_PENDING_KEY = 'pharmacy_pending_write_v1';
const SB_CLIENT_ID = (()=>{
  let id=sessionStorage.getItem('pharmacy_client_id');
  if(!id){ id=(crypto.randomUUID?crypto.randomUUID():uid()); if(window.PharmacyStoragePolicy) PharmacyStoragePolicy.write(sessionStorage,'pharmacy_client_id',id); }
  return id;
})();
const SB_SESSION_KEY='pharmacy_auth_session_v1';
const SB_PASSWORD_SETUP_KEY='pharmacy_password_setup_session_v1';
const sbSessionStore=window.PharmacyAuthSession?window.PharmacyAuthSession.createStore(sessionStorage,SB_SESSION_KEY):null;
let sbSession=null;
let sbUser=null;
let sbUserRole='';
let lastActivityAt=Date.now();
let sbSessionTimeout=null;
function startAuthTimeout(){
  if(window.PharmacySessionTimeout){
    if(!sbSessionTimeout) sbSessionTimeout=PharmacySessionTimeout.create({minutes:()=>settings.authMinutes,isAuthenticated:()=>!!sbUser,onTimeout:sbSignOut});
    sbSessionTimeout.start(); return;
  }
  ['pointerdown','keydown','input','click'].forEach(type=>document.addEventListener(type,()=>{lastActivityAt=Date.now();},{passive:true}));
  setInterval(()=>{
    const minutes=Math.max(5,Number(settings.authMinutes)||15);
    if(sbUser&&Date.now()-lastActivityAt>minutes*60000) sbSignOut();
  },60000);
}
function appStatePayload(){
  const repo=window.PharmacyStateRepository;
  return repo?repo.createPayload({data,shelves,oosManual,settings,theme}):{data,shelves,oosManual,settings,theme};
}

function validateStatePayload(payload){
  const shapeOk=!!payload&&typeof payload==='object'&&!Array.isArray(payload)&&
    payload.data&&typeof payload.data==='object'&&!Array.isArray(payload.data)&&
    Array.isArray(payload.shelves||[])&&Array.isArray(payload.oosManual||[]);
  if(!shapeOk) return false;
  const dataOk=Object.entries(payload.data).every(([key,item])=>
    isValidDataKey(key)&&item&&typeof item.name==='string'&&item.name.length<=500&&
    Array.isArray(item.expiries||[])&&(item.expiries||[]).every(isValidIsoDate)&&
    Array.isArray(item.types||[])&&(item.types||[]).every(t=>['hazard','lasa','high-alert'].includes(t))&&
    (item.notes===undefined||(typeof item.notes==='string'&&item.notes.length<=1000))&&
    (item.oos===undefined||typeof item.oos==='boolean')&&(item.shelf===undefined||typeof item.shelf==='boolean')
  );
  const shelvesOk=(payload.shelves||[]).every(s=>s&&/^[a-z0-9_-]{3,64}$/i.test(s.id)&&
    typeof s.name==='string'&&s.name.length>0&&s.name.length<=200&&(!s.photo||!!safeImageSrc(s.photo))&&(!s.photoPath||/^[a-f0-9-]{36}\/[a-z0-9_-]{3,64}-\d+\.(?:jpg|png|webp|gif)$/i.test(s.photoPath))&&
    Number.isInteger(Number(s.cols))&&Number(s.cols)>0&&Number(s.cols)<=50&&
    Number.isInteger(Number(s.rows))&&Number(s.rows)>0&&Number(s.rows)<=26);
  const oosOk=(payload.oosManual||[]).every(item=>item&&/^[a-z0-9_-]{3,64}$/i.test(item.id)&&
    typeof item.name==='string'&&item.name.length>0&&item.name.length<=500&&
    (item.note===undefined||(typeof item.note==='string'&&item.note.length<=1000)));
  return dataOk&&shelvesOk&&oosOk;
}

function applyStatePayload(payload){
  if(!validateStatePayload(payload)) throw new Error('صيغة بيانات غير صالحة');
  data=structuredClone(payload.data||{});
  shelves=structuredClone(payload.shelves||[]);
  oosManual=structuredClone(payload.oosManual||[]);
  settings=sanitizeSettings(payload.settings);
  theme=payload.theme||'dark';
}

function payloadFingerprint(payload=appStatePayload()){
  const value={
    data:payload.data||{}, shelves:payload.shelves||[], oosManual:payload.oosManual||[],
    settings:payload.settings||{}, theme:payload.theme||'dark'
  };
  if(window.PharmacyStateRepository) return window.PharmacyStateRepository.fingerprint(value);
  const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.keys(v).sort().reduce((o,k)=>(o[k]=canonical(v[k]),o),{}):v;
  return JSON.stringify(canonical(value));
}


// Override saveData: Supabase ONLY — localStorage is never used for app data
function saveData(){
  invalidateDoseCountMap();
  if(sbHydrating) return;
  if(!['writer','admin'].includes(sbUserRole)){
    showToast('⛔ الحساب للقراءة فقط — لم يُحفظ التعديل');
    sbLoad({ignorePending:true}).then(refreshAll).catch(()=>{});
    return;
  }
  sbDirty=true; persistPendingWrite();
  if(!SB_URL||!SB_KEY||sbConflict){ setSbStatus(sbConflict?'conflict':'offline'); return; }
  setSbStatus('syncing');
  clearTimeout(sbSaveTimer);
  sbSaveTimer=setTimeout(()=>{sbSaveNow().catch(e=>console.warn(e.message));},300);
}

window.addEventListener('pagehide',()=>{
  if(sbDirty) persistPendingWrite();
});

// ══════════════════════════════════════
//  VOICE RECOGNITION  🎙️
// ══════════════════════════════════════
let voiceUnlocked = false;
let voiceRecognition = null;
let voiceState = 'idle';
// Session log persisted in localStorage across recordings
let voiceSessionLog = (() => {
  try { return JSON.parse(localStorage.getItem('voiceSessionLog')||'[]'); } catch(e){ return []; }
})();
function openSbSettings(){
  if(!sbUser) return showAuthLogin();
  document.getElementById('accountInfo').textContent=`${sbUser.email||'مستخدم'} — الصلاحية: ${sbUserRole||'غير محددة'}`;
  document.getElementById('sbSettingsModal').classList.add('open');
}

// ══ START ══
// Architecture: Supabase is the ONLY source of truth.
// localStorage is never read or written for app data.
// On load, show a brief "جاري التحميل..." state, then fetch from Supabase.
// If Supabase is unreachable, show an offline warning.
// ══════════════════════════════════════
//  BACKUP SYSTEM  💾
//  - Auto backup daily at 23:00
//  - Keeps last 30 backups
//  - Manual backup + restore from modal
// ══════════════════════════════════════

const BACKUP_TABLE = 'pharmacy_backups';
let pendingRestoreId = null;

// ── عند الفتح: احفظ نسخة إذا لم تُحفظ نسخة اليوم بعد ──

let backupSchedulerStarted=false;
async function startApplication(){
  showToast('⏳ جاري تحميل البيانات من Supabase...');
  await sbLoad();
  refreshAll();
  showToast('✅ تم تحميل البيانات');
  if(!backupSchedulerStarted){startBackupScheduler();backupSchedulerStarted=true;}
  initBackupBadge();
}

async function bootApplication(){
  startAuthTimeout();
  initData(); refreshAll();
  try{
    if(handleAuthCallback()||restorePasswordSetupSession()) return;
    if(!await sbEnsureSession()) return showAuthLogin();
    sbUser=sbSession.user;
    await loadSbUserRole();
    await startApplication();
  }catch(e){
    storeSbSession(null);sbUser=null;sbUserRole='';showAuthLogin(e.message);
  }
}

bootApplication();
document.getElementById('shelfSearch').addEventListener('input',renderShelves);
initVoice();
