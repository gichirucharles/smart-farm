create table if not exists public.student_welfare_records (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  record_type text not null check (record_type in ('committee_outcome', 'suspension', 'expulsion', 'safeguarding', 'commendation')),
  event_date date not null default current_date,
  title text not null check (char_length(title) between 1 and 160),
  description text not null check (char_length(description) between 1 and 5000),
  action_taken text check (action_taken is null or char_length(action_taken) <= 3000),
  reason text check (reason is null or char_length(reason) <= 3000),
  outcome text check (outcome is null or char_length(outcome) <= 3000),
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists student_welfare_records_school_date_idx
  on public.student_welfare_records (school_id, event_date desc);

create index if not exists student_welfare_records_student_idx
  on public.student_welfare_records (school_id, student_id, event_date desc);

alter table public.student_welfare_records enable row level security;
revoke all on public.student_welfare_records from anon, authenticated;
grant select, insert, update, delete on public.student_welfare_records to service_role;
