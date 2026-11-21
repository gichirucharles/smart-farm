create table if not exists public.class_teacher_entries (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid references public.students(id) on delete set null,
  category text not null check (category in ('remark', 'incident', 'referral', 'parent_message', 'meeting_request', 'announcement', 'duty', 'leave_request', 'report_comment')),
  title text not null check (char_length(title) between 1 and 160),
  body text not null check (char_length(body) between 1 and 4000),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  visible_to_parent boolean not null default false,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists class_teacher_entries_school_class_date_idx
  on public.class_teacher_entries (school_id, class_id, created_at desc);
create index if not exists class_teacher_entries_student_idx
  on public.class_teacher_entries (school_id, student_id, created_at desc);

alter table public.class_teacher_entries enable row level security;
revoke all on public.class_teacher_entries from anon, authenticated;
grant select, insert, update, delete on public.class_teacher_entries to service_role;
