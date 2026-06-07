---
date: 2026-06-07
topic: реализация приложения «Справочник категорий» по DEVELOPMENT.md
---

## Запрос
Начать разработку нового проекта в `recursion-ai/`, используя `DEVELOPMENT.md`
(каркас процесса) и подготовленный ранее `plan.txt`.

## Что сделано
Реализованы все фазы плана 0–6 (Angular 20.3, standalone, signals, PrimeNG 20):

- **Фаза 0 — каркас:** PrimeNG + `@primeuix/themes` + PrimeIcons + Roboto; пресет темы
  `core/config/theme.ts` (primary `#005baa`); токены в `styles.scss`; структура
  `core/{api,auth,config}`, `shared`, `features`; `environment`, `constants` (PAGE_SIZE=50);
  `app.config.ts` (router+inputBinding, httpClient+interceptor, animations, PrimeNG, BASE_PATH).
- **Фаза 1 — API-клиент:** `@openapitools/openapi-generator-cli` (`7.10.0`), скрипт `gen:api`,
  генерация `core/api` из `swagger_front.json` (`--skip-validate-spec`); алиасы `core/api-types.ts`.
- **Фаза 2 — авторизация:** `TokenStorage`, `AuthService`, `authInterceptor`
  (Bearer + `401`→refresh→retry, single-flight), `authGuard`.
- **Фаза 3 — список:** `ShellLayout` (меню 78px), `CategoriesListPage`, `CategoriesStore`
  (signals), таблица Id/Name, поиск `debounce(300)`, сортировка по Name,
  бесконечная прокрутка через `IntersectionObserver`, логика `canEdit`.
- **Фаза 4 — Add/Edit:** маршрутизируемая модалка `category-edit.dialog`
  (`/categories/new` и `/categories/:id`), GET by id, POST add/update, upsert в стор.
- **Фаза 5 — удаление:** PrimeNG `ConfirmDialog`, `DELETE`, удаление из стора, toast ошибок.
- **Async-валидация имени:** `nameExistsValidator` (timer+switchMap, отмена предыдущего).
- **Фаза 6 — тесты/сборка:** 33 unit/component-теста (Karma+Jasmine), покрытие app ≥80%
  (Statements 92%, Branches 82%); Playwright e2e (смоук + полный поток против живого бэкенда),
  автоснятие 8 скриншотов в `docs/screenshots/`; прод `ng build` чистый.

Заполнен `DEVELOPMENT.md` (этапы 4–13, галерея, «Проблемы и решения»), обновлён `AGENT_CONTEXT.md`.

## Решения и причины
- **`apiBaseUrl=''` + `proxy.conf.json`** — относительные запросы к `/front` проксируются
  на бэкенд, что снимает CORS в dev и упрощает e2e против живого бэкенда.
- **Куратированный barrel `core/api/api/api.ts`** (в `.openapi-generator-ignore`) — авто-`export *`
  давал TS2308 из-за дублей `*RequestParams` между эндпоинтами спеки.
- **`codeCoverageExclude: core/api/**`** — генерированный клиент не должен искажать метрику покрытия.
- **Тема: только палитра primary**, радиусы — через CSS-токены (невалидные design-tokens PrimeNG).
- Бюджет initial-бандла поднят до 900kB/1.5MB (объём PrimeNG).

## Открытые вопросы / следующие шаги
- Возможные доработки: SSR, CI-workflow, больше component-тестов списка,
  полировка ширины поля Password на экране входа.
- Подтвердить значение `PAGE_SIZE` (сейчас 50) и показ колонки Id (реализовано по ТЗ).
