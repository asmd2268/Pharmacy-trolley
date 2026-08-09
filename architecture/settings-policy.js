(function(global){
  'use strict';
  if(typeof global.sanitizeSettings==='function') return;
  global.sanitizeSettings=function(value){
    const clean=Object.assign({warnDays:30,critDays:7,authMinutes:15},structuredClone(value||{}));
    delete clean.writePassword;
    return clean;
  };
})(window);
