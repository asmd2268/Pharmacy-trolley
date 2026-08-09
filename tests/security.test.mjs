import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const prepare = await readFile(new URL('../supabase/security_migration.sql', import.meta.url), 'utf8');
const cutover = await readFile(new URL('../supabase/security_cutover.sql', import.meta.url), 'utf8');
const rollback = await readFile(new URL('../supabase/security_rollback.sql', import.meta.url), 'utf8');
const appHtml = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const vercelConfig = await readFile(new URL('../vercel.json', import.meta.url), 'utf8');

test('identifier generation does not use Math.random', () => {
  assert.doesNotMatch(appHtml, /Math\.random\s*\(/);
  assert.match(appHtml, /getRandomValues/);
});

test('hosting security headers are enforced', () => {
  assert.match(vercelConfig, /frame-ancestors 'none'/);
  assert.match(vercelConfig, /X-Content-Type-Options/);
  assert.match(vercelConfig, /Strict-Transport-Security/);
  assert.match(vercelConfig, /Permissions-Policy/);
  assert.match(vercelConfig, /microphone=\(self\)/);
});

test('preparation does not revoke production anonymous access', () => {
  assert.doesNotMatch(prepare, /revoke all on public\.pharmacy_(?:state|backups) from [^;]*(?:anon|public)/i);
  assert.match(prepare, /create table if not exists public\.app_users/i);
  assert.match(prepare, /create trigger pharmacy_state_archive_before_update/i);
});

test('cutover revokes anonymous state and backup access atomically', () => {
  assert.match(cutover, /begin;[\s\S]*revoke all on public\.pharmacy_state from public, anon;[\s\S]*revoke all on public\.pharmacy_backups from public, anon;[\s\S]*commit;/i);
});

test('rollback restores only minimum legacy table grants', () => {
  assert.match(rollback, /grant select, update on public\.pharmacy_state to anon;/i);
  assert.match(rollback, /grant select, insert, delete on public\.pharmacy_backups to anon;/i);
  assert.doesNotMatch(rollback, /service_role|app_users|pharmacy_state_history/i);
});
