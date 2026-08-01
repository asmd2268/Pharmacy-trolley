-- Emergency access rollback for the legacy UI. Use only if production must be
-- rolled back after security_cutover.sql. This does not remove audit history or
-- authenticated access; it temporarily restores the minimum legacy anon grants.

begin;

grant select, update on public.pharmacy_state to anon;
grant select, insert, delete on public.pharmacy_backups to anon;

commit;

-- Existing legacy RLS policies are intentionally not removed by the preparation
-- migration, so these grants restore the previous client access during rollback.
