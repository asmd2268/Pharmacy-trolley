(function(global){
  'use strict';
  let counter=0;
  if(typeof global.uid==='function') return;
  global.uid=function(){
    const c=globalThis.crypto;
    if(c&&typeof c.randomUUID==='function') return c.randomUUID();
    if(c&&typeof c.getRandomValues==='function'){
      const bytes=new Uint8Array(16); c.getRandomValues(bytes);
      bytes[6]=(bytes[6]&15)|64; bytes[8]=(bytes[8]&63)|128;
      const h=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
      return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
    }
    counter=(counter+1)%1000000;
    return `local-${Date.now().toString(36)}-${counter.toString(36)}`;
  };
})(window);
