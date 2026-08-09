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

test('architecture modules load before the main application script', () => {
  const main = html.indexOf('<script>');
  assert.ok(main > 0, 'main inline script should exist');
  const required = ['./architecture/date-policy.js','./architecture/text-helpers.js','./architecture/search-helpers.js','./architecture/validation-policy.js'];
  for (const src of required) assert.ok(html.indexOf(src) < main, `${src} must load before the application`);
});

test('main application does not define duplicate named functions', () => {
  const counts = new Map();
  for (const match of html.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)) {
    counts.set(match[1], (counts.get(match[1]) || 0) + 1);
  }
  const duplicates = [...counts].filter(([, count]) => count > 1).map(([name]) => name);
  assert.deepEqual(duplicates, []);
});

test('application and architecture modules avoid Math.random for identifiers', async () => {
  const files = await readdir(new URL('../architecture', import.meta.url));
  const modules = await Promise.all(files.filter(f => f.endsWith('.js')).map(f => readFile(new URL(`../architecture/${f}`, import.meta.url), 'utf8')));
  assert.equal(`${html}\n${modules.join('\n')}`.includes('Math.random'), false);
});
