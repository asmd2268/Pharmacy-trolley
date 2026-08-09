import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

function load(file) {
  const context = { window: {}, document: { addEventListener() {} }, setInterval, clearInterval };
  vm.runInNewContext(fs.readFileSync(path.join('architecture', file), 'utf8'), context);
  return context.window;
}
const plain = value => JSON.parse(JSON.stringify(value));

test('text policy normalizes Arabic and escapes HTML', () => {
  const api = load('text-policy.js').PharmacyTextPolicy;
  assert.equal(api.normalize('  إِسْمُ الدَّواء  '), 'اسم الدواء');
  assert.equal(api.escape('<img "x">'), '&lt;img &quot;x&quot;&gt;');
});

test('date policy rejects impossible dates and formats valid ones', () => {
  const api = load('date-policy.js').PharmacyDatePolicy;
  assert.equal(api.isIsoDate('2024-02-29'), true);
  assert.equal(api.isIsoDate('2023-02-29'), false);
  assert.equal(api.format('2026-08-09'), '09/08/2026');
});

test('shelf operations are immutable', () => {
  const api = load('shelf-operations.js').PharmacyShelfOperations.create();
  const original = [{id: 's1', name: 'A'}];
  assert.deepEqual(plain(api.add(original, {id: 's2'})), [{id: 's1', name: 'A'}, {id: 's2'}]);
  assert.deepEqual(plain(api.update(original, 's1', {name: 'B'})), [{id: 's1', name: 'B'}]);
  assert.deepEqual(plain(api.remove(original, 's1')), []);
  assert.deepEqual(original, [{id: 's1', name: 'A'}]);
});

test('backup policy keeps the newest thirty records', () => {
  const api = load('backup-policy.js').PharmacyBackupPolicy;
  const rows = Array.from({length: 31}, (_, i) => ({id: String(i), created_at: `2026-01-${String(i + 1).padStart(2, '0')}`}));
  assert.equal(api.keepLatest(rows).length, 30);
  assert.equal(api.staleRows(rows).length, 1);
});

test('medication operations preserve records without mutating input', () => {
  const api = load('medication-operations.js').PharmacyMedicationOperations;
  const original = {a: api.createRecord(' Drug A ', {shelf: true, extra: true, drawerNum: null, drawerSlot: null})};
  assert.equal(original.a.name, 'Drug A');
  assert.equal(original.a.extra, true);
  const moved = api.assign(original, 'a', '51A');
  assert.equal(moved['51A'].name, 'Drug A');
  assert.equal(original.a.name, 'Drug A');
  const unassigned = api.unassign(moved, '51A', 'x_1');
  assert.equal(unassigned['x_1'].extra, true);
  assert.equal(unassigned['x_1'].drawerNum, null);
  const imported = api.fromRaw({name: 'Drug B', expiries: 'bad', types: ['hazard'], extra: true});
  assert.deepEqual(plain(imported.expiries), []);
  assert.equal(imported.extra, true);
  const changed = api.update(moved, '51A', {types: ['lasa']});
  assert.deepEqual(plain(changed['51A'].types), ['lasa']);
  assert.deepEqual(plain(moved['51A'].types), []);
  assert.deepEqual(plain(api.remove(moved, '51A')), {});
});
