function saveSessionLog(){
  PharmacyStoragePolicy.write(localStorage,'voiceSessionLog',voiceSessionLog,(e)=>{ if(e&&e.name==='QuotaExceededError') toast('مساحة التخزين ممتلئة، تعذر حفظ سجل الإدخال الصوتي','error'); });
}

// ── Password gate ──
function checkVoicePass(){
  if(['writer','admin'].includes(sbUserRole)){
    voiceUnlocked = true;
    document.getElementById('voiceGate').style.display = 'none';
    document.getElementById('voicePanel').style.display = 'block';
    initVoice();
    renderVoiceSessionList();
  } else {
    document.getElementById('voicePassErr').style.display = 'block';
  }
}
function lockVoice(){
  voiceUnlocked = false;
  stopVoice();
  document.getElementById('voiceGate').style.display = 'flex';
  document.getElementById('voicePanel').style.display = 'none';
  document.getElementById('voicePassErr').style.display = 'none';
}

// ── Arabic letter → slot ──
// IMPORTANT: Do NOT include 'الف' here — causes "25 أ" → "25000" bug
// (arabicNorm converts أ/الف after number expansion, "ألف"=1000)
// We extract slot BEFORE arabicNorm to avoid collisions
const AR_SLOT_RAW = {
  // Definite Arabic slot letters only
  'أ':'A','آ':'A',
  'ب':'B',
  'ج':'C',
  'د':'D'
};
// Spoken long-form alternatives (matched as whole words only)
const AR_SLOT_WORDS = [
  ['باء','B'],['بي','B'],['بيه','B'],
  ['جيم','C'],['سي','C'],
  ['دال','D'],['دي','D'],['ديه','D'],
  ['ألف','A'],['الف','A'],['آلف','A'],  // kept here only as whole-word
];

// ── Arabic number words → integer ──
const ARABIC_NUMS_ORD = [
  ['واحد وخمسون','51'],['اثنان وخمسون','52'],
  ['خمسون','50'],['تسعة وأربعون','49'],['ثمانية وأربعون','48'],
  ['سبعة وأربعون','47'],['ستة وأربعون','46'],['خمسة وأربعون','45'],
  ['أربعة وأربعون','44'],['ثلاثة وأربعون','43'],['اثنان وأربعون','42'],
  ['واحد وأربعون','41'],['أربعون','40'],['تسعة وثلاثون','39'],
  ['ثمانية وثلاثون','38'],['سبعة وثلاثون','37'],['ستة وثلاثون','36'],
  ['خمسة وثلاثون','35'],['أربعة وثلاثون','34'],['ثلاثة وثلاثون','33'],
  ['اثنان وثلاثون','32'],['واحد وثلاثون','31'],['ثلاثون','30'],
  ['تسعة وعشرون','29'],['ثمانية وعشرون','28'],['سبعة وعشرون','27'],
  ['ستة وعشرون','26'],['خمسة وعشرون','25'],['أربعة وعشرون','24'],
  ['ثلاثة وعشرون','23'],['اثنان وعشرون','22'],['واحد وعشرون','21'],
  ['عشرون','20'],['تسعة عشر','19'],['ثمانية عشر','18'],
  ['سبعة عشر','17'],['ستة عشر','16'],['خمسة عشر','15'],
  ['أربعة عشر','14'],['ثلاثة عشر','13'],['اثنا عشر','12'],['اثني عشر','12'],
  ['أحد عشر','11'],['عشرة','10'],
  ['تسعة','9'],['ثمانية','8'],['سبعة','7'],['ستة','6'],
  ['خمسة','5'],['أربعة','4'],['ثلاثة','3'],['اثنين','2'],['اثنان','2'],
  ['واحد','1'],['صفر','0'],
  // years
  ['ألفان وثمانية وعشرون','2028'],['ألفان وسبعة وعشرون','2027'],
  ['ألفان وستة وعشرون','2026'],['ألفان وخمسة وعشرون','2025'],
  ['ألفان وأربعة وعشرون','2024'],
];

