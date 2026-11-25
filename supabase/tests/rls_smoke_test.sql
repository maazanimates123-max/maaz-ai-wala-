-- RLS smoke test. Runs inside a transaction and rolls back, so it leaves no data.
-- Run as the postgres/superuser role (e.g. Supabase SQL editor or psql).
begin;

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'client-a@example.com'),
  ('00000000-0000-0000-0000-00000000000b', 'client-b@example.com');

insert into public.projects (id, client_id, full_name, email, business_name, industry, service_required,
  description, current_problem, desired_automation, budget, timeline)
values
  ('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000000a', 'Client A', 'client-a@example.com',
   'A Co', 'Retail', 'AI Chatbots', 'desc', 'problem', 'automation', 'Not sure', 'Flexible'),
  ('10000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-00000000000b', 'Client B', 'client-b@example.com',
   'B Co', 'Retail', 'AI Chatbots', 'desc', 'problem', 'automation', 'Not sure', 'Flexible');

insert into public.project_notes (project_id, body, is_internal) values
  ('10000000-0000-0000-0000-00000000000a', 'internal note', true),
  ('10000000-0000-0000-0000-00000000000a', 'client-visible update', false);

insert into public.quotations (project_id, client_id, title, amount, status) values
  ('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000000a', 'Draft quote', 1000, 'draft'),
  ('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000000a', 'Sent quote', 1000, 'sent');

insert into public.leads (source, full_name, email) values ('contact', 'X', 'x@example.com');
insert into public.services (slug, title, short_description, is_active) values
  ('visible', 'Visible', 'x', true), ('hidden', 'Hidden', 'x', false);

-- Act as client A
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', true);

do $$
declare n int;
begin
  select count(*) into n from public.projects;            if n <> 1 then raise exception 'FAIL projects visible=%', n; end if;
  select count(*) into n from public.projects where client_id = '00000000-0000-0000-0000-00000000000b';
  if n <> 0 then raise exception 'FAIL can see other client project'; end if;
  select count(*) into n from public.project_notes;       if n <> 1 then raise exception 'FAIL notes visible=%', n; end if;
  select count(*) into n from public.quotations;          if n <> 1 then raise exception 'FAIL quotes visible=% (draft leaked?)', n; end if;
  select count(*) into n from public.leads;               if n <> 0 then raise exception 'FAIL leads visible'; end if;
  select count(*) into n from public.services;            if n <> 1 then raise exception 'FAIL inactive service visible'; end if;
  select count(*) into n from public.profiles;            if n <> 1 then raise exception 'FAIL profiles visible=%', n; end if;

  -- Allowed column update
  update public.profiles set full_name = 'New Name' where id = auth.uid();

  -- Privilege escalation attempt: is_blocked must not be writable
  begin
    update public.profiles set is_blocked = false where id = auth.uid();
    raise exception 'FAIL could update is_blocked';
  exception when insufficient_privilege then null; end;

  -- Cannot write projects directly (no update policy => 0 rows affected)
  update public.projects set status = 'completed';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FAIL could update projects'; end if;
  delete from public.payments;
  update public.quotations set status = 'accepted';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FAIL could update quotations'; end if;

  -- Support request against someone else's project must fail
  begin
    insert into public.support_requests (client_id, project_id, subject, message)
    values (auth.uid(), '10000000-0000-0000-0000-00000000000b', 'Help me', 'This should not be allowed.');
    raise exception 'FAIL support insert on foreign project';
  exception when insufficient_privilege then null; end;

  -- Support request on own project succeeds
  insert into public.support_requests (client_id, project_id, subject, message)
  values (auth.uid(), '10000000-0000-0000-0000-00000000000a', 'Help me', 'This one is allowed fine.');

  -- Cannot impersonate another client
  begin
    insert into public.support_requests (client_id, subject, message)
    values ('00000000-0000-0000-0000-00000000000b', 'Spoof', 'Impersonation attempt here.');
    raise exception 'FAIL support impersonation';
  exception when insufficient_privilege then null; end;

  raise notice 'RLS SMOKE TEST PASSED';
end $$;

-- Anonymous visitor
reset role;
set local role anon;
do $$
declare n int;
begin
  select count(*) into n from public.projects; if n <> 0 then raise exception 'FAIL anon sees projects'; end if;
  select count(*) into n from public.services; if n <> 1 then raise exception 'FAIL anon services=%', n; end if;
  raise notice 'ANON TEST PASSED';
end $$;

rollback;
