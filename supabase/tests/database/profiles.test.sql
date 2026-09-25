begin;
create extension if not exists pgtap with schema extensions;
select plan(21);

insert into auth.users (id, email)
values
  ('11111111-1111-1111-1111-111111111111', 'a@test.local'),
  ('22222222-2222-2222-2222-222222222222', 'b@test.local');

create temp table payload as
select jsonb_build_object(
  'sex', 'male',
  'birth_date', (current_date - interval '30 years')::date,
  'height_cm', 180,
  'height_unit', 'cm',
  'weight_kg', 80,
  'weight_unit', 'kg',
  'level', 'beginner',
  'locations', jsonb_build_array('gym', 'home'),
  'equipment', jsonb_build_array('dumbbells', 'bench'),
  'days_per_week', 3,
  'training_mode', 'light',
  'cardio', 'warmup',
  'disclaimer_accepted', true,
  'goals', jsonb_build_object('primary', 'muscle_gain', 'secondary', 'fat_loss'),
  'limitations', jsonb_build_object('zones', jsonb_build_array('knees'), 'note', ' squats '),
  'metrics', jsonb_build_object('waist_cm', 82.5)
) as p;
grant select on payload to authenticated, anon;

select ok(
  (select bool_and(relrowsecurity) from pg_class
   where oid in ('public.profiles'::regclass, 'public.user_goals'::regclass,
                 'public.user_limitations'::regclass, 'public.body_metrics'::regclass)),
  'RLS enabled on all stage 1 tables'
);

-- user A ---------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true),
  set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);

select lives_ok($$ select public.save_onboarding((select p from payload)) $$, 'A saves onboarding');
select is((select count(*) from public.profiles), 1::bigint, 'A sees own profile');
select isnt((select onboarding_completed_at from public.profiles), null, 'onboarding marked complete');
select is(
  (select array_agg(goal order by priority) from public.user_goals),
  array['muscle_gain', 'fat_loss'],
  'goals saved with priority'
);
select is((select note from public.user_limitations), 'squats', 'limitation note trimmed');
select is((select waist_cm from public.body_metrics), 82.5, 'body metrics saved');

select lives_ok(
  $$ select public.save_onboarding((select p || '{"goals":{"primary":"strength"},"days_per_week":4}' from payload)) $$,
  'A re-saves (profile edit)'
);
select is(
  (select array_agg(goal) from public.user_goals), array['strength'], 'goals replaced on re-save'
);
select is((select count(*) from public.body_metrics), 1::bigint, 'one metrics row per day');

select throws_ok(
  $$ update public.profiles set is_premium = true $$, '42501', null, 'is_premium not writable'
);
select throws_ok(
  $$ insert into public.user_goals (goal, priority) values ('endurance', 3) $$,
  '23514', null, 'priority limited to 1..2'
);
select throws_ok(
  $$ select public.save_onboarding((select p || jsonb_build_object('birth_date', current_date - interval '15 years') from payload)) $$,
  '22023', 'age must be between 16 and 80', 'age < 16 rejected'
);
select throws_ok(
  $$ select public.save_onboarding((select p || '{"locations":["home"],"equipment":[]}' from payload)) $$,
  '22023', 'equipment is required for home or outdoor training', 'equipment required for home'
);
select throws_ok(
  $$ select public.save_onboarding((select p || '{"disclaimer_accepted":false}' from payload)) $$,
  '22023', 'disclaimer must be accepted', 'disclaimer required'
);

-- user B ---------------------------------------------------------------
select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true),
  set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);

select is(
  (select count(*) from public.profiles) + (select count(*) from public.user_goals)
    + (select count(*) from public.user_limitations) + (select count(*) from public.body_metrics),
  0::bigint,
  'B sees none of A''s data'
);

update public.profiles set days_per_week = 6 where id = '11111111-1111-1111-1111-111111111111';
delete from public.user_goals where user_id = '11111111-1111-1111-1111-111111111111';

select throws_ok(
  $$ insert into public.body_metrics (user_id, weight_kg) values ('11111111-1111-1111-1111-111111111111', 70) $$,
  '42501', null, 'B cannot write A''s metrics'
);

-- anon -----------------------------------------------------------------
set local role anon;
select throws_ok($$ select * from public.profiles $$, '42501', null, 'anon cannot read profiles');
select throws_ok(
  $$ select public.save_onboarding('{}'::jsonb) $$, '42501', null, 'anon cannot call save_onboarding'
);

-- verify A's data is intact ----------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true),
  set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
select is(
  (select days_per_week from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  4::smallint,
  'B update had no effect'
);
select is(
  (select count(*) from public.user_goals where user_id = '11111111-1111-1111-1111-111111111111'),
  1::bigint,
  'B delete had no effect'
);

select * from finish();
rollback;