const ARABIC_MONTHS = {
  'يناير':'01','جانفي':'01','ينايـر':'01','يناير':'01',
  'فبراير':'02','شباط':'02','فبراير':'02',
  'مارس':'03','آذار':'03',
  'أبريل':'04','نيسان':'04','إبريل':'04','ابريل':'04',
  'مايو':'05','أيار':'05','ماي':'05',
  'يونيو':'06','حزيران':'06','يونيه':'06','يونيو':'06',
  'يوليو':'07','تموز':'07','يوليه':'07','يوليو':'07',
  'أغسطس':'08','آب':'08','اغسطس':'08',
  'سبتمبر':'09','أيلول':'09',
  'أكتوبر':'10','تشرين الأول':'10','أكتوبر':'10',
  'نوفمبر':'11','تشرين الثاني':'11',
  'ديسمبر':'12','كانون الأول':'12','ديسمبر':'12',
};

function arabicNorm(t){
  let s = t.trim();
  // sort by length desc so longer phrases match first
  for(const [k,v] of ARABIC_NUMS_ORD) s = s.replace(new RegExp(k,'g'), v);
  return s;
}

function extractSlot(raw){
  // 1) English inline: "3A", "5B", "12C", "7D" — letter right after digits
  const inlineEn = raw.match(/\b\d{1,2}\s*([A-Da-d])\b/);
  if(inlineEn) return inlineEn[1].toUpperCase();

  // 2) Standalone English letter word: "A", "B", "C", "D"
  const standEn = raw.match(/(?:^|\s)([A-Da-d])(?:\s|$)/);
  if(standEn) return standEn[1].toUpperCase();

  // 3) Arabic single-char letters — check BEFORE any number expansion
  for(const [ar, en] of Object.entries(AR_SLOT_RAW)){
    // use unicode boundary: space or start/end around the letter
    const re = new RegExp('(?:^|[\\s\\u060C\\u060D،,])' + ar + '(?=[\\s\\u060C،,]|$)');
    if(re.test(raw)) return en;
  }

  // 4) Long-form Arabic slot words (whole-word match)
  for(const [word, en] of AR_SLOT_WORDS){
    const re = new RegExp('(?:^|\\s)' + word + '(?:\\s|$)','u');
    if(re.test(raw)) return en;
  }
  return null;
}

// English months lookup for date extraction
const ENGLISH_MONTHS = {
  'january':'01','jan':'01','february':'02','feb':'02','march':'03','mar':'03',
  'april':'04','apr':'04','may':'05','june':'06','jun':'06',
  'july':'07','jul':'07','august':'08','aug':'08','september':'09','sep':'09',
  'october':'10','oct':'10','november':'11','nov':'11','december':'12','dec':'12'
};

function extractDateEnglish(raw){
  const t = raw.toLowerCase();
  let m = t.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if(m){let[,d,mo,y]=m;if(y.length===2)y='20'+y;return `${y.padStart(4,'0')}-${mo.padStart(2,'0')}-${d.padStart(2,'0')}`;}
  for(const [mn,mv] of Object.entries(ENGLISH_MONTHS)){
    const re2=new RegExp('(\\d{1,2})\\s+'+mn+'\\s+(\\d{2,4})','i');
    m=t.match(re2); if(m){let[,d,y]=m;if(y.length===2)y='20'+y;return `${y}-${mv}-${d.padStart(2,'0')}`;}
    const re1=new RegExp(mn+'\\s+(\\d{2,4})','i');
    m=t.match(re1); if(m){let y=m[1];if(y.length===2)y='20'+y;return `${y}-${mv}-01`;}
  }
  return null;
}

function matchDrugByName(raw){
  const q = raw.toLowerCase().trim();
  if(!q || q.length < 3) return null;
  let best=null, bestScore=0;
  for(const [key,item] of Object.entries(data)){
    const name=item.name.toLowerCase().replace(/\n/g,' ');
    const words=q.split(/\s+/).filter(w=>w.length>=3);
    let score=0;
    for(const w of words){ if(name.includes(w)) score+=w.length; }
    if(score>bestScore){bestScore=score;best={key,name:item.name.replace(/\n/g,' ')};}
  }
  return bestScore>=3?best:null;
}

