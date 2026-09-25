-- Stage 1: user profile, goals, limitations and body metrics (SPEC §4–5).
-- Canonical units in the database: kg and cm. Display units are stored separately.

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles ---------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  sex text not null check (sex in ('male', 'female')),
  birth_date date not null check (birth_date > date '1900-01-01'),
  height_cm numeric(4, 1) not null check (height_cm between 100 and 250),
  height_unit text not null default 'cm' check (height_unit in ('cm', 'ft_in')),
  weight_kg numeric(4, 1) not null check (weight_kg between 30 and 300),
  weight_unit text not null default 'kg' check (weight_unit in ('kg', 'lb')),
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  locations text[] not null check (
    cardinality(locations) between 1 and 3
    and locations <@ array['gym', 'home', 'outdoor']
  ),
  equipment text[] not null default '{}' check (
    equipment <@ array[
      'dumbbells', 'barbell', 'kettlebells', 'pull_up_bar', 'dip_bars', 'bands', 'bench', 'none'
    ]
  ),
  days_per_week smallint not null check (days_per_week between 2 and 6),
  training_mode text not null check (training_mode in ('light', 'hard', 'mixed')),
  cardio text not null check (cardio in ('warmup', 'end', 'none')),
  is_premium boolean not null default false,
  disclaimer_accepted_at timestamptz not null,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
for select to authenticated using ((select auth.uid()) = id);

create policy "profiles_insert_own" on public.profiles
for insert to authenticated with check ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- is_premium and service timestamps are not writable by the user.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant insert (
  id, sex, birth_date, height_cm, height_unit, weight_kg, weight_unit, level, locations,
  equipment, days_per_week, training_mode, cardio, disclaimer_accepted_at, onboarding_completed_at
) on public.profiles to authenticated;
grant update (
  sex, birth_date, height_cm, height_unit, weight_kg, weight_unit, level, locations,
  equipment, days_per_week, training_mode, cardio, disclaimer_accepted_at, onboarding_completed_at
) on public.profiles to authenticated;

-- user_goals: 1 primary (priority 1) + up to 1 additional (priority 2) ----

create table public.user_goals (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  goal text not null check (
    goal in (
      'muscle_gain', 'strength', 'fat_loss', 'recomposition', 'endurance', 'general_fitness',
      'mobility'
    )
  ),
  priority smallint not null check (priority in (1, 2)),
  created_at timestamptz not null default now(),
  unique (user_id, priority),
  unique (user_id, goal)
);

alter table public.user_goals enable row level security;

create policy "user_goals_all_own" on public.user_goals
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on public.user_goals from anon;

-- user_limitations ------------------------------------------------------

create table public.user_limitations (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  zones text[] not null default '{}' check (
    zones <@ array['neck', 'shoulders', 'elbows', 'wrists', 'lower_back', 'knees', 'ankles']
  ),
  note text check (char_length(note) <= 500),
  updated_at timestamptz not null default now()
);

create trigger user_limitations_set_updated_at
before update on public.user_limitations
for each row execute function public.set_updated_at();

alter table public.user_limitations enable row level security;

create policy "user_limitations_all_own" on public.user_limitations
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on public.user_limitations from anon;

-- body_metrics: one row per user per day --------------------------------

create table public.body_metrics (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  measured_at date not null default current_date,
  weight_kg numeric(4, 1) check (weight_kg between 30 and 300),
  body_fat_pct numeric(3, 1) check (body_fat_pct between 3 and 60),
  chest_cm numeric(4, 1) check (chest_cm between 50 and 200),
  waist_cm numeric(4, 1) check (waist_cm between 40 and 200),
  hips_cm numeric(4, 1) check (hips_cm between 50 and 200),
  biceps_cm numeric(4, 1) check (biceps_cm between 15 and 70),
  created_at timestamptz not null default now(),
  unique (user_id, measured_at)
);

alter table public.body_metrics enable row level security;

create policy "body_metrics_all_own" on public.body_metrics
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on public.body_metrics from anon;

-- save_onboarding: atomic save of the calibration form ------------------
-- Used both by onboarding and by profile editing. Runs with caller rights (RLS applies).

