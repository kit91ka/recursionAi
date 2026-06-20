# AGENT_CONTEXT.md

Постоянный контекст проекта **recursionAi** для Claude. Читается автоматически в начале каждой сессии (хук SessionStart) и обновляется в конце сессии по необходимости.

## Текущий прогресс

Этапы 1–3 завершены, Этап 4 реализован, Этап 8 выполнен (**45 unit-тестов, 0 failures**).

### Что готово
- **Этап 1**: Angular 20 standalone, PrimeNG + ZidiumPreset (definePreset), proxy.conf.json, структура каталогов. Собирается.
- **Этап 2**: swagger_front.json скачан, API-клиент сгенерирован через openapi-generator-cli. Собирается.
- **Этап 3**: TokenStorage, AuthService, authInterceptor (single-flight refresh), authGuard, LoginPage. Собирается.
- **Этап 4**: ShellLayout (sidebar 78px), CategoriesStore (сигналы), CategoriesPage (таблица + поиск + IntersectionObserver infinite scroll). Собирается.
- **Этап 5**: Add/Edit Dialog через PrimeNG DynamicDialog + CategoryEditDialog. Собирается.
- **Этап 6**: Async name validation (nameExistsValidator с debounce 350ms). Собирается.
- **Этап 7**: Delete через ConfirmationService + store.remove(). Собирается.
- **Этап 8**: Тесты — 45 unit-тестов (store, dialog, validator, page, shell, login, app). Все проходят.

### Что осталось
- **Этап 9**: E2E тесты, настройка скриптов.
- Warning о превышении initial bundle budget (632 kB при лимите 500 kB) — предсуществующая проблема.

## Как запускать
- `npm start` — dev-сервер с `proxy.conf.json` (проксирует `/front` → бэкенд, без CORS).
- `npm run test:ci` — unit + coverage.
- `npm run build` — production build.

## Стилизация (важно)
- Все стили PrimeNG — через design-токены пресета `core/config/theme.ts` (`definePreset`):
  palette primary `#005baa`, примитив `red`→`#a9120a` (danger), `formField.borderRadius` 8px,
  `content.borderRadius` 10px, токены `datatable` (шапка `#f9fafc`, padding, borderColor, row hover).
  `::ng-deep` в проекте нет. Полная ширина контролов — штатным `fluid`.
- Список и боковое меню приведены к Figma: плоский полноширинный список без карточки, «+ Add» текстом, поиск во всю ширину; sidebar: toggle/sitemap/settings(active) сверху, profile+logout снизу.
- `PAGE_SIZE = 10`. Infinite scroll: страничный скролл вьюпорта + `IntersectionObserver` на сентинеле + автодогрузка (`afterRenderEffect`) до заполнения экрана.
- Login-форма: центрированный заголовок в `<h2>`, p-fluid на контролах, серверная ошибка над кнопкой, кнопка Logon full-width через `[style]`, `CardModule` в imports. Без `::ng-deep`.

## Ключевые решения
- Стек: Angular standalone + signals, PrimeNG, OpenAPI-генератор.
- Description из макета не реализуем (обобщённый макет; только Id/Name).
- Edit как маршрут `/categories/:id` + PrimeNG Dialog.
- `apiBaseUrl` пуст (относительные запросы); в prod reverse-proxy на `/front`.

## API-модели (сгенерированные — важно!)
- `ZidiumWebServiceFrontCategoryListDto.canAdd` (не `canEdit`)
- `CurrentUserDto.displayName` (не `name`)
