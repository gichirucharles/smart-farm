begin;
create table if not exists public.school_finance_accounts (
 id uuid primary key default gen_random_uuid(), school_id uuid not null, name text not null, account_type text not null check (account_type in ('bank','cash','mobile_money','other')), institution text, account_reference text, opening_balance numeric(14,2) not null default 0 check (opening_balance >= 0), is_active boolean not null default true, created_at timestamptz not null default now(), created_by uuid
);
create table if not exists public.school_finance_budgets (
 id uuid primary key default gen_random_uuid(), school_id uuid not null, fiscal_year text not null, period text not null default 'Annual', category text not null, allocated_amount numeric(14,2) not null check (allocated_amount >= 0), notes text, created_at timestamptz not null default now(), created_by uuid, unique(school_id,fiscal_year,period,category)
);
create table if not exists public.school_finance_transactions (
 id uuid primary key default gen_random_uuid(), school_id uuid not null, account_id uuid references public.school_finance_accounts(id), transaction_type text not null check (transaction_type in ('income','expenditure')), category text not null, amount numeric(14,2) not null check (amount > 0), transaction_date date not null default current_date, description text not null, reference text, created_at timestamptz not null default now(), created_by uuid
);
create table if not exists public.school_capitation_grants (
 id uuid primary key default gen_random_uuid(), school_id uuid not null, grant_type text not null check (grant_type in ('FDSE','FDDSE')), amount numeric(14,2) not null check (amount > 0), received_on date not null, reference text, notes text, created_at timestamptz not null default now(), created_by uuid
);
create table if not exists public.school_finance_requisitions (
 id uuid primary key default gen_random_uuid(), school_id uuid not null, requisition_number text not null, requested_by text not null, department text, category text not null, amount numeric(14,2) not null check (amount > 0), purpose text not null, status text not null default 'pending' check (status in ('pending','approved','rejected','ordered')), requested_on date not null default current_date, reviewed_by uuid, reviewed_at timestamptz, review_note text, created_at timestamptz not null default now(), created_by uuid, unique(school_id,requisition_number)
);
create table if not exists public.school_finance_suppliers (
 id uuid primary key default gen_random_uuid(), school_id uuid not null, name text not null, contact_person text, email text, phone text, tax_pin text, is_active boolean not null default true, created_at timestamptz not null default now(), created_by uuid
);
create table if not exists public.school_finance_purchase_orders (
 id uuid primary key default gen_random_uuid(), school_id uuid not null, supplier_id uuid references public.school_finance_suppliers(id), requisition_id uuid references public.school_finance_requisitions(id), order_number text not null, status text not null default 'draft' check (status in ('draft','sent','partially_received','received','cancelled')), amount numeric(14,2) not null check (amount >= 0), ordered_on date not null default current_date, expected_on date, notes text, created_at timestamptz not null default now(), created_by uuid, unique(school_id,order_number)
);
create table if not exists public.school_finance_supplier_invoices (
 id uuid primary key default gen_random_uuid(), school_id uuid not null, supplier_id uuid references public.school_finance_suppliers(id), purchase_order_id uuid references public.school_finance_purchase_orders(id), invoice_number text not null, amount numeric(14,2) not null check (amount > 0), invoice_date date not null, due_date date, status text not null default 'unpaid' check (status in ('unpaid','part_paid','paid','overdue')), paid_amount numeric(14,2) not null default 0 check (paid_amount >= 0 and paid_amount <= amount), created_at timestamptz not null default now(), created_by uuid, unique(school_id,invoice_number)
);
create table if not exists public.school_petty_cash_transactions (
 id uuid primary key default gen_random_uuid(), school_id uuid not null, transaction_type text not null check (transaction_type in ('issue','replenishment')), amount numeric(14,2) not null check (amount > 0), transaction_date date not null default current_date, payee text not null, category text not null, description text not null, voucher_number text, issued_by uuid, received_by text, created_at timestamptz not null default now(), created_by uuid
);
create table if not exists public.school_payroll_summaries (
 id uuid primary key default gen_random_uuid(), school_id uuid not null, pay_period text not null, staff_count integer not null check (staff_count >= 0), gross_pay numeric(14,2) not null check (gross_pay >= 0), deductions numeric(14,2) not null default 0 check (deductions >= 0), net_pay numeric(14,2) not null check (net_pay >= 0), payment_date date, status text not null default 'draft' check (status in ('draft','approved','paid')), notes text, created_at timestamptz not null default now(), created_by uuid, unique(school_id,pay_period)
);
create index if not exists school_finance_transactions_school_date_idx on public.school_finance_transactions(school_id,transaction_date desc);
create index if not exists school_capitation_grants_school_date_idx on public.school_capitation_grants(school_id,received_on desc);
create index if not exists school_finance_requisitions_school_status_idx on public.school_finance_requisitions(school_id,status);
create index if not exists school_finance_supplier_invoices_school_due_idx on public.school_finance_supplier_invoices(school_id,due_date);
do $$ declare t text; begin foreach t in array array['school_finance_accounts','school_finance_budgets','school_finance_transactions','school_capitation_grants','school_finance_requisitions','school_finance_suppliers','school_finance_purchase_orders','school_finance_supplier_invoices','school_petty_cash_transactions','school_payroll_summaries'] loop execute format('alter table public.%I enable row level security',t); execute format('grant select, insert, update, delete on public.%I to service_role',t); end loop; end $$;
commit;
