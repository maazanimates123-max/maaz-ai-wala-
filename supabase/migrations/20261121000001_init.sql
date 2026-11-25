-- =====================================================================
-- Maaz AI Wala — initial schema
-- Target: Supabase (PostgreSQL 15+). Run with `supabase db push` or paste
-- into the Supabase SQL editor.
--
-- Security model
--   * Row Level Security is enabled on EVERY table.
--   * anon / authenticated roles can only read intentionally public content
--     and their OWN private rows.
--   * All admin operations run on the server with the service-role key after
--     the server has verified the signed-in user's email equals ADMIN_EMAIL.
--     The service role bypasses RLS; it is never sent to the browser.
--   * There is no "role" column a user could edit to make themselves admin.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text check (char_length(full_name) <= 120),
  company     text check (char_length(company) <= 160),
  phone       text check (char_length(phone) <= 40),
  avatar_url  text check (char_length(avatar_url) <= 500),
  is_blocked  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index profiles_email_idx on public.profiles (lower(email));
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 120),
    left(new.raw_user_meta_data ->> 'avatar_url', 500)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- True when the calling user is NOT blocked (used inside RLS policies).
create or replace function public.current_user_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_blocked = false
  );
$$;

-- ---------------------------------------------------------------------
-- Public content: services, portfolio, pricing, website settings
-- ---------------------------------------------------------------------
create table public.services (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title             text not null check (char_length(title) between 2 and 120),
  short_description text not null check (char_length(short_description) <= 300),
  description       text not null default '' check (char_length(description) <= 4000),
  benefits          text[] not null default '{}',
  features          text[] not null default '{}',
  use_case          text not null default '' check (char_length(use_case) <= 1500),
  icon              text not null default 'sparkles' check (char_length(icon) <= 40),
  display_order     integer not null default 0,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index services_order_idx on public.services (display_order);
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

create table public.portfolio_projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null check (char_length(title) between 2 and 160),
  category      text not null check (char_length(category) <= 80),
  problem       text not null default '' check (char_length(problem) <= 2000),
  solution      text not null default '' check (char_length(solution) <= 2000),
  technologies  text[] not null default '{}',
  result        text not null default '' check (char_length(result) <= 2000),
  image_url     text check (char_length(image_url) <= 600),
  is_demo       boolean not null default true,
  is_published  boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index portfolio_order_idx on public.portfolio_projects (display_order);
create trigger portfolio_updated_at before update on public.portfolio_projects
  for each row execute function public.set_updated_at();

create table public.pricing_packages (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name               text not null check (char_length(name) between 2 and 80),
  description        text not null default '' check (char_length(description) <= 600),
  price              numeric(12, 2) check (price is null or price >= 0),
  currency           text not null default 'PKR' check (currency ~ '^[A-Z]{3}$'),
  billing_note       text not null default '' check (char_length(billing_note) <= 80),
  features           text[] not null default '{}',
  workflows_included text not null default '' check (char_length(workflows_included) <= 80),
  support_period     text not null default '' check (char_length(support_period) <= 80),
  cta_text           text not null default 'Request a Quote' check (char_length(cta_text) <= 40),
  is_featured        boolean not null default false,
  is_active          boolean not null default true,
  display_order      integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create trigger pricing_updated_at before update on public.pricing_packages
  for each row execute function public.set_updated_at();

create table public.website_settings (
  key        text primary key check (key ~ '^[a-z_]+$'),
  value      jsonb not null default '{}'::jsonb,
  is_public  boolean not null default true,
  updated_at timestamptz not null default now()
);
create trigger website_settings_updated_at before update on public.website_settings
  for each row execute function public.set_updated_at();

-- Non-secret integration state (secrets live ONLY in server env vars).
create table public.integration_settings (
  key               text primary key check (key ~ '^[a-z_]+$'),
  config            jsonb not null default '{}'::jsonb,
  last_tested_at    timestamptz,
  last_test_ok      boolean,
  last_test_message text check (char_length(last_test_message) <= 1000),
  updated_at        timestamptz not null default now()
);
create trigger integration_settings_updated_at before update on public.integration_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Projects & CRM
-- ---------------------------------------------------------------------
create table public.projects (
  id                        uuid primary key default gen_random_uuid(),
  reference                 text not null unique default ('MAW-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  client_id                 uuid references public.profiles (id) on delete set null, -- null = submitted without an account
  full_name                 text not null check (char_length(full_name) between 2 and 120),
  email                     text not null check (char_length(email) <= 254),
  business_name             text not null check (char_length(business_name) <= 160),
  business_website          text check (char_length(business_website) <= 300),
  industry                  text not null check (char_length(industry) <= 80),
  service_required          text not null check (char_length(service_required) <= 120),
  description               text not null check (char_length(description) <= 5000),
  current_problem           text not null check (char_length(current_problem) <= 5000),
  desired_automation        text not null check (char_length(desired_automation) <= 5000),
  budget                    text not null check (char_length(budget) <= 80),
  timeline                  text not null check (char_length(timeline) <= 80),
  existing_tools            text check (char_length(existing_tools) <= 2000),
  additional_requirements   text check (char_length(additional_requirements) <= 5000),
  status                    text not null default 'new' check (status in (
                               'new', 'under_review', 'quotation_sent', 'awaiting_payment',
                               'in_progress', 'testing', 'completed', 'cancelled')),
  progress                  integer not null default 0 check (progress between 0 and 100),
  deadline                  date,
  intake_status             text not null default 'pending' check (intake_status in (
                               'pending', 'forwarded', 'failed', 'not_configured')),
  intake_response           jsonb,
  confirmation_email_status text not null default 'pending' check (confirmation_email_status in (
                               'pending', 'sent', 'failed', 'not_configured', 'delegated_to_n8n')),
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);
create index projects_client_idx on public.projects (client_id, created_at desc);
create index projects_status_idx on public.projects (status);
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

create table public.project_notes (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  author_id   uuid references public.profiles (id) on delete set null,
  body        text not null check (char_length(body) between 1 and 5000),
  -- internal = admin only. Non-internal notes appear on the client's timeline.
  is_internal boolean not null default true,
  created_at  timestamptz not null default now()
);
create index project_notes_project_idx on public.project_notes (project_id, created_at desc);

create table public.contact_messages (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.profiles (id) on delete set null,
  full_name        text not null check (char_length(full_name) between 2 and 120),
  email            text not null check (char_length(email) <= 254),
  subject          text not null check (char_length(subject) between 2 and 200),
  message          text not null check (char_length(message) between 10 and 5000),
  service_interest text check (char_length(service_interest) <= 120),
  status           text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at       timestamptz not null default now()
);
create index contact_messages_created_idx on public.contact_messages (created_at desc);

create table public.leads (
  id                 uuid primary key default gen_random_uuid(),
  source             text not null check (source in ('project_intake', 'contact', 'chatbot', 'manual')),
  full_name          text not null check (char_length(full_name) <= 120),
  email              text not null check (char_length(email) <= 254),
  business_name      text check (char_length(business_name) <= 160),
  service_interest   text check (char_length(service_interest) <= 120),
  message            text check (char_length(message) <= 5000),
  status             text not null default 'new' check (status in (
                        'new', 'contacted', 'qualified', 'unqualified', 'converted', 'archived')),
  qualification      text check (char_length(qualification) <= 4000),
  score              integer check (score between 0 and 100),
  internal_notes     text check (char_length(internal_notes) <= 10000),
  project_id         uuid references public.projects (id) on delete set null,
  contact_message_id uuid references public.contact_messages (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index leads_status_idx on public.leads (status, created_at desc);
create index leads_email_idx on public.leads (lower(email));
create trigger leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Quotations & payments
-- ---------------------------------------------------------------------
create table public.quotations (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  client_id    uuid not null references public.profiles (id) on delete cascade,
  title        text not null check (char_length(title) between 2 and 160),
  description  text not null default '' check (char_length(description) <= 5000),
  line_items   jsonb not null default '[]'::jsonb,
  amount       numeric(12, 2) not null check (amount > 0),
  currency     text not null default 'PKR' check (currency ~ '^[A-Z]{3}$'),
  valid_until  date,
  status       text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined', 'expired')),
  sent_at      timestamptz,
  responded_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index quotations_project_idx on public.quotations (project_id);
create index quotations_client_idx on public.quotations (client_id);
create trigger quotations_updated_at before update on public.quotations
  for each row execute function public.set_updated_at();

create table public.payments (
  id                    uuid primary key default gen_random_uuid(),
  project_id            uuid not null references public.projects (id) on delete cascade,
  client_id             uuid not null references public.profiles (id) on delete cascade,
  quotation_id          uuid references public.quotations (id) on delete set null,
  amount                numeric(12, 2) not null check (amount > 0),
  currency              text not null default 'PKR' check (currency ~ '^[A-Z]{3}$'),
  provider              text not null default 'manual' check (char_length(provider) <= 40),
  transaction_reference text check (char_length(transaction_reference) <= 120),
  status                text not null default 'unpaid' check (status in ('unpaid', 'pending', 'paid', 'failed', 'refunded')),
  client_note           text check (char_length(client_note) <= 1000),
  admin_note            text check (char_length(admin_note) <= 2000),
  provider_payload      jsonb,
  verified_at           timestamptz,
  verified_by           uuid references public.profiles (id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index payments_client_idx on public.payments (client_id);
create index payments_project_idx on public.payments (project_id);
create index payments_status_idx on public.payments (status);
-- Prevent the same transaction reference being used twice for a provider.
create unique index payments_provider_ref_uniq on public.payments (provider, transaction_reference)
  where transaction_reference is not null;
create trigger payments_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Chatbot conversations
-- ---------------------------------------------------------------------
create table public.conversations (
  id              uuid primary key default gen_random_uuid(),
  session_id      text not null unique check (char_length(session_id) between 8 and 100),
  user_id         uuid references public.profiles (id) on delete set null,
  first_page      text check (char_length(first_page) <= 300),
  created_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);
create index conversations_last_idx on public.conversations (last_message_at desc);

create table public.chat_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role            text not null check (role in ('user', 'assistant', 'error')),
  content         text not null check (char_length(content) <= 10000),
  page            text check (char_length(page) <= 300),
  created_at      timestamptz not null default now()
);
create index chat_messages_conv_idx on public.chat_messages (conversation_id, created_at);

-- ---------------------------------------------------------------------
-- Notifications & support
-- ---------------------------------------------------------------------
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  title      text not null check (char_length(title) <= 160),
  body       text not null default '' check (char_length(body) <= 2000),
  link       text check (char_length(link) <= 300),
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

create table public.support_requests (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid not null references public.profiles (id) on delete cascade,
  project_id     uuid references public.projects (id) on delete set null,
  subject        text not null check (char_length(subject) between 3 and 200),
  message        text not null check (char_length(message) between 10 and 5000),
  status         text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  admin_response text check (char_length(admin_response) <= 5000),
  responded_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index support_client_idx on public.support_requests (client_id, created_at desc);
create trigger support_updated_at before update on public.support_requests
  for each row execute function public.set_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles             enable row level security;
alter table public.services             enable row level security;
alter table public.portfolio_projects   enable row level security;
alter table public.pricing_packages     enable row level security;
alter table public.website_settings     enable row level security;
alter table public.integration_settings enable row level security;
alter table public.projects             enable row level security;
alter table public.project_notes        enable row level security;
alter table public.contact_messages     enable row level security;
alter table public.leads                enable row level security;
alter table public.quotations           enable row level security;
alter table public.payments             enable row level security;
alter table public.conversations        enable row level security;
alter table public.chat_messages        enable row level security;
alter table public.notifications        enable row level security;
alter table public.support_requests     enable row level security;

-- Public website content -------------------------------------------------
create policy "Public can read active services" on public.services
  for select to anon, authenticated using (is_active);
create policy "Public can read published portfolio" on public.portfolio_projects
  for select to anon, authenticated using (is_published);
create policy "Public can read active pricing" on public.pricing_packages
  for select to anon, authenticated using (is_active);
create policy "Public can read public settings" on public.website_settings
  for select to anon, authenticated using (is_public);
-- integration_settings, leads, contact_messages, conversations, chat_messages:
-- no policies => no access for anon/authenticated (server/service role only).

-- Profiles ---------------------------------------------------------------
create policy "Users read own profile" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "Users update own profile" on public.profiles
  for update to authenticated using (id = auth.uid() and is_blocked = false)
  with check (id = auth.uid());
-- Column-level privilege: users may only change these columns. is_blocked,
-- email and id can only be changed by the service role.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, company, phone) on public.profiles to authenticated;
revoke insert, delete on public.profiles from anon, authenticated;

-- Projects (insert happens on the server after validation) ---------------
create policy "Clients read own projects" on public.projects
  for select to authenticated using (client_id = auth.uid());

create policy "Clients read public notes on own projects" on public.project_notes
  for select to authenticated using (
    is_internal = false
    and exists (select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid())
  );

create policy "Clients read own sent quotations" on public.quotations
  for select to authenticated using (client_id = auth.uid() and status <> 'draft');

create policy "Clients read own payments" on public.payments
  for select to authenticated using (client_id = auth.uid());

create policy "Users read own notifications" on public.notifications
  for select to authenticated using (user_id = auth.uid());
create policy "Users mark own notifications read" on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke update on public.notifications from anon, authenticated;
grant update (read_at) on public.notifications to authenticated;

create policy "Clients read own support requests" on public.support_requests
  for select to authenticated using (client_id = auth.uid());
create policy "Active clients create support requests" on public.support_requests
  for insert to authenticated with check (
    client_id = auth.uid()
    and public.current_user_active()
    and status = 'open'
    and admin_response is null
    and (project_id is null or exists (
      select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid()))
  );

-- =====================================================================
-- Storage bucket for portfolio images (public read, service-role write)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;
