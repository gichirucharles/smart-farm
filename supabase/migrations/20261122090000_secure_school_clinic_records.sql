alter table public.health_records
  add column if not exists school_id uuid references public.schools(id) on delete cascade,
  add column if not exists time_in timestamptz not null default now(),
  add column if not exists time_out timestamptz,
  add column if not exists status text not null default 'discharged',
  add column if not exists temperature numeric(4,1),
  add column if not exists notes text;

update public.health_records as record
set school_id = student.school_id
from public.students as student
where record.student_id = student.id
  and record.school_id is null;

alter table public.health_records
  drop constraint if exists health_records_status_check;
alter table public.health_records
  add constraint health_records_status_check
  check (status in ('under_observation', 'discharged'));
alter table public.health_records
  drop constraint if exists health_records_temperature_check;
alter table public.health_records
  add constraint health_records_temperature_check
  check (temperature is null or temperature between 25 and 45);

create index if not exists health_records_school_visit_idx
  on public.health_records (school_id, visit_date desc);
create index if not exists health_records_school_status_idx
  on public.health_records (school_id, status, time_in desc);

alter table public.counseling_sessions
  add column if not exists school_id uuid references public.schools(id) on delete cascade;
update public.counseling_sessions as session
set school_id = student.school_id
from public.students as student
where session.student_id = student.id
  and session.school_id is null;
create index if not exists counseling_sessions_school_student_date_idx
  on public.counseling_sessions (school_id, student_id, session_date desc);

create table if not exists public.clinic_checkups (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  scheduled_at timestamptz not null,
  checkup_type text not null check (char_length(checkup_type) between 1 and 120),
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'no_show', 'cancelled')),
  notes text check (notes is null or char_length(notes) <= 3000),
  outcome text check (outcome is null or char_length(outcome) <= 3000),
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clinic_checkups_school_time_idx
  on public.clinic_checkups (school_id, scheduled_at desc);
create index if not exists clinic_checkups_school_status_idx
  on public.clinic_checkups (school_id, status, scheduled_at);

create table if not exists public.clinic_medications (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  medication_name text not null check (char_length(medication_name) between 1 and 160),
  dosage text not null check (char_length(dosage) between 1 and 120),
  frequency text not null check (char_length(frequency) between 1 and 120),
  start_date date not null default current_date,
  end_date date,
  status text not null default 'active' check (status in ('active', 'completed', 'discontinued')),
  administration_notes text check (administration_notes is null or char_length(administration_notes) <= 2000),
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);
create index if not exists clinic_medications_school_status_idx
  on public.clinic_medications (school_id, status, student_id);

create table if not exists public.clinic_medication_administrations (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  medication_id uuid not null references public.clinic_medications(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  administered_at timestamptz not null default now(),
  dosage text not null check (char_length(dosage) between 1 and 120),
  notes text check (notes is null or char_length(notes) <= 1000),
  administered_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists clinic_medication_administrations_school_time_idx
  on public.clinic_medication_administrations (school_id, administered_at desc);
create index if not exists clinic_medication_administrations_medication_idx
  on public.clinic_medication_administrations (school_id, medication_id, administered_at desc);

alter table public.health_records enable row level security;
alter table public.counseling_sessions enable row level security;
alter table public.clinic_checkups enable row level security;
alter table public.clinic_medications enable row level security;
alter table public.clinic_medication_administrations enable row level security;

revoke all on public.health_records, public.counseling_sessions,
  public.clinic_checkups, public.clinic_medications,
  public.clinic_medication_administrations from anon, authenticated;
grant select, insert, update, delete on public.health_records, public.counseling_sessions,
  public.clinic_checkups, public.clinic_medications,
  public.clinic_medication_administrations to service_role;
