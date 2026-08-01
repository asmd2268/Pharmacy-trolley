-- Phase 2 (production cutover): run only after the authenticated production UI
-- is deployed and a writer/admin account has completed an end-to-end preview test.

begin;

revoke all on public.pharmacy_state from public, anon;
revoke all on public.pharmacy_backups from public, anon;

commit;

-- Verification queries (expected: no rows granting privileges to anon/public):
-- select grantee, privilege_type from information_schema.role_table_grants
-- where table_schema = 'public'
--   and table_name in ('pharmacy_state','pharmacy_backups')
--   and grantee in ('anon','PUBLIC');