create function public.save_onboarding(payload jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  v_birth_date date := (payload ->> 'birth_date')::date;
  v_age int;
  v_locations text[] := array(select jsonb_array_elements_text(payload -> 'locations'));
  v_equipment text[] := array(
    select jsonb_array_elements_text(coalesce(payload -> 'equipment', '[]'::jsonb))
  );
  v_primary text := payload -> 'goals' ->> 'primary';
  v_secondary text := payload -> 'goals' ->> 'secondary';
  v_metrics jsonb := coalesce(payload -> 'metrics', '{}'::jsonb);
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if coalesce((payload ->> 'disclaimer_accepted')::boolean, false) is not true then
    raise exception 'disclaimer must be accepted' using errcode = '22023';
  end if;

  v_age := extract(year from age(current_date, v_birth_date));
  if v_age < 16 or v_age > 80 then
    raise exception 'age must be between 16 and 80' using errcode = '22023';
  end if;

  if (v_locations && array['home', 'outdoor']) and cardinality(v_equipment) = 0 then
    raise exception 'equipment is required for home or outdoor training' using errcode = '22023';
  end if;

  if 'none' = any(v_equipment) and cardinality(v_equipment) > 1 then
    raise exception 'equipment "none" cannot be combined' using errcode = '22023';
  end if;

  if v_primary is null or v_primary = v_secondary then
    raise exception 'invalid goals' using errcode = '22023';
  end if;

  insert into public.profiles as p (
    id, sex, birth_date, height_cm, height_unit, weight_kg, weight_unit, level, locations,
    equipment, days_per_week, training_mode, cardio, disclaimer_accepted_at,
    onboarding_completed_at
  )
  values (
    uid,
    payload ->> 'sex',
    v_birth_date,
    (payload ->> 'height_cm')::numeric,
    payload ->> 'height_unit',
    (payload ->> 'weight_kg')::numeric,
    payload ->> 'weight_unit',
    payload ->> 'level',
    v_locations,
    v_equipment,
    (payload ->> 'days_per_week')::smallint,
    payload ->> 'training_mode',
    payload ->> 'cardio',
    now(),
    now()
  )
  on conflict (id) do update set
    sex = excluded.sex,
    birth_date = excluded.birth_date,
    height_cm = excluded.height_cm,
    height_unit = excluded.height_unit,
    weight_kg = excluded.weight_kg,
    weight_unit = excluded.weight_unit,
    level = excluded.level,
    locations = excluded.locations,
    equipment = excluded.equipment,
    days_per_week = excluded.days_per_week,
    training_mode = excluded.training_mode,
    cardio = excluded.cardio,
    disclaimer_accepted_at = p.disclaimer_accepted_at,
    onboarding_completed_at = coalesce(p.onboarding_completed_at, excluded.onboarding_completed_at);

  delete from public.user_goals where user_id = uid;
  insert into public.user_goals (user_id, goal, priority) values (uid, v_primary, 1);
  if v_secondary is not null then
    insert into public.user_goals (user_id, goal, priority) values (uid, v_secondary, 2);
  end if;

  insert into public.user_limitations (user_id, zones, note)
  values (
    uid,
    array(
      select jsonb_array_elements_text(coalesce(payload -> 'limitations' -> 'zones', '[]'::jsonb))
    ),
    nullif(trim(payload -> 'limitations' ->> 'note'), '')
  )
  on conflict (user_id) do update set zones = excluded.zones, note = excluded.note;

  insert into public.body_metrics (
    user_id, measured_at, weight_kg, body_fat_pct, chest_cm, waist_cm, hips_cm, biceps_cm
  )
  values (
    uid,
    current_date,
    (payload ->> 'weight_kg')::numeric,
    (v_metrics ->> 'body_fat_pct')::numeric,
    (v_metrics ->> 'chest_cm')::numeric,
    (v_metrics ->> 'waist_cm')::numeric,
    (v_metrics ->> 'hips_cm')::numeric,
    (v_metrics ->> 'biceps_cm')::numeric
  )
  on conflict (user_id, measured_at) do update set
    weight_kg = excluded.weight_kg,
    body_fat_pct = excluded.body_fat_pct,
    chest_cm = excluded.chest_cm,
    waist_cm = excluded.waist_cm,
    hips_cm = excluded.hips_cm,
    biceps_cm = excluded.biceps_cm;
end;
$$;

revoke execute on function public.save_onboarding(jsonb) from public, anon;
grant execute on function public.save_onboarding(jsonb) to authenticated;
