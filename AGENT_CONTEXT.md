# AGENT_CONTEXT.md

Постоянный контекст проекта **recursionAi** для Claude. Читается автоматически в начале каждой сессии (хук SessionStart) и обновляется в конце сессии по необходимости.

## Текущее состояние
- **Приложение реализовано** в `recursion-ai/` (Angular 20.3, standalone, signals, PrimeNG 20).
- Реализованы все фазы плана 0–6: каркас+тема, API-клиент из Swagger, JWT-авторизация,
  список (поиск/сортировка/infinite scroll), Add/Edit модалка, async-валидация имени, удаление.
- `ng build` (прод) — без ошибок/предупреждений. 33 unit/component-теста зелёные,
  покрытие app-кода ≥80% (Statements 92%, Branches 82%). E2E (Playwright) — смоук + полный
  поток против живого бэкенда, он же снимает скриншоты в `docs/screenshots/` (8 шт.).
- `DEVELOPMENT.md` заполнен по этапам со скриншотами; раздел «Проблемы и решения» заполнен.

## Архитектура (кратко)
- `core/api` — генерированный OpenAPI-клиент (не править руками; barrel `api/api.ts`
  куратирован и в `.openapi-generator-ignore`). Алиасы типов — `core/api-types.ts`.
- `core/auth` — `TokenStorage`, `AuthService`, `authInterceptor` (single-flight refresh), `authGuard`.
- `core/config` — `environment` (apiBaseUrl относительный → proxy), `constants` (PAGE_SIZE=50), `theme`.
- `features/{auth,categories,layout}`, `shared/validators/name-exists.validator.ts`.

## Как запускать
- `npm start` — dev-сервер с `proxy.conf.json` (проксирует `/front` → бэкенд, без CORS).
- `npm run gen:api` — регенерация клиента из `swagger_front.json`.
- `npm run test:ci` — unit + coverage; `npm run e2e` — Playwright (поднимает сервер сам).
- Тестовый пользователь бэкенда: `test / 77777`. Бэкенд: `https://zidium3-backend.zidium.net`.

## Стилизация (важно)
- Все стили PrimeNG — через design-токены пресета `core/config/theme.ts` (`definePreset`):
  palette primary `#005baa`, примитив `red`→`#a9120a` (danger), `formField.borderRadius` 8px,
  `content.borderRadius` 10px, токены `datatable` (шапка `#f9fafc`, padding, borderColor, row hover).
  `::ng-deep` в проекте нет. Полная ширина контролов — штатным `fluid` (input/password/iconfield).
- Документацию по токенам сверять через Context7 (`/websites/v20_primeng`).
- Список и боковое меню приведены к Figma (nodes 476-11408 / 476:11392): плоский полноширинный
  список без карточки, «+ Add» текстом, поиск во всю ширину; sidebar: toggle/sitemap/settings(active)
  сверху, profile+logout снизу. Референс-рендеры — в `figma_renders/`.
- `PAGE_SIZE = 10`. Бесконечная прокрутка — страничный скролл вьюпорта + `IntersectionObserver`
  на сентинеле + автодогрузка (`afterRenderEffect`) до заполнения экрана.
- Серверная ошибка логина показывается как ошибка поля Password (текст из `error.detail`), без `p-message`.

## Активные задачи / в работе
- _Пусто — основной объём готов._ Возможные доработки: SSR, расширение component-тестов
  списка, CI-workflow.

## Ключевые решения
- Стек: Angular standalone + signals, PrimeNG (макет под него), OpenAPI-генератор (ТЗ).
- Description из макета не реализуем (обобщённый макет; следуем ТЗ + API: только Id/Name).
- Edit как маршрут `/categories/:id` + PrimeNG Dialog (URL по ТЗ + вид макета).
- `apiBaseUrl` пуст (относительные запросы); в prod ожидается reverse-proxy на `/front`.
- Figma-токен из корневого `environment.ts` НЕ переносится во фронтовый бандл.
- Хуки SessionStart/Stop ведут контекст и лог сессий в `docs/sessions/`.
