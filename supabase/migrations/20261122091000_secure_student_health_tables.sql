alter table public.student_health_profiles enable row level security;
alter table public.student_teacher_health_flags enable row level security;

revoke all on public.student_health_profiles, public.student_teacher_health_flags from anon, authenticated;
grant select, insert, update, delete on public.student_health_profiles, public.student_teacher_health_flags to service_role;
