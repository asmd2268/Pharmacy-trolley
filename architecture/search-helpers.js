(function(global){
  'use strict';
  if(typeof global.normalizeSearchText==='function') return;
  global.normalizeSearchText=function(value){
    return global.PharmacyTextPolicy
      ? global.PharmacyTextPolicy.normalize(value)
      : String(value??'').normalize('NFKC').toLowerCase()
        .replace(/[\u064B-\u065F\u0670]/g,'').replace(/[إأآٱ]/g,'ا')
        .replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim();
  };
})(window);
