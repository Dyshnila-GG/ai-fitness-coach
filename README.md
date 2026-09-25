# AI Fitness Coach

Мобильное приложение (iOS + Android) — персональный AI-тренер. Личное, для 2 пользователей, без публикации в магазины. Спецификация — [`SPEC.md`](./SPEC.md), правила разработки — [`CLAUDE.md`](./CLAUDE.md).

## Стек

Expo SDK 57 · React Native · TypeScript (strict) · Expo Router · NativeWind v4 · Zustand · TanStack Query · zod · i18next · Supabase · Jest + RNTL.

## Требования

- Node.js 22+
- Docker — для локального Supabase (`npx supabase start`)
- Expo Go на телефоне/эмуляторе (dev build не нужен и не используется)

## Установка

```bash
npm install
cp .env.example .env                                   # URL и publishable key Supabase
cp supabase/functions/.env.example supabase/functions/.env  # секреты Edge Functions (Claude API)
```

### Переменные окружения

| Файл                      | Переменная                             | Назначение                                       |
| ------------------------- | -------------------------------------- | ------------------------------------------------ |
| `.env`                    | `EXPO_PUBLIC_SUPABASE_URL`             | URL проекта Supabase                             |
| `.env`                    | `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key Supabase (попадает в приложение) |
| `supabase/functions/.env` | `ANTHROPIC_API_KEY`                    | Ключ Claude API — только на сервере              |
| `supabase/functions/.env` | `ANTHROPIC_MODEL`                      | Модель Claude для генерации тренировок           |

Облачный проект: Supabase Dashboard → Project Settings → API Keys. Секреты функций в прод: `npx supabase secrets set --env-file supabase/functions/.env`.

## Команды

| Команда                                   | Что делает                                     |
| ----------------------------------------- | ---------------------------------------------- |
| `npx expo start`                          | Dev-сервер (`npm run ios` / `npm run android`) |
| `npm test`                                | Jest-тесты                                     |
| `npm run lint`                            | ESLint                                         |
| `npm run typecheck`                       | Проверка типов (`tsc --noEmit`)                |
| `npm run format` / `npm run format:check` | Prettier                                       |
| `npx supabase start`                      | Локальный Supabase (Docker)                    |
| `npx supabase db reset`                   | Пересоздать локальную БД: миграции + seed      |
| `npx supabase test db`                    | SQL-тесты БД (RLS) из `supabase/tests/`        |
| `npx supabase functions serve`            | Локальный запуск Edge Functions                |

## Вход в приложение локально

Вход — по email и паролю (минимум 6 символов). Писем приложение не отправляет.

1. `npx supabase start`, затем `npx supabase db reset` — применит миграции.
2. `npx expo start`, откройте в Expo Go.
3. Экран «Регистрация»: email + пароль → сразу попадаете в онбординг. Дальше входите на экране «Вход».

## Настройка облачного Supabase — пошагово

Инструкция для первого запуска на реальном проекте Supabase (supabase.com). Делается один раз.

### 1. Включить вход по email и паролю

1. Откройте https://supabase.com/dashboard и выберите свой проект.
2. Слева: **Authentication** → **Sign In / Providers** → **Email**.
3. Провайдер **Email** должен быть включён, а **Confirm email** — **выключен** (иначе после регистрации Supabase будет ждать подтверждения из письма). Нажмите **Save**.
4. Проверка: зарегистрируйтесь в приложении — сразу откроется онбординг.
5. Когда оба пользователя зарегистрированы, можно закрыть регистрацию для остальных: **Authentication** → **Sign In / Providers** → раздел **User Signups** → выключите **Allow new users to sign up**.

Забыли пароль — писем нет, поэтому сброс только вручную: **SQL Editor** →

```sql
update auth.users
set encrypted_password = extensions.crypt('новый_пароль', extensions.gen_salt('bf'))
where email = 'you@example.com';
```

### 2. Применить миграции и seed в облаке (SQL Editor)

Миграции применяются вручную, без `supabase db push`.

1. Dashboard → **SQL Editor** → **New query**.
2. Откройте в проекте нужный файл, скопируйте всё содержимое в редактор, нажмите **Run**.
3. Порядок: сначала файлы из `supabase/migrations/` по возрастанию имени (имя начинается с даты), затем файлы из `supabase/seed/`.
4. Каждую миграцию выполняйте **один раз**. Seed можно запускать повторно — он обновит данные.
5. Какие файлы выполнить после очередного этапа — указано в отчёте этапа (и в описании Pull Request).

Текущий полный список (для нового проекта):

| #   | Файл                                              | Что создаёт                                                  |
| --- | ------------------------------------------------- | ------------------------------------------------------------ |
| 1   | `supabase/migrations/20260925120000_profiles.sql` | `profiles`, `user_goals`, `user_limitations`, `body_metrics` |

Проверка: **Table Editor** — таблицы на месте.

## Структура

```
app/                 # экраны (Expo Router)
src/components/      # UI-компоненты
src/features/        # onboarding, exercises, workouts, player, feedback, progress, ai
src/lib/             # supabase-клиент, утилиты
src/logic/           # чистая бизнес-логика + тесты
src/i18n/            # переводы (ru — основной, en)
supabase/migrations/ # SQL-миграции
supabase/seed/       # seed упражнений и программ
supabase/functions/  # Edge Functions (AI)
```
