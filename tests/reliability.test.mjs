import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const fullScript = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
if (!fullScript) throw new Error('Inline application script was not found.');
const script = fullScript.split('let backupSchedulerStarted=false;')[0];

function element() {
  return {
    value: '', textContent: '', innerHTML: '', style: {}, dataset: {}, disabled: false,
    className: '', classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    appendChild() {}, addEventListener() {}, querySelector() { return element(); },
  };
}

function makeContext() {
  const storage = new Map();
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
    window: { addEventListener() {}, print() {} }, navigator: {}, structuredClone,
    setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1,
    Blob, URL, AbortController, fetch: async () => { throw new Error('Unexpected network access in test'); },
    confirm: () => false,
  });
  vm.runInContext(script, context, { filename: 'index.html' });
  return context;
}

test('application JavaScript compiles', () => {
  assert.doesNotThrow(() => new vm.Script(fullScript));
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

test('shelf search explicitly considers drug names', () => {
  assert.match(fullScript, /const shelfHasDrugMatch=shelf=>/);
  assert.match(fullScript, /normalizeSearchText\(item\.name\)\.includes\(q\)/);
});

test('legacy client-side password gate is not executable', () => {
  assert.doesNotMatch(html, /id="writeAuthModal"|id="securitySettingsModal"/);
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
