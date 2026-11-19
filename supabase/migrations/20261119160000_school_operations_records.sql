create table if not exists public.school_operations_records (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  category text not null check (category in ('assets', 'library', 'laboratories', 'stores', 'infrastructure', 'maintenance', 'safety', 'land', 'transport', 'boarding', 'meals')),
  record_type text not null,
  name text not null check (length(trim(name)) between 1 and 180),
  location text,
  status text not null default 'active',
  quantity numeric(12,2),
  due_date date,
  details jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists school_operations_records_school_category_idx
  on public.school_operations_records (school_id, category, created_at desc);

create index if not exists school_operations_records_school_due_date_idx
  on public.school_operations_records (school_id, due_date)
  where due_date is not null;

alter table public.school_operations_records enable row level security;
revoke all on public.school_operations_records from public, anon, authenticated;
grant select, insert, update, delete on public.school_operations_records to service_role;
