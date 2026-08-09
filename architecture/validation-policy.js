(function(global){
  'use strict';
  if(typeof global.isValidDataKey==='function') return;
  global.isValidDataKey=function(value){
    return /^(?:[1-9]\d{0,2}[A-F]|x_[a-z0-9_-]{3,64})$/i.test(String(value||''));
  };
  if(typeof global.isAssignedToDrawer!=='function') global.isAssignedToDrawer=function(key){
    return !String(key||'').startsWith('x_');
  };
})(window);
