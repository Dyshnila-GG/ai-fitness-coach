# AI Fitness Coach

Мобильное приложение (iOS + Android) — персональный AI-тренер. Спецификация — [`SPEC.md`](./SPEC.md), правила разработки — [`CLAUDE.md`](./CLAUDE.md).

## Стек

Expo SDK 57 · React Native · TypeScript (strict) · Expo Router · NativeWind v4 · Zustand · TanStack Query · zod · i18next · Supabase · Jest + RNTL.

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
| `npx supabase test db`                    | SQL-тесты БД (RLS) из `supabase/tests/`        |
| `npx supabase functions serve`            | Локальный запуск Edge Functions                |

## Вход в приложение локально

Вход — по 6-значному коду из письма (без пароля). Запуск работает в Expo Go, dev build не нужен.

1. `npx supabase start`, затем `npx supabase db reset` — применит миграции.
2. `npx expo start`, в приложении введите любой email.
3. Письмо с кодом откройте в локальном почтовом ящике: http://127.0.0.1:54324 (Mailpit). Настоящие письма локально не отправляются.

## Настройка облачного Supabase — пошагово

Инструкция для первого запуска на реальном проекте Supabase (supabase.com). Делается один раз.

### 1. Включить вход по 6-значному коду

По умолчанию Supabase присылает в письме ссылку. Приложению нужен код, поэтому меняем текст писем.

1. Откройте https://supabase.com/dashboard и выберите свой проект.
2. Слева: **Authentication** → **Sign In / Providers**. Убедитесь, что провайдер **Email** включён.
3. Слева: **Authentication** → **Emails** → вкладка **Templates** (шаблоны писем). Прямая ссылка: https://supabase.com/dashboard/project/_/auth/templates
4. Откройте шаблон **Magic link or OTP**. Сотрите весь текст в поле письма и вставьте содержимое файла [`supabase/templates/otp.html`](./supabase/templates/otp.html). Главное — в письме должна быть строка `{{ .Token }}`: на её место Supabase подставит код. Тема письма: `Код для входа / Sign-in code`. Нажмите **Save**.
5. То же самое сделайте с шаблоном **Confirm sign up** — его получают новые пользователи при первом входе, если включено подтверждение email.
6. Проверка: войдите в приложение со своим email — в письме должны быть 6 цифр, а не ссылка.

Код действует 1 час (настройка «Email OTP Expiration» в **Authentication → Sign In / Providers → Email**). Длина кода — 6 цифр, приложение ждёт именно 6.

### 2. Применить миграции (создать таблицы) в облаке

Команды выполняются в терминале из папки проекта.

1. Войти в Supabase CLI (откроется браузер для подтверждения):
   ```bash
   npx supabase login
   ```
2. Связать папку проекта с облачным проектом:
   ```bash
   npx supabase link --project-ref <project-ref>
   ```
   - `<project-ref>` — идентификатор проекта: это часть адреса в браузере `https://supabase.com/dashboard/project/<project-ref>` (набор букв, например `abcdefghijklmnop`). Он же есть в **Project Settings → General → Project ID**.
   - CLI спросит **пароль базы данных** — тот, что задавали при создании проекта. Забыли — сбросьте в **Project Settings → Database → Reset database password**.
3. Отправить миграции в облако:
   ```bash
   npx supabase db push
   ```
   CLI покажет список миграций и попросит подтвердить — введите `Y`.
4. Проверка: в Dashboard откройте **Table Editor** — должны появиться таблицы `profiles`, `user_goals`, `user_limitations`, `body_metrics`.

Важно: не меняйте таблицы вручную в облаке (через Table Editor или SQL Editor) — только через файлы миграций, иначе `db push` начнёт выдавать ошибки.

### 3. Лимит писем встроенной почты Supabase

Пока не подключена своя почта (SMTP), Supabase отправляет письма сам, но с жёсткими ограничениями:

- **Всего 2 письма в час** на весь проект (Supabase может менять это число без предупреждения). Каждый запрос кода — это письмо.
- **Письма доходят только участникам команды проекта** — адресам из **Organization Settings → Team**. На любой другой адрес будет ошибка «Email address not authorized».
- **Повторно запросить код на тот же email можно не чаще раза в 60 секунд** — поэтому в приложении кнопка «Отправить код ещё раз» ждёт 60 с.

Что это значит при тестировании:

- Тестируйте с email, который добавлен в команду проекта.
- Не запрашивайте код много раз подряд: после 2 писем за час придётся ждать. Приложение покажет «Слишком много попыток».
- Для частых проверок удобнее локальный Supabase (раздел выше): там писем сколько угодно, и все видны в Mailpit.

Перед релизом (и если тестировщиков больше, чем участников команды) обязательно подключите свой почтовый сервис: **Authentication → Emails → SMTP Settings** (https://supabase.com/dashboard/project/_/auth/smtp), включите **Enable custom SMTP** и введите данные сервиса (например Resend, Postmark, Brevo, AWS SES). После этого лимит можно поднять в **Authentication → Rate Limits** (https://supabase.com/dashboard/project/_/auth/rate-limits).

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