function extractDrawer(rawOriginal){
  // Step 1: extract slot from ORIGINAL text (before any number expansion)
  // This prevents "25 أ" → "25000" after arabicNorm
  const slot = extractSlot(rawOriginal);

  // Step 2: STRIP the slot letter/word from text before arabicNorm
  //         so it doesn't interfere with number parsing
  let stripped = rawOriginal;
  // Remove inline pattern like "25أ" or "25 أ" or "25A"
  stripped = stripped.replace(/\b(\d{1,2})\s*[A-Da-dأآبجد]\b/g, '$1');
  // Remove standalone slot words
  const allSlotWords = Object.keys(AR_SLOT_RAW).concat(AR_SLOT_WORDS.map(x=>x[0]));
  for(const w of allSlotWords){
    stripped = stripped.replace(new RegExp('(?:^|\\s)'+w+'(?=\\s|$)','g'),' ');
  }

  // Step 3: normalize numbers on stripped text
  const t = arabicNorm(stripped);

  // Step 4: find drawer number 1-50
  const m = t.match(/\b([1-9]|[1-4]\d|50)\b/);
  if(m && slot) return {dr: parseInt(m[1]), sl: slot};
  if(m)         return {dr: parseInt(m[1]), sl: null};
  return null;
}

function extractDate(raw){
  let t = arabicNorm(raw);
  // dd/mm/yyyy or dd-mm-yyyy
  let m = t.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if(m){ let[,d,mo,y]=m; if(y.length===2)y='20'+y; return `${y.padStart(4,'0')}-${mo.padStart(2,'0')}-${d.padStart(2,'0')}`; }
  // Try month-name patterns (longest first)
  const monthKeys = Object.keys(ARABIC_MONTHS).sort((a,b)=>b.length-a.length);
  for(const mn of monthKeys){
    const mv = ARABIC_MONTHS[mn];
    // "15 مارس 2026"
    const re2 = new RegExp('(\\d{1,2})\\s+'+mn+'\\s+(\\d{2,4})','i');
    m = t.match(re2);
    if(m){ let[,d,y]=m; if(y.length===2)y='20'+y; return `${y}-${mv}-${d.padStart(2,'0')}`; }
    // "مارس 2026"
    const re1 = new RegExp(mn+'\\s+(\\d{2,4})','i');
    m = t.match(re1);
    if(m){ let y=m[1]; if(y.length===2)y='20'+y; return `${y}-${mv}-01`; }
  }
  return null;
}

function initVoice(){
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRec){
    document.getElementById('voiceNotSupported').style.display = 'block';
    return;
  }
  if(voiceRecognition) return; // already inited
  voiceRecognition = new SpeechRec();
  voiceRecognition.continuous = false;
  voiceRecognition.interimResults = true;
  voiceRecognition.lang = 'ar-SA';
  voiceRecognition.maxAlternatives = 5;

  voiceRecognition.onresult = e => {
    let interim='', final='';
    for(let i=e.resultIndex; i<e.results.length; i++){
      if(e.results[i].isFinal){
        // take best alternative
        final += e.results[i][0].transcript;
      } else interim += e.results[i][0].transcript;
    }
    document.getElementById('voiceInterim').textContent = interim || final;
    if(final) processVoiceFinal(final);
  };
  voiceRecognition.onerror = e => {
    setVoiceStatus('error','❌ خطأ: '+e.error);
    setVoiceBtn('idle');
  };
  voiceRecognition.onend = () => {
    if(voiceState === 'listening') setVoiceBtn('idle');
  };
}

function startVoice(){
  if(!voiceRecognition){ initVoice(); if(!voiceRecognition) return; }
  voiceState = 'listening';
  document.getElementById('voiceInterim').textContent = '';
  try{ voiceRecognition.start(); } catch(e){}
  setVoiceBtn('listening');
  setVoiceStatus('listening','🎙️ جارٍ الاستماع... تكلّم الآن');
}
function stopVoice(){
  voiceState = 'idle';
  try{ voiceRecognition && voiceRecognition.stop(); }catch(e){}
  setVoiceBtn('idle');
}

function setVoiceBtn(state){
  const btn = document.getElementById('voiceMicBtn');
  if(!btn) return;
  if(state==='listening'){
    btn.textContent='⏹ إيقاف'; btn.className='btn btn-danger';
    btn.onclick = stopVoice;
  } else {
    btn.textContent='🎙️ تسجيل جديد'; btn.className='btn btn-primary';
    btn.onclick = startVoice;
  }
}
function setVoiceStatus(type,msg){
  const el=document.getElementById('voiceStatus');
  if(!el) return;
  el.textContent=msg;
  el.className='voice-status voice-status-'+type;
}

