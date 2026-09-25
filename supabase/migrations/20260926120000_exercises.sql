-- Stage 2: exercise library and alternatives (SPEC §6).
-- Shared reference data: read-only for signed-in users, written only by seed (SQL Editor).
-- Enum values must match src/logic/exercises.ts; contraindication zones match
-- LIMITATION_ZONES in src/logic/profile.ts.

create table public.exercises (
  id text primary key check (id ~ '^[a-z0-9_]+$'),
  name_ru text not null check (char_length(name_ru) between 1 and 100),
  name_en text not null check (char_length(name_en) between 1 and 100),
  primary_muscles text[] not null check (
    cardinality(primary_muscles) >= 1
    and primary_muscles <@ array[
      'chest', 'back', 'lower_back', 'shoulders', 'biceps', 'triceps', 'forearms', 'quads',
      'hamstrings', 'glutes', 'calves', 'core', 'full_body'
    ]
  ),
  secondary_muscles text[] not null default '{}' check (
    secondary_muscles <@ array[
      'chest', 'back', 'lower_back', 'shoulders', 'biceps', 'triceps', 'forearms', 'quads',
      'hamstrings', 'glutes', 'calves', 'core', 'full_body'
    ]
  ),
  equipment text not null check (
    equipment in (
      'barbell', 'dumbbell', 'machine', 'cable', 'smith', 'bodyweight', 'kettlebell', 'band'
    )
  ),
  pattern text not null check (
    pattern in (
      'push_h', 'push_v', 'pull_h', 'pull_v', 'squat', 'hinge', 'lunge', 'isolation', 'core',
      'cardio', 'mobility'
    )
  ),
  difficulty smallint not null check (difficulty between 1 and 3),
  is_compound boolean not null,
  is_unilateral boolean not null default false,
  default_tempo text check (default_tempo ~ '^[0-9X]-[0-9X]-[0-9X]-[0-9X]$'),
  instructions_ru text[] not null check (cardinality(instructions_ru) between 3 and 6),
  instructions_en text[] not null check (cardinality(instructions_en) between 3 and 6),
  mistakes_ru text[] not null default '{}',
  mistakes_en text[] not null default '{}',
  contraindications text[] not null default '{}' check (
    contraindications <@ array['neck', 'shoulders', 'elbows', 'wrists', 'lower_back', 'knees', 'ankles']
  ),
  -- Animation frames (start / end of the movement); empty = placeholder in the app.
  media_urls text[] not null default '{}' check (cardinality(media_urls) in (0, 2)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(instructions_ru) = cardinality(instructions_en)),
  check (cardinality(mistakes_ru) = cardinality(mistakes_en))
);

create trigger exercises_set_updated_at
before update on public.exercises
for each row execute function public.set_updated_at();

alter table public.exercises enable row level security;

create policy "exercises_select_authenticated" on public.exercises
for select to authenticated using (true);

revoke all on public.exercises from anon, authenticated;
grant select on public.exercises to authenticated;

-- exercise_alternatives: directed pairs, seed stores both directions ------

create table public.exercise_alternatives (
  exercise_id text not null references public.exercises (id) on delete cascade,
  alternative_id text not null references public.exercises (id) on delete cascade,
  primary key (exercise_id, alternative_id),
  check (exercise_id <> alternative_id)
);

create index exercise_alternatives_alternative_id_idx
on public.exercise_alternatives (alternative_id);

alter table public.exercise_alternatives enable row level security;

create policy "exercise_alternatives_select_authenticated" on public.exercise_alternatives
for select to authenticated using (true);

revoke all on public.exercise_alternatives from anon, authenticated;
grant select on public.exercise_alternatives to authenticated;
