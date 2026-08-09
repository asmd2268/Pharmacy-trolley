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
