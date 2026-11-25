-- =====================================================================
-- Maaz AI Wala — platform upgrade
-- Bookings, testimonials, client documents, staff roles, activity logs,
-- richer service / portfolio content, deployment status.
-- Run AFTER 20261121000001_init.sql.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Richer service & portfolio content
-- ---------------------------------------------------------------------
alter table public.services
  add column if not exists category     text   not null default 'Automation' check (char_length(category) <= 60),
  add column if not exists problem      text   not null default '' check (char_length(problem) <= 2000),
  add column if not exists how_it_works text[] not null default '{}',
  add column if not exists use_cases    text[] not null default '{}',
  add column if not exists integrations text[] not null default '{}',
  add column if not exists faqs         jsonb  not null default '[]'::jsonb;

alter table public.portfolio_projects
  add column if not exists workflow_steps text[] not null default '{}',
  add column if not exists summary        text   not null default '' check (char_length(summary) <= 600);

alter table public.projects
  add column if not exists deployment_status text not null default 'not_started'
    check (deployment_status in ('not_started', 'building', 'testing', 'deployed', 'paused'));

alter table public.contact_messages
  add column if not exists budget text check (char_length(budget) <= 80),
  add column if not exists phone  text check (char_length(phone) <= 40);

-- ---------------------------------------------------------------------
-- Consultation bookings
-- ---------------------------------------------------------------------
create table public.bookings (
  id                uuid primary key default gen_random_uuid(),
  reference         text not null unique default ('BK-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  -- Secret token in the confirmation email that lets the customer reschedule/cancel without an account.
  manage_token      text not null unique default encode(gen_random_bytes(24), 'hex'),
  user_id           uuid references public.profiles (id) on delete set null,
  full_name         text not null check (char_length(full_name) between 2 and 120),
  email             text not null check (char_length(email) <= 254),
  phone             text check (char_length(phone) <= 40),
  company           text check (char_length(company) <= 160),
  service           text not null check (char_length(service) <= 120),
  requirements      text not null check (char_length(requirements) between 10 and 5000),
  starts_at         timestamptz not null,
  ends_at           timestamptz not null check (ends_at > starts_at),
  status            text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'completed', 'no_show')),
  calendar_event_id text check (char_length(calendar_event_id) <= 200),
  reminder_sent_at  timestamptz,
  admin_notes       text check (char_length(admin_notes) <= 5000),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
-- A slot can only hold ONE confirmed booking (prevents double booking, even under race conditions).
create unique index bookings_slot_uniq on public.bookings (starts_at) where status = 'confirmed';
create index bookings_starts_idx on public.bookings (starts_at);
create index bookings_email_idx on public.bookings (lower(email));
create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Testimonials (only verified + published ones are public)
-- ---------------------------------------------------------------------
create table public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  author_name   text not null check (char_length(author_name) between 2 and 120),
  author_role   text check (char_length(author_role) <= 120),
  company       text check (char_length(company) <= 160),
  quote         text not null check (char_length(quote) between 10 and 1500),
  rating        integer check (rating between 1 and 5),
  project_id    uuid references public.projects (id) on delete set null,
  is_verified   boolean not null default false,
  is_published  boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Client documents & reports (files live in the PRIVATE "documents" bucket)
-- ---------------------------------------------------------------------
create table public.documents (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references public.projects (id) on delete cascade,
  title             text not null check (char_length(title) between 1 and 200),
  kind              text not null default 'document' check (kind in ('document', 'report', 'invoice', 'deliverable')),
  storage_path      text not null unique check (char_length(storage_path) <= 500),
  file_size         bigint check (file_size >= 0),
  mime_type         text check (char_length(mime_type) <= 120),
  visible_to_client boolean not null default true,
  uploaded_by       uuid references public.profiles (id) on delete set null,
  created_at        timestamptz not null default now()
);
create index documents_project_idx on public.documents (project_id, created_at desc);

-- ---------------------------------------------------------------------
-- Staff roles (owner = ADMIN_EMAIL env var; staff are added by the owner)
-- ---------------------------------------------------------------------
create table public.staff_roles (
  email      text primary key check (email = lower(email) and char_length(email) <= 254),
  role       text not null check (role in ('manager', 'support')),
  created_by text,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_email text not null,
  action      text not null check (char_length(action) <= 80),
  entity      text check (char_length(entity) <= 60),
  entity_id   text check (char_length(entity_id) <= 80),
  details     jsonb,
  created_at  timestamptz not null default now()
);
create index activity_logs_created_idx on public.activity_logs (created_at desc);

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.bookings      enable row level security;
alter table public.testimonials  enable row level security;
alter table public.documents     enable row level security;
alter table public.staff_roles   enable row level security;
alter table public.activity_logs enable row level security;

create policy "Public can read verified published testimonials" on public.testimonials
  for select to anon, authenticated using (is_published and is_verified);

-- Signed-in users see bookings made with their account or their verified email.
create policy "Users read own bookings" on public.bookings
  for select to authenticated using (
    user_id = auth.uid()
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "Clients read own visible documents" on public.documents
  for select to authenticated using (
    visible_to_client
    and exists (select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid())
  );
-- staff_roles, activity_logs: no policies => server (service role) only.

-- Private bucket for client documents. Downloads use short-lived signed URLs
-- created on the server AFTER an ownership check.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;
