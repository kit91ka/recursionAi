---
date: 2026-06-07
topic: confirm dialog под Figma 476-13733 (стили, кнопки)
---

## Запрос
Привести confirm-диалог удаления в соответствие с Figma node 476-13733: неправильные стили и кнопки.

## Что сделано
- Сверил текущий рендер (`docs/screenshots/delete.png`) с эталоном (`figma_renders/delete.png`).
  Расхождения: Close был текстовой синей ссылкой (`p-button-text`), футер прижат вправо и тесный.
- `features/categories/categories-list.page.ts`: `rejectButtonStyleClass` → `p-button-secondary`
  (серая кнопка Close вместо текстовой ссылки). Delete остаётся `p-button-danger`.
- `core/config/theme.ts`, компонент `confirmdialog`: вместо паддинга на корне пересобрал
  отступы по секциям и выровнял футер по левому краю:
  - `.p-dialog-header` padding `20px 24px 0`
  - `.p-dialog-content` padding `16px 24px 0`
  - `.p-dialog-footer` padding `24px 24px 24px`, `justify-content: flex-start`, `gap: 12px`
  - радиус `12px` сохранён.
- `npm run build` — успешно.

## Решения и причины
- Паддинг перенёс с корня `.p-confirmdialog` на секции header/content/footer, т.к. паддинг на
  корне складывался с внутренними отступами секций → двойные отступы. Суммарно внешние отступы
  остались 20/24/24/24, как в макете.
- Футер `flex-start` + `gap:12px` — в Figma кнопки слева (Close, затем Delete), а не справа.
- Close = secondary (серая), а не text — по макету это сплошная светло-серая кнопка.
- Скоуп по `.p-confirmdialog`, чтобы не задеть обычные диалоги Add/Edit.

## Открытые вопросы / следующие шаги
- Визуально не снимал скриншот (e2e требует живого бэкенда). Вертикальные зазоры
  (header→content 16px, content→footer 24px) — оценка по рендеру; при желании уточнить пиксельно.
