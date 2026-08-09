/* Shared text normalization and HTML escaping policy. */
(function (global) {
  'use strict';
  function normalize(value) { return String(value == null ? '' : value).normalize('NFKC').toLowerCase().replace(/[\u064B-\u065F\u0670]/g, '').replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ').trim(); }
  function escape(value) { return String(value == null ? '' : value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
  global.PharmacyTextPolicy = Object.freeze({normalize, escape});
}(window));
