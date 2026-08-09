/* Storage adapter for shelf photos. UI code supplies the authenticated session. */
(function (global) {
  'use strict';
  const TYPES = /^(?:image\/(?:png|jpe?g|webp|gif))$/i;
  function assertImage(file) {
    if (!file || !TYPES.test(file.type || '') || file.size > 2 * 1024 * 1024) throw new Error('الصورة يجب أن تكون PNG/JPG/WebP/GIF وأقل من 2MB');
  }
  function safeImageSrc(value, supabaseUrl) {
    const v = String(value || ''), base = String(supabaseUrl || '');
    if (base && new RegExp('^' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/storage/v1/object/sign/shelf-images/').test(v)) return v;
    return /^data:image\/(?:png|jpe?g|webp|gif);base64,[a-z0-9+/=]+$/i.test(v) ? v : '';
  }
  function create(config) {
    config = config || {};
    const headers = () => ({apikey: config.key, Authorization: 'Bearer ' + config.token(), 'Content-Type': 'application/json'});
    return Object.freeze({
      upload: async function (file, shelfId) {
        assertImage(file); if (!config.token()) throw new Error('يجب تسجيل الدخول لرفع الصورة');
        const ext = (file.type || 'image/jpeg').split('/')[1].replace('jpeg', 'jpg');
        const path = config.userId() + '/' + shelfId + '-' + Date.now() + '.' + ext;
        const response = await fetch(config.url + '/storage/v1/object/shelf-images/' + encodeURIComponent(path), {method: 'POST', headers: {...headers(), 'Content-Type': file.type || 'image/jpeg', 'x-upsert': 'true'}, body: file});
        if (!response.ok) throw new Error('تعذر رفع صورة الرف'); return path;
      },
      signedUrl: async function (path) {
        if (!path || !config.token()) return '';
        const response = await fetch(config.url + '/storage/v1/object/sign/shelf-images/' + encodeURIComponent(path), {method: 'POST', headers: headers(), body: JSON.stringify({expiresIn: 3600})});
        if (!response.ok) return ''; const json = await response.json(); return json.signedURL ? config.url + '/storage/v1' + json.signedURL : '';
      },
      remove: async function (path) { if (path && config.token()) await fetch(config.url + '/storage/v1/object/shelf-images/' + encodeURIComponent(path), {method: 'DELETE', headers: headers()}); }
    });
  }
  global.PharmacyShelfStorage = Object.freeze({create, assertImage, safeImageSrc});
}(window));
