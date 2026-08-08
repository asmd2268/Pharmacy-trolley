-- Durable dispensing/operations ledger used by annual and quarterly reports.
begin;
create table if not exists public.pharmacy_operations (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  operation_type text not null check (operation_type in ('dispense','receive','return','adjustment','crash_cart')),
  drug_key text not null,
  drug_name text not null,
  quantity numeric not null check (quantity > 0),
  department text not null,
  is_high_alert boolean not null default false,
  reference text,
  notes text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
alter table public.pharmacy_operations enable row level security;
revoke all on public.pharmacy_operations from public, anon, authenticated;
grant select, insert on public.pharmacy_operations to authenticated;
create policy pharmacy_operations_read on public.pharmacy_operations for select to authenticated using (public.pharmacy_has_role(array['reader','writer','admin']));
create policy pharmacy_operations_insert on public.pharmacy_operations for insert to authenticated with check (created_by=auth.uid() and public.pharmacy_has_role(array['writer','admin']));
create index if not exists pharmacy_operations_occurred_at_idx on public.pharmacy_operations(occurred_at);
create index if not exists pharmacy_operations_department_idx on public.pharmacy_operations(department);
create index if not exists pharmacy_operations_drug_idx on public.pharmacy_operations(drug_key);
commit;
