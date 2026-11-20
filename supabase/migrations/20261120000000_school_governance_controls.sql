begin;

alter table public.users
  add column if not exists tsc_number text,
  add column if not exists photo_url text;

create table if not exists public.user_school_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  assigned_role text not null check (assigned_role in ('head_teacher','deputy_head_teacher','class_teacher','subject_teacher','accountant','librarian','school_nurse','school_counselor')),
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, school_id, assigned_role)
);
create index if not exists user_school_assignments_school_idx on public.user_school_assignments(school_id, assigned_role);

create table if not exists public.role_module_permissions (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('head_teacher','deputy_head_teacher','class_teacher','subject_teacher','accountant','librarian','school_nurse','school_counselor')),
  module_key text not null,
  access_level text not null default 'view' check (access_level in ('none','view','edit')),
  updated_by uuid references public.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (role, module_key)
);

create table if not exists public.governance_audit_log (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete set null,
  actor_id uuid references public.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary text not null,
  created_at timestamptz not null default now()
);
create index if not exists governance_audit_log_school_created_idx on public.governance_audit_log(school_id, created_at desc);

create table if not exists public.governance_approval_requests (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  request_type text not null check (request_type in ('large_expenditure','staff_hiring','staff_dismissal','fee_change')),
  subject text not null,
  details text not null default '',
  amount numeric(14,2) check (amount is null or amount >= 0),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  requested_by uuid references public.users(id) on delete set null,
  reviewed_by uuid references public.users(id) on delete set null,
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  review_note text
);
create index if not exists governance_approvals_status_idx on public.governance_approval_requests(status, requested_at desc);

create table if not exists public.governance_notification_preferences (
  user_id uuid primary key references public.users(id) on delete cascade,
  preferences jsonb not null default '{"email":true,"in_app":true,"approval_updates":true,"escalations":true,"weekly_digest":false}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_school_assignments enable row level security;
alter table public.role_module_permissions enable row level security;
alter table public.governance_audit_log enable row level security;
alter table public.governance_approval_requests enable row level security;
alter table public.governance_notification_preferences enable row level security;
revoke all on public.user_school_assignments, public.role_module_permissions, public.governance_audit_log, public.governance_approval_requests, public.governance_notification_preferences from public, anon, authenticated;
grant select, insert, update, delete on public.user_school_assignments, public.role_module_permissions, public.governance_audit_log, public.governance_approval_requests, public.governance_notification_preferences to service_role;

commit;
