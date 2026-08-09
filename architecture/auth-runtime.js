let sbPasswordSetupSession=null;

function storeSbSession(session){
  sbSession=session;
  if(sbSessionStore) sbSessionStore.write(session);
  else if(session && window.PharmacyStoragePolicy) PharmacyStoragePolicy.write(sessionStorage,SB_SESSION_KEY,session);
  else sessionStorage.removeItem(SB_SESSION_KEY);
}

function readSbSession(){
  return sbSessionStore?sbSessionStore.read():(()=>{try{return JSON.parse(sessionStorage.getItem(SB_SESSION_KEY)||'null');}catch(e){return null;}})();
}

async function sbAuthRequest(path,body){
  const res=await fetch(`${SB_URL}/auth/v1/${path}`,{
    method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)
  });
  const result=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(result.error_description||result.msg||'فشل تسجيل الدخول');
  return result;
}

function normalizeAuthSession(result){
  return {
    accessToken:result.access_token,refreshToken:result.refresh_token,
    expiresAt:Date.now()+(Number(result.expires_in||3600)*1000),user:result.user
  };
}

async function sbEnsureSession(){
  if(!sbSession) sbSession=readSbSession();
  if(!sbSession||!sbSession.accessToken) return false;
  if(sbSession.expiresAt-Date.now()>60000){ sbUser=sbSession.user; return true; }
  return refreshSbSession();
}

async function refreshSbSession(){
  if(!sbSession||!sbSession.refreshToken) return false;
  const refreshed=await sbAuthRequest('token?grant_type=refresh_token',{refresh_token:sbSession.refreshToken});
  storeSbSession(normalizeAuthSession(refreshed)); sbUser=sbSession.user;
  return true;
}

async function loadSbUserRole(){
  const rows=await sbFetch(`app_users?user_id=eq.${encodeURIComponent(sbUser.id)}&active=is.true&select=role`);
  const role=rows&&rows[0]&&rows[0].role;
  if(!['reader','writer','admin'].includes(role)) throw new Error('الحساب غير مضاف إلى قائمة مستخدمي التطبيق');
  sbUserRole=role;
}

function showAuthLogin(message=''){
  const modal=document.getElementById('authLoginModal');
  const err=document.getElementById('authLoginError');
  if(err){err.textContent=message;err.style.display=message?'':'none';}
  if(modal) modal.classList.add('open');
}

function passwordResetRedirectUrl(){ return location.origin+location.pathname; }
function passwordPolicyError(password){
  const p=String(password||'');
  if(p.length<12) return 'استخدم 12 حرفًا على الأقل';
  if(!/[A-Z]/.test(p)) return 'أضف حرفًا إنجليزيًا كبيرًا واحدًا على الأقل';
  if(!/[a-z]/.test(p)) return 'أضف حرفًا إنجليزيًا صغيرًا واحدًا على الأقل';
  if(!/[0-9]/.test(p)) return 'أضف رقماً واحداً على الأقل';
  if(!/[^A-Za-z0-9]/.test(p)) return 'أضف رمزاً واحداً على الأقل';
  return '';
}

function showPasswordSetup(session){
  sbPasswordSetupSession=session;
  if(window.PharmacyStoragePolicy) PharmacyStoragePolicy.write(sessionStorage,SB_PASSWORD_SETUP_KEY,session);
  document.getElementById('passwordSetupTitle').textContent=session.type==='invite'?'🔑 إنشاء كلمة مرور الحساب':'🔑 تعيين كلمة مرور جديدة';
  document.getElementById('passwordSetupModal').classList.add('open');
}

function restorePasswordSetupSession(){
  try{
    const session=JSON.parse(sessionStorage.getItem(SB_PASSWORD_SETUP_KEY)||'null');
    if(!session||!session.accessToken||!session.refreshToken||!['invite','recovery'].includes(session.type)||Number(session.expiresAt)<=Date.now()){
      sessionStorage.removeItem(SB_PASSWORD_SETUP_KEY); return false;
    }
    showPasswordSetup(session); return true;
  }catch(e){sessionStorage.removeItem(SB_PASSWORD_SETUP_KEY);return false;}
}

