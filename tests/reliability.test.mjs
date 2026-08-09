import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const fullScript = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
if (!fullScript) throw new Error('Inline application script was not found.');
const script = fullScript.split('let backupSchedulerStarted=false;')[0];
const searchHelpers = await readFile(new URL('../architecture/search-helpers.js', import.meta.url), 'utf8');
const textHelpers = await readFile(new URL('../architecture/text-helpers.js', import.meta.url), 'utf8');
const datePolicy = await readFile(new URL('../architecture/date-policy.js', import.meta.url), 'utf8');
const idHelper = await readFile(new URL('../architecture/id-helper.js', import.meta.url), 'utf8');
const shelfStorage = await readFile(new URL('../architecture/shelf-storage.js', import.meta.url), 'utf8');
const settingsPolicy = await readFile(new URL('../architecture/settings-policy.js', import.meta.url), 'utf8');
const validationPolicy = await readFile(new URL('../architecture/validation-policy.js', import.meta.url), 'utf8');
const storagePolicy = await readFile(new URL('../architecture/storage-policy.js', import.meta.url), 'utf8');

function element() {
  return {
    value: '', textContent: '', innerHTML: '', style: {}, dataset: {}, disabled: false,
    className: '', classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    appendChild() {}, addEventListener() {}, querySelector() { return element(); },
  };
}

function makeContext() {
  const storage = new Map();
  const location = { origin: 'https://preview.example', pathname: '/', search: '', hash: '' };
  const history = { replaced: null, replaceState(_state,_title,url) { this.replaced=url; } };
  const document = {
    body: element(),
    getElementById() { return element(); },
    querySelector() { return element(); },
    querySelectorAll() { return []; },
    createElement() { return element(); },
  };
  const context = vm.createContext({
    console, document, crypto: { randomUUID: () => 'test-client' },
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) },
    sessionStorage: { getItem: k => storage.get(k) ?? null, setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) },
    window: { addEventListener() {}, print() {} }, navigator: {}, structuredClone, location, history,
    setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1,
    Blob, URL, URLSearchParams, AbortController, fetch: async () => { throw new Error('Unexpected network access in test'); },
    confirm: () => false,
  });
  vm.runInContext(searchHelpers, context, { filename: 'search-helpers.js' });
  vm.runInContext(textHelpers, context, { filename: 'text-helpers.js' });
  vm.runInContext(datePolicy, context, { filename: 'date-policy.js' });
  vm.runInContext(idHelper, context, { filename: 'id-helper.js' });
  vm.runInContext(shelfStorage, context, { filename: 'shelf-storage.js' });
  vm.runInContext(settingsPolicy, context, { filename: 'settings-policy.js' });
  vm.runInContext(validationPolicy, context, { filename: 'validation-policy.js' });
  vm.runInContext(storagePolicy, context, { filename: 'storage-policy.js' });
  context.normalizeSearchText = context.window.normalizeSearchText;
  context.escapeHtml = context.window.escapeHtml;
  context.cleanUserText = context.window.cleanUserText;
  context.isValidIsoDate = context.window.isValidIsoDate;
  context.uid = context.window.uid;
  context.safeImageSrc = context.window.safeImageSrc;
  context.sanitizeSettings = context.window.sanitizeSettings;
  context.isValidDataKey = context.window.isValidDataKey;
  context.isAssignedToDrawer = context.window.isAssignedToDrawer;
  context.PharmacyStoragePolicy = context.window.PharmacyStoragePolicy;
  vm.runInContext(script, context, { filename: 'index.html' });
  return context;
}

test('application JavaScript compiles', () => {
  assert.doesNotThrow(() => new vm.Script(fullScript));
});

test('storage policy reports quota failures without throwing', () => {
  const context = makeContext();
  const result = vm.runInContext("PharmacyStoragePolicy.write({setItem(){throw Object.assign(new Error('full'),{name:'QuotaExceededError'})}}, 'x', {ok:true}, ()=>{})", context);
  assert.equal(result, false);
});

test('search normalization handles Arabic variants and whitespace', () => {
  const context = makeContext();
  assert.equal(vm.runInContext("normalizeSearchText('  أَمـوكسيسيلين   500  ')", context), 'امـوكسيسيلين 500');
});

test('date validation rejects impossible dates', () => {
  const context = makeContext();
  assert.equal(vm.runInContext("isValidIsoDate('2028-02-29')", context), true);
  assert.equal(vm.runInContext("isValidIsoDate('2027-02-29')", context), false);
  assert.equal(vm.runInContext("isValidIsoDate('2027-13-01')", context), false);
});

test('embedded seed passes structural validation', () => {
  const context = makeContext();
  assert.equal(vm.runInContext('validateStatePayload(SEED_DATA)', context), true);
});