function processVoiceFinal(text){
  try{ voiceRecognition && voiceRecognition.stop(); }catch(e){}
  setVoiceBtn('idle');
  setVoiceStatus('processing','⏳ جارٍ التحليل...');

  const loc = extractDrawer(text);
  // Try Arabic then English date extraction
  const date = extractDate(text) || extractDateEnglish(text);

  let resolved = null;
  if(loc && loc.sl){
    const key = `${loc.dr}${loc.sl}`;
    if(data[key]) resolved = {key, name:data[key].name.replace(/\n/g,' ')};
  }
  // If no location match, try drug name
  if(!resolved) resolved = matchDrugByName(text);

  // Always show confirm card so user can correct
  if(!date){
    setVoiceStatus('error','❌ لم أتعرف على التاريخ — أكمله يدوياً');
  } else if(!resolved){
    setVoiceStatus('error','❌ لم أتعرف على الدرج — اختر من القائمة');
  } else {
    setVoiceStatus('ok','✅ تم التعرف — أكّد البيانات');
  }
  showVoiceConfirm(text, resolved, date, loc);
}

function showVoiceConfirm(raw, resolved, date, loc){
  const box = document.getElementById('voiceConfirmBox');
  const resolvedKey = resolved ? resolved.key : '';
  const drawerVal = loc ? loc.dr : '';
  const dr = resolvedKey.match(/\d+/)?.[0] || drawerVal || '';
  const sl = resolvedKey.match(/[A-F]/)?.[0] || (loc&&loc.sl) || 'A';
  const resolvedNameDisplay = resolved
    ? `<strong style="color:var(--accent)">${escapeHtml(resolved.name)}</strong>`
    : '<span style="color:var(--warn)">— لم يُعثر، ابحث يدوياً</span>';
  const existing = resolved
    ? (data[resolved.key].expiries.map(e=>`<span class="exp-tag ok">${formatDate(e)}</span>`).join(' ')||'<span style="color:var(--text3)">لا يوجد</span>')
    : '—';

  box.innerHTML = `
    <div class="voice-confirm-card" style="margin-top:10px">
      <div class="voice-raw">📝 النص المُعرَّف: <em>${escapeHtml(raw)}</em></div>

      <!-- DRUG SEARCH — open autocomplete, no close -->
      <div class="voice-confirm-row" style="flex-direction:column;align-items:flex-start;gap:5px;width:100%">
        <span class="voice-lbl">🔍 الدواء (ابحث بالعربي أو الإنجليزي أو رقم الدرج)</span>
        <div style="position:relative;width:100%">
          <input type="text" id="vcDrugSearch"
            value="${escapeHtml(resolved ? resolved.name.replace(/\n/g,' ') : '')}"
            placeholder="اكتب للبحث..."
            autocomplete="off"
            spellcheck="false"
            oninput="vcFilterDrugs(this.value)"
            onfocus="vcShowDropdown()"
            style="width:100%;background:var(--surface2);border:1px solid var(--accent);border-radius:6px 6px 0 0;padding:7px 10px;color:var(--text);font-family:var(--font);font-size:12px;outline:none">
          <!-- Dropdown always visible while confirm card is open -->
          <div id="vcDropdown" style="
            width:100%;background:var(--surface);
            border:1px solid var(--accent);border-top:none;
            border-radius:0 0 7px 7px;max-height:190px;overflow-y:auto;
            box-shadow:0 4px 14px rgba(0,0,0,.35)">
          </div>
        </div>
      </div>

      <div class="voice-confirm-row">
        <span class="voice-lbl">الموقع المحدد</span>
        <span id="vcLocDisplay" style="font-family:var(--mono);font-size:13px;color:var(--accent2);font-weight:700;background:rgba(0,153,255,.1);padding:2px 9px;border-radius:5px">${dr ? 'درج '+dr+' — '+sl : '—'}</span>
      </div>
      <!-- Hidden key fields -->
      <input type="hidden" id="vcDr" value="${dr}">
      <input type="hidden" id="vcSl" value="${sl}">

      <div class="voice-confirm-row">
        <span class="voice-lbl">اسم الدواء</span>
        <div id="vcDrugName">${resolvedNameDisplay}</div>
      </div>
      <div class="voice-confirm-row">
        <span class="voice-lbl">التواريخ الحالية</span>
        <div id="vcExisting">${existing}</div>
      </div>
      <div class="voice-confirm-row">
        <span class="voice-lbl">📅 التاريخ الجديد</span>
        <input type="date" id="vcDate" value="${date||''}"
          style="background:var(--surface2);border:1px solid var(--accent);border-radius:6px;padding:5px 9px;color:var(--text);font-family:var(--mono);font-size:13px">
      </div>
      <div class="voice-confirm-row">
        <span class="voice-lbl">الوضع</span>
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px">
          <input type="checkbox" id="vcReplace" style="width:14px;height:14px"> استبدال التواريخ القديمة
        </label>
      </div>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="confirmVoiceSave()">✅ تأكيد وحفظ</button>
        <button class="btn btn-secondary" onclick="dismissVoiceConfirm()">⏭️ تخطّ</button>
      </div>
    </div>`;
  box.style.display = 'block';
  // Populate dropdown immediately with all results
  setTimeout(()=>vcFilterDrugs(resolved ? resolved.name.replace(/\n/g,' ') : ''), 30);
}

