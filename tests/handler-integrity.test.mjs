import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const names = new Set();
for (const match of html.matchAll(/\b(?:onclick|onchange|oninput|onfocus|onkeydown)="([^"`]*)"/g)) {
  for (const call of match[1].matchAll(/(?:^|[;{])\s*([A-Za-z_$][\w$]*)\s*\(/g)) names.add(call[1]);
}
const files = await readdir(new URL('../architecture', import.meta.url));
const source = html + '\n' + (await Promise.all(files.filter(f => f.endsWith('.js')).map(f => readFile(new URL(`../architecture/${f}`, import.meta.url), 'utf8')))).join('\n');

test('all inline event handlers reference declared application functions', () => {
  const ignored = new Set(['if','setTimeout','setInterval','confirm','alert','close','print','escapeHtml']);
  const missing = [...names].filter(name => !ignored.has(name) && !new RegExp(`(?:function\\s+${name}\\b|(?:const|let|var)\\s+${name}\\s*=)`).test(source));
  assert.deepEqual(missing, []);
});
