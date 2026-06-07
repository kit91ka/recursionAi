# Процесс разработки — хронология, решения, артефакты

> Структурное описание того, **как делался** проект «Справочник категорий» (Zidium Front):
> от разбора ТЗ и макетов до работающего приложения с тестами и последующей полировки.
>
> Этот файл — «карта и журнал». Он не дублирует другие документы, а связывает их:
> - **что построено** по этапам со скриншотами → [DEVELOPMENT.md](./DEVELOPMENT.md);
> - **детальный план и дизайн-токены** → [plan.txt](./plan.txt);
> - **приёмка по пунктам ТЗ** → [checklist.md](./checklist.md);
> - **рабочий контекст между сессиями** → [AGENT_CONTEXT.md](./AGENT_CONTEXT.md);
> - **пошаговые логи каждой сессии** → [`docs/sessions/`](./docs/sessions/);
> - **обзор и запуск** → [README.md](./README.md).

---

## Содержание

1. [Как была организована работа](#1-как-была-организована-работа)
2. [Карта артефактов](#2-карта-артефактов)
3. [Хронология по сессиям](#3-хронология-по-сессиям)
4. [Ключевые архитектурные решения](#4-ключевые-архитектурные-решения)
5. [Эволюция после MVP](#5-эволюция-после-mvp)
6. [Текущее состояние и открытые вопросы](#6-текущее-состояние-и-открытые-вопросы)

---

## 1. Как была организована работа

Процесс строился по принципу **«сначала исследование и план, потом код»**:

1. **Исследование источников.** ТЗ ([project.txt](./project.txt)), макеты Figma
   (REST API по токену из `environment.ts`) и контракт бэкенда
   ([swagger_front.json](./swagger_front.json)) разбирались до написания кода.
2. **План.** Все расхождения «ТЗ ↔ макет ↔ API» и решения зафиксированы в
   [plan.txt](./plan.txt); приёмочные критерии — в [checklist.md](./checklist.md).
3. **Реализация фазами 0–6** (каркас → API-клиент → авторизация → список →
   Add/Edit → удаление → тесты/сборка).
4. **Непрерывность между сессиями.** Чтобы агент не терял контекст:
   - [CLAUDE.md](./CLAUDE.md) — правила проекта (читать [AGENT_CONTEXT.md](./AGENT_CONTEXT.md)
     в начале, вести лог сессии в конце);
   - хуки `SessionStart`/`Stop` (`.claude/`) подгружают контекст и напоминают
     записать лог — см. [лог настройки хуков](./docs/sessions/2026-06-07-claude-md-and-session-hooks.md);
   - один файл на сессию в [`docs/sessions/`](./docs/sessions/).

Документация по библиотекам (PrimeNG v20, Angular) сверялась через актуальные
источники (Context7), а не по памяти.

---

## 2. Карта артефактов

| Артефакт | Что это | Когда появился |
|---|---|---|
| [project.txt](./project.txt) | Исходное ТЗ | до разработки |
| [swagger_front.json](./swagger_front.json) | Контракт бэкенда (для генерации клиента) | этап разбора |
| [figma_renders/](./figma_renders/) | Эталонные рендеры 7 макетов | этап разбора |
| `figma_*.json` | Сырые выгрузки Figma (canvas/detail/images) | этап разбора |
| [plan.txt](./plan.txt) | Детальный план, дизайн-токены, архитектура | планирование |
| [checklist.md](./checklist.md) | Чеклист приёмки (13 разделов) | планирование |
| [README.md](./README.md) | Обзор, стек, запуск, структура | каркас документации |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Процесс по этапам + галерея скриншотов | каркас → реализация |
| [AGENT_CONTEXT.md](./AGENT_CONTEXT.md) | Контекст между сессиями | каркас документации |
| [conversation.md](./conversation.md) | Лог переписки по сессиям | ведётся постоянно |
| [docs/sessions/](./docs/sessions/) | Пошаговые логи отдельных сессий | по ходу работы |
| [docs/screenshots/](./docs/screenshots/) | Скриншоты работающего приложения (снимает Playwright) | реализация |
| [recursion-ai/](./recursion-ai/) | Исходники приложения (Angular) | реализация |

---

## 3. Хронология по сессиям

Источники этого раздела — [conversation.md](./conversation.md) и логи в
[`docs/sessions/`](./docs/sessions/).

### Сессия 2026-06-04 · Разбор и планирование
> Лог: [conversation.md](./conversation.md) (сообщения 1–8)

- Подключение к Figma REST API, рендер 7 экранов → [figma_renders/](./figma_renders/).
- Снятие контрактов из Swagger (`CategoryDto = {id, name}`, `CategoryListDto`,
  эндпоинты logon / categories / name-exists).
- Снятие дизайн-токенов (primary `#005baa`, danger `#a9120a`, шапка таблицы
  `#f9fafc`, Roboto, радиусы 8/10px). Имена слоёв макета = конвенции **PrimeNG** →
  выбор стека предопределён макетом.
- Итог: [plan.txt](./plan.txt), [checklist.md](./checklist.md), выгрузки Figma/Swagger.

### Сессия 2026-06-07 · Каркас документации и контекст-хуки
> Логи: [conversation.md](./conversation.md),
> [claude-md-and-session-hooks.md](./docs/sessions/2026-06-07-claude-md-and-session-hooks.md)

- Созданы [README.md](./README.md), [DEVELOPMENT.md](./DEVELOPMENT.md) (каркас с
  плейсхолдерами `🖼️ TODO`), [AGENT_CONTEXT.md](./AGENT_CONTEXT.md), папка
  [docs/screenshots/](./docs/screenshots/).
- Настроены [CLAUDE.md](./CLAUDE.md) и хуки `SessionStart`/`Stop` (Node-скрипты, т.к.
  на машине нет pwsh/Git Bash) — контекст и логи сессий ведутся автоматически.

### Сессия 2026-06-07 · Реализация приложения (фазы 0–6)
> Лог: [implementation.md](./docs/sessions/2026-06-07-implementation.md)

Приложение поднято в [recursion-ai/](./recursion-ai/) (Angular 20.3, standalone,
signals, PrimeNG 20):

| Фаза | Результат |
|---|---|
| 0 — каркас | тема-пресет `ZidiumPreset`, токены, структура `core/{api,auth,config}`, `proxy.conf.json` |
| 1 — API-клиент | генерация `core/api` из Swagger (`gen:api`), куратированный barrel |
| 2 — авторизация | `TokenStorage`, `AuthService`, `authInterceptor` (single-flight refresh), `authGuard` |
| 3 — список | `ShellLayout`, `CategoriesListPage`, `CategoriesStore` (signals), поиск/сортировка/скролл |
| 4 — Add/Edit | маршрутизируемая модалка `category-edit.dialog` |
| 5 — удаление | `ConfirmDialog` + `DELETE` |
| 6 — тесты/сборка | 33 теста, покрытие ≥80%, Playwright e2e, чистый `ng build` |

Подтверждено: бэкенд жив, `test/77777` → JWT, весь CRUD-поток проходит на реальных данных.
Подробности по этапам и скриншоты — [DEVELOPMENT.md](./DEVELOPMENT.md).

### Сессия 2026-06-07 · Полировка стилей под токены и меню под Figma
> Лог: [styling-tokens-design.md](./docs/sessions/2026-06-07-02-styling-tokens-design.md)

- Все стили PrimeNG переведены в design-токены пресета (`definePreset`), убран
  `::ng-deep`; ширина контролов — через штатное `fluid`.
- Исправлены 3 `@todo`: ошибка логина под полем Password (без `p-message`), список
  под Figma node 476-11408, бесконечная прокрутка через `IntersectionObserver` +
  автодогрузка; `PAGE_SIZE = 10`.
- Боковое меню (`ShellLayout`) приведено к Figma 476:11392 (toggle/sitemap/settings +
  profile/logout).

### Сессия 2026-06-07 · Confirm dialog под Figma
> Логи: [confirmdialog-theme-tokens.md](./docs/sessions/2026-06-07-confirmdialog-theme-tokens.md),
> [confirmdialog-figma-match.md](./docs/sessions/2026-06-07-02-confirmdialog-figma-match.md)

- Радиус 12px и паддинги 20/24/24/24 для `.p-confirmdialog`.
- Сверка с эталоном [figma_renders/delete.png](./figma_renders/delete.png): Close → серая
  `p-button-secondary` (была текстовая ссылка), футер выровнен влево, отступы пересобраны
  по секциям (header/content/footer), чтобы убрать задвоение паддингов.

### Сессия 2026-06-08 · Глобальная обработка ошибок и доводка
> _(в этой сессии; отдельный лог в [`docs/sessions/`](./docs/sessions/) при завершении)_

- Цвет иконки удаления → `--color-muted` (`#677379`), danger на hover.
- **Глобальный `errorInterceptor`** (`recursion-ai/src/app/core/http/error.interceptor.ts`):
  показывает текст ошибки HTTP в primeng/toast и гасит поток, поэтому из `subscribe`
  убраны все `error:`-колбэки (состояния снимаются через `finalize`). Флаг
  `SKIP_ERROR_TOAST` исключает фоновые проверки (валидатор имени) и экран входа
  (его ошибка остаётся inline под полем Password — по требованию).
- Регистрация перехватчиков: `withInterceptors([errorInterceptor, authInterceptor])` —
  `errorInterceptor` внешний, видит итоговую ошибку уже после refresh/повтора.
- E2E: добавлен детерминированный (замоканный, без бэкенда) тест на toast ошибки —
  `recursion-ai/e2e/error-toast.spec.ts`.
- Магическое `200` (упреждающий запас прокрутки) вынесено в
  `INFINITE_SCROLL_PREFETCH_PX` (`recursion-ai/src/app/core/config/constants.ts`).

---

## 4. Ключевые архитектурные решения

Сводка (полностью — [plan.txt](./plan.txt) и раздел «Проблемы и решения» в
[DEVELOPMENT.md](./DEVELOPMENT.md)):

| Решение | Причина |
|---|---|
| Angular standalone + signals, без NgRx | современный стек; объём состояния не требует внешнего стора |
| PrimeNG, тема через `definePreset` | макет нарисован под PrimeNG; стили — только токенами, без `::ng-deep` |
| OpenAPI-клиент генерируется, не правится руками | требование ТЗ; правки — только в курируемом barrel + алиасах `api-types.ts` |
| `apiBaseUrl=''` + `proxy.conf.json` | относительные запросы к `/front`, нет CORS в dev, удобно для e2e |
| Описание `Description` из макета не реализуется | обобщённый макет; в API только `id`/`name` (следуем ТЗ + контракту) |
| Edit как маршрут `/categories/:id` + Dialog | URL по ТЗ + вид модалки из макета |
| Глобальный toast ошибок вместо `error:` в `subscribe` | единая точка показа ошибок; login — исключение (inline) |

---

## 5. Эволюция после MVP

После выполнения фаз 0–6 приложение дорабатывалось точечными сессиями (см.
[хронологию](#3-хронология-по-сессиям)): перенос стилей в токены, приведение списка и
бокового меню к Figma, pixel-perfect confirm-диалога, цвет иконки удаления и, наконец,
**централизованная обработка ошибок** через `errorInterceptor` + toast с покрытием e2e.
Каждая такая правка сопровождалась проверкой `ng build` и unit-тестами, а визуальные —
сверкой с эталонами из [figma_renders/](./figma_renders/).

---

## 6. Текущее состояние и открытые вопросы

**Состояние:** все фазы плана выполнены; `ng build` (прод) чистый; unit/component-тесты
зелёные, покрытие app-кода ≥80%; e2e (Playwright) — смоук + полный поток против живого
бэкенда + детерминированный тест toast-ошибки; скриншоты снимаются автоматически в
[docs/screenshots/](./docs/screenshots/). Актуальный срез — всегда в
[AGENT_CONTEXT.md](./AGENT_CONTEXT.md).

**Возможные доработки (не входят в ТЗ):**
- SSR и CI-workflow;
- больше component-тестов списка;
- латентный момент: при стойкой ошибке загрузки списка `hasMore` остаётся `true`,
  автодогрузка может повторять запрос — кандидат на отдельный гард.