// Filter drug dropdown
function vcShowDropdown(){
  const inp = document.getElementById('vcDrugSearch');
  if(inp) vcFilterDrugs(inp.value||'');
}

function vcFilterDrugs(q){
  const dd = document.getElementById('vcDropdown');
  if(!dd) return;
  const sq = normalizeSearchText(q||'');
  let results;
  if(!sq){
    results = Object.entries(data).filter(([k])=>!k.startsWith('x_')).slice(0,50).map(([k,v])=>({key:k,name:v.name.replace(/\n/g,' ')}));
  } else {
    results = Object.entries(data)
      .filter(([k])=>!k.startsWith('x_'))
      .filter(([k,v])=>{
        const nm=normalizeSearchText(v.name);
        return nm.includes(sq) || normalizeSearchText(k).includes(sq) ||
               k.replace(/[^\d]/g,'').includes(sq); // drawer number
      })
      .map(([k,v])=>({key:k,name:v.name.replace(/\n/g,' ')}))
      .slice(0,50);
  }
  if(!results.length){
    dd.innerHTML='<div style="padding:8px 12px;font-size:11px;color:var(--text3)">لا توجد نتائج</div>';
    return;
  }
  dd.innerHTML = results.map(r=>{
    const drn=r.key.match(/\d+/)[0], sln=r.key.match(/[A-F]/)[0];
    const cleanName=escapeHtml(r.name);
    const hi = sq ? cleanName.replace(
      new RegExp(sq.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),
      m=>`<mark style="background:rgba(0,212,170,.3);color:var(--accent);border-radius:2px;padding:0 1px">${m}</mark>`
    ) : cleanName;
    return `<div onclick="vcSelectDrug('${r.key}')"
      style="padding:7px 11px;cursor:pointer;font-size:11px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);transition:background .1s"
      onmouseover="this.style.background='var(--surface2)'"
      onmouseout="this.style.background='transparent'">
      <span style="font-family:var(--mono);font-size:10px;color:var(--accent2);min-width:48px;flex-shrink:0;font-weight:700">د${drn}/${sln}</span>
      <span style="flex:1;line-height:1.35">${hi}</span>
    </div>`;
  }).join('');
}

function vcSelectDrug(key){
  const item=data[key]; if(!item) return;
  const dr=key.match(/\d+/)[0], sl=key.match(/[A-F]/)[0];
  const inp=document.getElementById('vcDrugSearch');
  if(inp) inp.value=item.name.replace(/\n/g,' ');
  document.getElementById('vcDr').value=dr;
  document.getElementById('vcSl').value=sl;
  document.getElementById('vcLocDisplay').textContent=`درج ${dr} — ${sl}`;
  document.getElementById('vcDrugName').innerHTML=`<strong style="color:var(--accent)">${escapeHtml(item.name.replace(/\n/g,' '))}</strong>`;
  document.getElementById('vcExisting').innerHTML=item.expiries.length
    ?item.expiries.map(e=>`<span class="exp-tag ok">${formatDate(e)}</span>`).join(' ')
    :'<span style="color:var(--text3)">لا يوجد</span>';
  // keep dropdown open but scroll to top
  const dd=document.getElementById('vcDropdown');
  if(dd) dd.scrollTop=0;
}

