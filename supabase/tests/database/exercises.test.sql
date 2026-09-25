begin;
create extension if not exists pgtap with schema extensions;
select plan(13);

select ok(
  (select bool_and(relrowsecurity) from pg_class
   where oid in ('public.exercises'::regclass, 'public.exercise_alternatives'::regclass)),
  'RLS enabled on exercise tables'
);

-- seed integrity -------------------------------------------------------
select ok((select count(*) from public.exercises) >= 60, 'starter set is seeded');

select is(
  (select count(*)::int from public.exercises
   where cardinality(media_urls) = 2
     and not (media_urls[1] like 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/%'
              and media_urls[2] like 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/%')),
  0,
  'media frames come only from free-exercise-db'
);

select is(
  (select count(*)::int from public.exercise_alternatives a
   where not exists (
     select 1 from public.exercise_alternatives b
     where b.exercise_id = a.alternative_id and b.alternative_id = a.exercise_id
   )),
  0,
  'alternatives are symmetric'
);

select is(
  (select count(*)::int from public.exercises e
   where e.pattern not in ('cardio', 'mobility')
     and not exists (select 1 from public.exercise_alternatives a where a.exercise_id = e.id)
     and not exists (
       select 1 from public.exercises o
       where o.id <> e.id and o.pattern = e.pattern and o.primary_muscles && e.primary_muscles
     )),
  0,
  'every strength exercise has at least one replacement'
);

-- anon -----------------------------------------------------------------
set local role anon;
select throws_ok('select count(*) from public.exercises', '42501', null, 'anon cannot read exercises');

-- authenticated --------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);

select ok((select count(*) from public.exercises) >= 60, 'user reads exercises');
select ok((select count(*) from public.exercise_alternatives) > 0, 'user reads alternatives');

select throws_ok(
  $$insert into public.exercises (id, name_ru, name_en, primary_muscles, equipment, pattern,
      difficulty, is_compound, instructions_ru, instructions_en)
    values ('hack', 'x', 'x', array['chest'], 'barbell', 'push_h', 1, true,
      array['a','b','c'], array['a','b','c'])$$,
  '42501', null, 'user cannot insert exercises'
);
select throws_ok(
  $$update public.exercises set name_en = 'x' where id = 'push_up'$$,
  '42501', null, 'user cannot update exercises'
);
select throws_ok(
  $$delete from public.exercises where id = 'push_up'$$,
  '42501', null, 'user cannot delete exercises'
);
select throws_ok(
  $$insert into public.exercise_alternatives values ('push_up', 'plank')$$,
  '42501', null, 'user cannot insert alternatives'
);
select throws_ok(
  $$delete from public.exercise_alternatives$$,
  '42501', null, 'user cannot delete alternatives'
);

select * from finish();
rollback;
