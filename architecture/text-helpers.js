(function(global){
  'use strict';
  if(typeof global.cleanUserText==='function') return;
  global.cleanUserText=function(value,max=500){
    return String(value??'').replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,max);
  };
  if(typeof global.escapeHtml!=='function') global.escapeHtml=function(value){
    return global.PharmacyTextPolicy
      ? global.PharmacyTextPolicy.escape(value)
      : String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  };
})(window);
