-- Platform RLS smoke test (bookings, documents, testimonials). Rolls back.
begin;
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'a@example.com'),
  ('00000000-0000-0000-0000-0000000000b1', 'b@example.com');
insert into public.projects (id, client_id, full_name, email, business_name, industry, service_required, description, current_problem, desired_automation, budget, timeline)
values ('20000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a1', 'Client A', 'a@example.com', 'A Co', 'Retail', 'x', 'desc', 'p', 'a', 'b', 't');
insert into public.documents (project_id, title, storage_path, visible_to_client) values
  ('20000000-0000-0000-0000-0000000000a1', 'visible', 'p/1', true),
  ('20000000-0000-0000-0000-0000000000a1', 'hidden', 'p/2', false);
insert into public.bookings (full_name, email, service, requirements, starts_at, ends_at) values
  ('Client A', 'a@example.com', 'x', 'requirements here', '2030-01-01 05:00+00', '2030-01-01 05:30+00'),
  ('Client B', 'b@example.com', 'x', 'requirements here', '2030-01-01 06:00+00', '2030-01-01 06:30+00');
insert into public.testimonials (author_name, quote, is_verified, is_published) values
  ('Real', 'A verified quote here', true, true), ('Unverified', 'Not verified yet here', false, true);

-- Double booking of a confirmed slot must fail
do $$ begin
  insert into public.bookings (full_name, email, service, requirements, starts_at, ends_at)
  values ('Client C', 'c@example.com', 'x', 'requirements here', '2030-01-01 05:00+00', '2030-01-01 05:30+00');
  raise exception 'FAIL double booking allowed';
exception when unique_violation then raise notice 'double booking blocked'; end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
select set_config('request.jwt.claims', '{"email":"a@example.com"}', true);
do $$ declare n int; begin
  select count(*) into n from public.documents;    if n <> 1 then raise exception 'FAIL documents=%', n; end if;
  select count(*) into n from public.bookings;     if n <> 1 then raise exception 'FAIL bookings=%', n; end if;
  select count(*) into n from public.testimonials; if n <> 1 then raise exception 'FAIL testimonials=%', n; end if;
  select count(*) into n from public.staff_roles;  if n <> 0 then raise exception 'FAIL staff_roles visible'; end if;
  select count(*) into n from public.activity_logs; if n <> 0 then raise exception 'FAIL logs visible'; end if;
  raise notice 'PLATFORM RLS TEST PASSED';
end $$;

reset role;
set local role anon;
do $$ declare n int; begin
  select count(*) into n from public.bookings;  if n <> 0 then raise exception 'FAIL anon bookings'; end if;
  select count(*) into n from public.documents; if n <> 0 then raise exception 'FAIL anon documents'; end if;
  raise notice 'ANON PLATFORM TEST PASSED';
end $$;
rollback;
