begin;

create table public.teaching_schemes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  teacher_id uuid not null references public.users(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  academic_year text not null check (char_length(trim(academic_year)) between 1 and 20),
  term text not null check (char_length(trim(term)) between 1 and 30),
  title text not null check (char_length(trim(title)) between 1 and 160),
  unit_title text not null check (char_length(trim(unit_title)) between 1 and 160),
  week_start smallint not null check (week_start between 1 and 60),
  week_end smallint not null check (week_end between week_start and 60),
  learning_outcomes text not null default '',
  content_outline text not null default '',
  resources text not null default '',
  status text not null default 'draft' check (status in ('draft', 'submitted', 'approved', 'returned')),
  reviewer_id uuid references public.users(id) on delete set null,
  review_feedback text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_plans (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  teacher_id uuid not null references public.users(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  scheme_id uuid references public.teaching_schemes(id) on delete set null,
  academic_year text not null check (char_length(trim(academic_year)) between 1 and 20),
  term text not null check (char_length(trim(term)) between 1 and 30),
  lesson_date date not null,
  week_number smallint check (week_number between 1 and 60),
  lesson_number smallint check (lesson_number between 1 and 20),
  topic text not null check (char_length(trim(topic)) between 1 and 160),
  learning_objectives text not null default '',
  activities text not null default '',
  resources text not null default '',
  assessment_notes text not null default '',
  status text not null default 'draft' check (status in ('draft', 'submitted', 'approved', 'returned')),
  reviewer_id uuid references public.users(id) on delete set null,
  review_feedback text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index teaching_schemes_teacher_term_idx on public.teaching_schemes (school_id, teacher_id, academic_year, term, created_at desc);
create index teaching_schemes_class_subject_idx on public.teaching_schemes (school_id, class_id, subject_id, academic_year, term);
create index lesson_plans_teacher_date_idx on public.lesson_plans (school_id, teacher_id, lesson_date desc);
create index lesson_plans_class_subject_idx on public.lesson_plans (school_id, class_id, subject_id, lesson_date desc);
create index lesson_plans_scheme_idx on public.lesson_plans (scheme_id);

alter table public.teaching_schemes enable row level security;
alter table public.lesson_plans enable row level security;
revoke all on public.teaching_schemes, public.lesson_plans from public, anon, authenticated;
grant all on public.teaching_schemes, public.lesson_plans to service_role;

commit;
