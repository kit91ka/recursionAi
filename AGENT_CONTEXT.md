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
- Warning о превышении initial bundle budget (632 kB при лимите 500 kB) — предсуществующая проблема.

### Исправлено 2026-06-20 (сессия 1)
- **app.config.ts**: добавлен `provideApi('')` — без него все API-запросы шли на `http://localhost`
- **Add/Edit модалка**: убран двойной `<p-dialog>` (DynamicDialog уже даёт обёртку), кнопки вынесены из `ng-template pTemplate="footer"` (не проецируется в DynamicDialog), диалог сам вызывает store.save() (т.к. `ref.close()` не эмитит `onClose`)
- **Удаление**: добавлен `<p-confirmDialog>` (без него ConfirmationService.confirm() ничего не показывает), оптимистичное удаление с восстановлением при ошибке API
- **E2E**: `e2e/categories-crud.spec.ts` — полный CRUD-поток (логин → add → delete), проходит

### Исправлено 2026-06-20 (сессия 2 — Figma table + nav)
- **Таблица categories**: `table-layout: fixed`, Id/Name поровну (517px), Actions 48px, padding ячеек 10px 16px, убран `p-datatable-sm`
- **Add кнопка**: текстовая без фона/рамки (transparent, no border), иконка 16px, gap 8px, hover `#f4f4f5`
- **Delete кнопка**: строго 48px, padding 0, иконка 16px по центру
- **Nav sidebar**: PrimeNG-иконки заменены на SVG из Figma (`currentColor`, 20×20):
  sitemap (иерархия) → toggle (древовидная) → settings (шестерёнка, active)
- **Sidebar цвета**: default `#677379`, active `#ffffff` на `#005baa`
- `headerCellPadding` в `theme.ts`: `0.75rem` → `0.625rem` (10px)

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