test('compare-and-swap refuses to overwrite a newer server revision', async () => {
  const context = makeContext();
  vm.runInContext(`
    data={'1A':{name:'TEST',expiries:['2028-01-01'],types:[],oos:false,shelf:false,notes:''}};
    shelves=[];oosManual=[];settings={warnDays:30,critDays:7};theme='dark';
    sbConnected=true;sbUserRole='writer';sbStateRevision=2;sbStateHasRevision=true;sbConflict=null;
    sbFetch=async(path,opts)=>opts&&opts.method==='PATCH'?[]:[{payload:{revision:3,data:{},shelves:[],oosManual:[],settings:{},theme:'dark'}}];
  `, context);
  await assert.rejects(vm.runInContext('saveOneSnapshot()', context), /تعارض إصدار/);
  assert.equal(vm.runInContext('sbStateRevision', context), 2);
  assert.equal(vm.runInContext("sbConflict.type", context), 'revision');
});

test('confirmed save increments the revision exactly once', async () => {
  const context = makeContext();
  vm.runInContext(`
    data={'1A':{name:'TEST',expiries:['2028-01-01'],types:[],oos:false,shelf:false,notes:''}};
    shelves=[];oosManual=[];settings={warnDays:30,critDays:7};theme='dark';
    sbConnected=true;sbUserRole='writer';sbStateRevision=7;sbStateHasRevision=true;sbConflict=null;
    sbFetch=async(path,opts)=>[{payload:JSON.parse(opts.body).payload}];
  `, context);
  await vm.runInContext('saveOneSnapshot()', context);
  assert.equal(vm.runInContext('sbStateRevision', context), 8);
  assert.equal(vm.runInContext('sbDirty', context), false);
});

test('shelf search finds drug names and drawer positions', () => {
  const context = makeContext();
  vm.runInContext(`data={'51A':{name:'WARFARIN TABLET 5 MG',expiries:['2027-02-28'],types:[],oos:false,shelf:true,notes:''}}`, context);
  assert.equal(vm.runInContext("shelfHasSearchMatch({name:'الدرج الكبير',cols:5,rows:4,startNum:51},normalizeSearchText('warfarin'))", context), true);
  assert.equal(vm.runInContext("shelfHasSearchMatch({name:'الدرج الكبير',cols:5,rows:4,startNum:51},normalizeSearchText('A51'))", context), true);
  assert.equal(vm.runInContext("shelfHasSearchMatch({name:'الدرج الكبير',cols:5,rows:4,startNum:51},normalizeSearchText('metformin'))", context), false);
});

test('move and assign dialogs support all shelf rows A-F', () => {
  assert.match(html, /id="moveTargetSlot"[\s\S]*?<option value="F">F<\/option>/);
  assert.match(html, /id="assignTargetSlot"[\s\S]*?<option value="F">F<\/option>/);
});

test('legacy client-side password gate is not executable', () => {
  assert.doesNotMatch(html, /id="writeAuthModal"|id="securitySettingsModal"/);
  assert.doesNotMatch(html, /"writePassword":"asmd"/);
  assert.doesNotMatch(fullScript, /function _writeAuthSubmit|function saveSecuritySettings/);
  assert.match(fullScript, /\['writer','admin'\]\.includes\(sbUserRole\)/);
  const context = makeContext();
  assert.equal(vm.runInContext("sanitizeSettings({writePassword:'legacy'}).writePassword", context), undefined);
});

test('state validation rejects unsafe shelf images', () => {
  const context = makeContext();
  assert.equal(vm.runInContext(`validateStatePayload({
    data:{'1A':{name:'TEST',expiries:[],types:[]}},
    shelves:[{id:'safe_id',name:'Shelf',cols:1,rows:1,photo:'javascript:alert(1)'}],
    oosManual:[]
  })`, context), false);
});

test('content security policy blocks objects and base URL injection', () => {
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /object-src 'none'/);
  assert.match(html, /base-uri 'none'/);
});

test('invite and recovery callbacks require both session tokens', () => {
  const context = makeContext();
  assert.equal(vm.runInContext("location.hash='#type=invite&access_token=a';handleAuthCallback()", context), false);
  assert.equal(vm.runInContext("location.hash='#type=invite&access_token=a&refresh_token=r&expires_in=3600';handleAuthCallback()", context), true);
  assert.equal(vm.runInContext("sbPasswordSetupSession.type", context), 'invite');
  assert.equal(vm.runInContext("JSON.parse(sessionStorage.getItem(SB_PASSWORD_SETUP_KEY)).accessToken", context), 'a');
  assert.equal(vm.runInContext("history.replaced", context), '/');
  vm.runInContext("sbPasswordSetupSession=null", context);
  assert.equal(vm.runInContext("restorePasswordSetupSession()", context), true);
  assert.equal(vm.runInContext("sbPasswordSetupSession.refreshToken", context), 'r');
});

test('password reset returns to the current deployed page', () => {
  const context = makeContext();
  assert.equal(vm.runInContext('passwordResetRedirectUrl()', context), 'https://preview.example/');
});