function confirmVoiceSave(){
  if(!isWriteAuthFresh()) return setVoiceStatus('error','⛔ الحساب للقراءة فقط');
  const dr = document.getElementById('vcDr').value;
  const sl = document.getElementById('vcSl').value;
  const dateVal = document.getElementById('vcDate').value;
  const replace = document.getElementById('vcReplace').checked;
  const key = `${dr}${sl}`;
  if(!data[key]) return setVoiceStatus('error','❌ الدرج غير موجود');
  if(!isValidIsoDate(dateVal)) return setVoiceStatus('error','⚠️ أدخل تاريخًا صحيحًا');
  if(replace) data[key].expiries = [dateVal];
  else data[key].expiries=normalizeExpiries([...(data[key].expiries||[]),dateVal]);
  saveData(); refreshAll();
  // Add to session log
  voiceSessionLog.push({
    key, name: data[key].name.replace(/\n/g,' '), date: dateVal,
    replace, ts: new Date().toLocaleTimeString('ar-SA')
  });
  saveSessionLog();
  renderVoiceSessionList();
  document.getElementById('voiceConfirmBox').style.display = 'none';
  document.getElementById('voiceInterim').textContent = '';
  setVoiceStatus('ok', `✅ تم حفظ ${data[key].name.replace(/\n/g,' ').split(' ')[0]} — جاهز لتسجيل جديد`);
  showToast(`✅ تم حفظ تاريخ ${formatDate(dateVal)} لـ درج ${dr}-${sl}`);
  // Auto-restart after short delay
  setTimeout(()=>{
    if(voiceUnlocked) startVoice();
  }, 1200);
}

function dismissVoiceConfirm(){
  document.getElementById('voiceConfirmBox').style.display = 'none';
  document.getElementById('voiceInterim').textContent = '';
  setVoiceStatus('idle','تم التخطّي. جاهز لتسجيل جديد.');
  setTimeout(()=>{ if(voiceUnlocked) startVoice(); }, 800);
}

function renderVoiceSessionList(){
  const el = document.getElementById('voiceSessionList');
  if(!el) return;
  const cnt = document.getElementById('voiceSessionCount');
  if(cnt) cnt.textContent = voiceSessionLog.length > 0 ? `(${voiceSessionLog.length} إدخال)` : '';
  if(!voiceSessionLog.length){
    el.innerHTML='<div style="color:var(--text3);font-size:12px;font-style:italic">لا توجد تسجيلات بعد.</div>';
    return;
  }
  el.innerHTML = `<div style="display:flex;flex-direction:column;gap:5px">` +
    voiceSessionLog.slice().reverse().map((item,i)=>{
      const idx = voiceSessionLog.length - 1 - i;
      const dr = item.key.match(/\d+/)[0], sl = item.key.match(/[A-F]/)[0];
      const stEl = expStatus(item.date);
      return `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:var(--surface2);border-radius:7px;border:1px solid var(--border)">
        <span style="font-family:var(--mono);font-size:11px;color:var(--accent2);min-width:60px">درج ${dr}–${sl}</span>
        <span style="flex:1;font-size:12px;font-weight:600;color:var(--text)">${escapeHtml(item.name)}</span>
        <span class="exp-tag ${stEl==='critical'?'danger':stEl}">${formatDate(item.date)}</span>
        ${item.replace?'<span style="font-size:10px;color:var(--warn)">استُبدل</span>':'<span style="font-size:10px;color:var(--success)">أُضيف</span>'}
        <span style="font-size:10px;color:var(--text3)">${item.ts}</span>
        <button class="btn btn-danger btn-sm" style="padding:1px 6px" onclick="removeSessionLog(${idx})">×</button>
      </div>`;
    }).join('') + '</div>';
}

function removeSessionLog(idx){
  voiceSessionLog.splice(idx,1);
  saveSessionLog();
  renderVoiceSessionList();
}

function clearVoiceSession(){
  if(!voiceSessionLog.length) return;
  if(confirm('مسح قائمة التسجيلات؟ (البيانات المحفوظة لن تُحذف)')) {
    voiceSessionLog = [];
    saveSessionLog();
    renderVoiceSessionList();
  }
}

// ══ ACCOUNT ══
