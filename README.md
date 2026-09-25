# AI Fitness Coach

Мобильное приложение (iOS + Android) — персональный AI-тренер. Спецификация — [`SPEC.md`](./SPEC.md), правила разработки — [`CLAUDE.md`](./CLAUDE.md).

## Стек

Expo SDK 57 · React Native · TypeScript (strict) · Expo Router · NativeWind v4 · i18next · Supabase · Jest + RNTL.

## Требования

- Node.js 22+
- Docker — для локального Supabase (`npx supabase start`)
- Expo Go или development build на устройстве/эмуляторе

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
| `npx supabase functions serve`            | Локальный запуск Edge Functions                |

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
