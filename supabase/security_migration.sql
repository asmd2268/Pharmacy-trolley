-- Review and run in a controlled maintenance window before deploying the new UI.
-- This migration replaces public anonymous writes with authenticated, role-based access.

begin;

create table if not exists public.app_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('reader', 'writer', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.app_users enable row level security;
revoke all on public.app_users from public, anon, authenticated;
grant select on public.app_users to authenticated;

drop policy if exists app_users_read_self on public.app_users;
create policy app_users_read_self on public.app_users
  for select to authenticated
  using (user_id = auth.uid() and active);

create or replace function public.pharmacy_has_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.app_users
    where user_id = auth.uid() and active and role = any(allowed_roles)
  );
$$;

revoke all on function public.pharmacy_has_role(text[]) from public;
grant execute on function public.pharmacy_has_role(text[]) to authenticated;

alter table public.pharmacy_state enable row level security;
alter table public.pharmacy_backups enable row level security;

revoke all on public.pharmacy_state from public, anon, authenticated;
revoke all on public.pharmacy_backups from public, anon, authenticated;
grant select on public.pharmacy_state to authenticated;
grant insert, update on public.pharmacy_state to authenticated;
grant select, insert on public.pharmacy_backups to authenticated;
grant delete on public.pharmacy_backups to authenticated;

drop policy if exists pharmacy_state_read on public.pharmacy_state;
drop policy if exists pharmacy_state_insert on public.pharmacy_state;
drop policy if exists pharmacy_state_update on public.pharmacy_state;
drop policy if exists pharmacy_backups_read on public.pharmacy_backups;
drop policy if exists pharmacy_backups_insert on public.pharmacy_backups;
drop policy if exists pharmacy_backups_delete on public.pharmacy_backups;

create policy pharmacy_state_read on public.pharmacy_state
  for select to authenticated
  using (public.pharmacy_has_role(array['reader','writer','admin']));

create policy pharmacy_state_insert on public.pharmacy_state
  for insert to authenticated
  with check (id = 1 and public.pharmacy_has_role(array['admin']));

create policy pharmacy_state_update on public.pharmacy_state
  for update to authenticated
  using (id = 1 and public.pharmacy_has_role(array['writer','admin']))
  with check (id = 1 and public.pharmacy_has_role(array['writer','admin']));

create policy pharmacy_backups_read on public.pharmacy_backups
  for select to authenticated
  using (public.pharmacy_has_role(array['reader','writer','admin']));

create policy pharmacy_backups_insert on public.pharmacy_backups
  for insert to authenticated
  with check (public.pharmacy_has_role(array['writer','admin']));

create policy pharmacy_backups_delete on public.pharmacy_backups
  for delete to authenticated
  using (public.pharmacy_has_role(array['admin']));

create table if not exists public.pharmacy_state_history (
  audit_id bigint generated always as identity primary key,
  state_id bigint not null,
  revision bigint,
  payload jsonb not null,
  changed_by uuid,
  changed_at timestamptz not null default now()
);

alter table public.pharmacy_state_history enable row level security;
revoke all on public.pharmacy_state_history from public, anon, authenticated;
grant select on public.pharmacy_state_history to authenticated;

drop policy if exists pharmacy_history_read on public.pharmacy_state_history;
create policy pharmacy_history_read on public.pharmacy_state_history
  for select to authenticated
  using (public.pharmacy_has_role(array['admin']));

create or replace function public.archive_pharmacy_state()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.pharmacy_state_history(state_id, revision, payload, changed_by)
  values (
    old.id,
    case when old.payload->>'revision' ~ '^\d+$' then (old.payload->>'revision')::bigint else null end,
    old.payload,
    auth.uid()
  );
  return new;
end;
$$;

drop trigger if exists pharmacy_state_archive_before_update on public.pharmacy_state;
create trigger pharmacy_state_archive_before_update
before update on public.pharmacy_state
for each row execute function public.archive_pharmacy_state();

commit;

-- After creating the first Supabase Auth user, bootstrap exactly one administrator:
-- insert into public.app_users(user_id, role)
-- select id, 'admin' from auth.users where email = 'REPLACE_WITH_ADMIN_EMAIL';