function handleAuthCallback(){
  const hash=new URLSearchParams(String(location.hash||'').replace(/^#/,''));
  const type=hash.get('type');
  const accessToken=hash.get('access_token'),refreshToken=hash.get('refresh_token');
  if(!['invite','recovery'].includes(type)||!accessToken||!refreshToken) return false;
  const session={
    accessToken,refreshToken,type,
    expiresAt:Date.now()+(Number(hash.get('expires_in')||3600)*1000)
  };
  history.replaceState(null,'',location.pathname+location.search);
  showPasswordSetup(session);
  return true;
}

async function sbRequestPasswordReset(){
  const email=document.getElementById('authEmail').value.trim();
  const btn=document.getElementById('authRecoveryBtn');
  if(!email) return showAuthLogin('أدخل البريد الإلكتروني أولًا');
  btn.disabled=true;
  try{
    const redirectTo=passwordResetRedirectUrl();
    const res=await fetch(`${SB_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`,{
      method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},body:JSON.stringify({email})
    });
    if(!res.ok){ const detail=await res.json().catch(()=>({})); throw new Error(detail.msg||'تعذّر إرسال رابط إعادة التعيين'); }
    showAuthLogin('✅ إذا كان الحساب موجودًا فسيصل رابط آمن إلى البريد.');
  }catch(e){ showAuthLogin(e.message); }
  finally{btn.disabled=false;}
}

async function sbCompletePasswordSetup(){
  const password=document.getElementById('newAuthPassword').value;
  const confirmPassword=document.getElementById('confirmAuthPassword').value;
  const error=document.getElementById('passwordSetupError');
  const btn=document.getElementById('passwordSetupBtn');
  const fail=message=>{error.textContent=message;error.style.display='';};
  if(!sbPasswordSetupSession) return fail('انتهت جلسة الرابط. اطلب رابطًا جديدًا.');
  const policyError=passwordPolicyError(password);
  if(policyError) return fail(policyError);
  if(password!==confirmPassword) return fail('كلمتا المرور غير متطابقتين');
  btn.disabled=true; error.style.display='none';
  try{
    const res=await fetch(`${SB_URL}/auth/v1/user`,{
      method:'PUT',headers:{apikey:SB_KEY,Authorization:'Bearer '+sbPasswordSetupSession.accessToken,'Content-Type':'application/json'},
      body:JSON.stringify({password})
    });
    const user=await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(user.msg||'تعذّر حفظ كلمة المرور');
    storeSbSession({...sbPasswordSetupSession,user}); sbUser=user; sbPasswordSetupSession=null;
    sessionStorage.removeItem(SB_PASSWORD_SETUP_KEY);
    document.getElementById('newAuthPassword').value='';document.getElementById('confirmAuthPassword').value='';
    await loadSbUserRole(); closeModal('passwordSetupModal'); await startApplication();
  }catch(e){fail(e.message);}
  finally{btn.disabled=false;}
}

async function sbSignIn(){
  const email=document.getElementById('authEmail').value.trim();
  const password=document.getElementById('authPassword').value;
  const btn=document.getElementById('authLoginBtn');
  if(!email||!password) return showAuthLogin('أدخل البريد وكلمة المرور');
  btn.disabled=true;
  try{
    const result=await sbAuthRequest('token?grant_type=password',{email,password});
    storeSbSession(normalizeAuthSession(result)); sbUser=sbSession.user;
    await loadSbUserRole();
    document.getElementById('authPassword').value=''; closeModal('authLoginModal');
    await startApplication();
  }catch(e){ storeSbSession(null); sbUser=null; sbUserRole=''; showAuthLogin(e.message); }
  finally{btn.disabled=false;}
}

async function sbSignOut(){
  if(sbSessionTimeout) sbSessionTimeout.stop();
  if(window._shelfPhotoRefreshTimer){ clearInterval(window._shelfPhotoRefreshTimer); window._shelfPhotoRefreshTimer=null; }
  const accessToken=sbSession&&sbSession.accessToken;
  if(accessToken){
    try{
      await fetch(`${SB_URL}/auth/v1/logout`,{method:'POST',headers:{apikey:SB_KEY,Authorization:'Bearer '+accessToken}});
    }catch(e){ console.warn('Remote logout could not be confirmed',e); }
  }
  storeSbSession(null); sbUser=null; sbUserRole=''; sbConnected=false;
  data={};shelves=[];oosManual=[];refreshAll();closeModal('sbSettingsModal');setSbStatus('offline');showAuthLogin();
}

