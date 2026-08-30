-- Audit log table: records every user-initiated change (add, edit, delete, move, etc.)
-- Run this after security_migration.sql has been applied.

begin;

create table if not exists public.pharmacy_audit_log (
  id bigint generated always as identity primary key,
  action text not null,           -- e.g. 'add_drug', 'edit_drug', 'delete_drug', 'move_drug', ...
  drug_key text,                  -- the data key affected (e.g. '12A', 'x_abc123')
  drug_name text,                 -- human-readable drug name at time of action
  details jsonb default '{}'::jsonb,  -- action-specific details (before/after, target, etc.)
  performed_by uuid references auth.users(id),
  performed_at timestamptz not null default now()
);

alter table public.pharmacy_audit_log enable row level security;
revoke all on public.pharmacy_audit_log from public, anon, authenticated;
grant select, insert on public.pharmacy_audit_log to authenticated;

-- All authenticated users with any role can read audit logs
drop policy if exists audit_log_read on public.pharmacy_audit_log;
create policy audit_log_read on public.pharmacy_audit_log
  for select to authenticated
  using (public.pharmacy_has_role(array['reader','writer','admin']));

-- Writers and admins can insert audit entries
drop policy if exists audit_log_insert on public.pharmacy_audit_log;
create policy audit_log_insert on public.pharmacy_audit_log
  for insert to authenticated
  with check (public.pharmacy_has_role(array['writer','admin']));

-- Only admins can delete audit entries (cleanup)
drop policy if exists audit_log_delete on public.pharmacy_audit_log;
create policy audit_log_delete on public.pharmacy_audit_log
  for delete to authenticated
  using (public.pharmacy_has_role(array['admin']));

-- Index for fast queries by time and action type
create index if not exists idx_audit_log_performed_at on public.pharmacy_audit_log(performed_at desc);
create index if not exists idx_audit_log_action on public.pharmacy_audit_log(action);

commit;
