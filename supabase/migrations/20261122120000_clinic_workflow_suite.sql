begin;
create table if not exists public.clinic_inventory (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 item_name text not null check (char_length(item_name) between 1 and 160), category text not null default 'Medical supplies',
 unit text not null default 'units', quantity numeric(12,2) not null default 0 check (quantity >= 0),
 reorder_level numeric(12,2) not null default 0 check (reorder_level >= 0), unit_cost numeric(12,2) check (unit_cost is null or unit_cost >= 0),
 expiry_date date, supplier text, updated_by uuid references public.users(id) on delete set null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists clinic_inventory_school_name_idx on public.clinic_inventory(school_id,item_name);
create table if not exists public.clinic_inventory_movements (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 item_id uuid not null references public.clinic_inventory(id) on delete cascade, movement_type text not null check (movement_type in ('restock','dispense','adjustment')),
 quantity numeric(12,2) not null check (quantity > 0), reference text, recorded_by uuid references public.users(id) on delete set null, created_at timestamptz not null default now()
);
create index if not exists clinic_inventory_movements_school_time_idx on public.clinic_inventory_movements(school_id,created_at desc);
create table if not exists public.clinic_screening_campaigns (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 title text not null check (char_length(title) between 1 and 160), screening_type text not null check (char_length(screening_type) between 1 and 120),
 target_group text not null default 'All students', starts_at date not null, ends_at date, status text not null default 'planned' check (status in ('planned','active','completed','cancelled')),
 notes text, created_by uuid references public.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (ends_at is null or ends_at >= starts_at)
);
create table if not exists public.clinic_screening_results (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 campaign_id uuid not null references public.clinic_screening_campaigns(id) on delete cascade, student_id uuid not null references public.students(id) on delete cascade,
 result text not null check (char_length(result) between 1 and 2000), follow_up_required boolean not null default false, recorded_by uuid references public.users(id) on delete set null, screened_at timestamptz not null default now(), unique(campaign_id,student_id)
);
create table if not exists public.clinic_referrals (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade, student_id uuid not null references public.students(id) on delete cascade,
 destination text not null check (char_length(destination) between 1 and 200), reason text not null check (char_length(reason) between 1 and 2000), referred_at timestamptz not null default now(),
 status text not null default 'pending' check (status in ('pending','appointment_booked','completed','cancelled')), follow_up_date date, outcome text,
 parent_notified_at timestamptz, created_by uuid references public.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.clinic_staff_incidents (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade, reported_by uuid not null references public.users(id) on delete cascade,
 incident_date timestamptz not null default now(), category text not null check (char_length(category) between 1 and 120), description text not null check (char_length(description) between 1 and 3000),
 action_taken text, requires_follow_up boolean not null default false, status text not null default 'open' check (status in ('open','under_review','closed')), created_at timestamptz not null default now()
);
create table if not exists public.clinic_guardian_consents (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade, student_id uuid not null references public.students(id) on delete cascade,
 guardian_email text not null, purpose text not null check (char_length(purpose) between 1 and 160), details text, status text not null default 'pending' check (status in ('pending','granted','declined','withdrawn')),
 requested_by uuid references public.users(id) on delete set null, responded_at timestamptz, response_note text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists clinic_guardian_consents_email_idx on public.clinic_guardian_consents(school_id,guardian_email,status);
create table if not exists public.clinic_workflow_tasks (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade, student_id uuid references public.students(id) on delete set null,
 recipient_role text not null check (recipient_role in ('parent','class_teacher','head_teacher','director','accountant','school_counselor','school_nurse')),
 recipient_email text, category text not null check (category in ('parent_update','leadership_review','finance_request','counseling_referral','teacher_support','clinic_follow_up')),
 title text not null check (char_length(title) between 1 and 160), summary text not null check (char_length(summary) between 1 and 1200),
 status text not null default 'open' check (status in ('open','acknowledged','completed')), created_by uuid references public.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists clinic_workflow_tasks_school_role_idx on public.clinic_workflow_tasks(school_id,recipient_role,status,created_at desc);
create index if not exists clinic_referrals_school_status_idx on public.clinic_referrals(school_id,status,referred_at desc);
create index if not exists clinic_screening_results_school_campaign_idx on public.clinic_screening_results(school_id,campaign_id,screened_at desc);
do $$ declare t text; begin foreach t in array array['clinic_inventory','clinic_inventory_movements','clinic_screening_campaigns','clinic_screening_results','clinic_referrals','clinic_staff_incidents','clinic_guardian_consents','clinic_workflow_tasks'] loop execute format('alter table public.%I enable row level security',t); execute format('revoke all on public.%I from anon, authenticated',t); execute format('grant select,insert,update,delete on public.%I to service_role',t); end loop; end $$;
commit;
