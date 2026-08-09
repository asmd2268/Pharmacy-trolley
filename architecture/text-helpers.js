(function(global){
  'use strict';
  if(typeof global.cleanUserText==='function') return;
  global.cleanUserText=function(value,max=500){
    return String(value??'').replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,max);
  };
})(window);
