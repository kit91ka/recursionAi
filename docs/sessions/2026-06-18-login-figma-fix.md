---
date: 2026-06-18
topic: login-form-figma-fix
---

## Запрос
Форма логина не совпадает с дизайном. Попросил переделать по Figma-скриншотам (папка `figma_renders/`), убрать `::ng-deep`, сделать через PrimeNG preset, добавить кнопку Logon.

## Что сделано
- **`login.page.html`**: убран `header` из p-card, заголовок «Logon to Zidium» вынесен в `<h2 class="card-title">` для центрирования; добавлен `[class.ng-invalid]` на поля для подсветки ошибок валидации; серверная ошибка между полями и футером (как в Figma)
- **`login.page.scss`**: удалены все `::ng-deep`-правила; p-fluid сам раздаёт ширину; стилизован `.card-title` с `text-align: center`
- **`login.page.ts`**: добавлен `CardModule` в imports (не был импортирован, хотя `<p-card>` использовался)
- **`AGENT_CONTEXT.md`**: обновлён статус — build проходит, TODOs по логину убраны

## Решения и причины
- Заголовок вынесен из `header` p-card в собственный `<h2>` — так можно центрировать без `::ng-deep`
- `::ng-deep` полностью удалён — стилизация через design-токены пресета и штатные классы PrimeNG
- Кнопка full-width через `[style]="{ width: '100%' }"` (как в Figma)

## Открытые вопросы / следующие шаги
- Этап 5 (Add/Edit Dialog), Этап 6 (async name validation), Этап 7 (delete), Этап 8 (tests), Этап 9 (scripts)
- Warning о превышении initial bundle budget (632 kB при лимите 500 kB) — предсуществующая проблема
