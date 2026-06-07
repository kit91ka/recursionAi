---
date: 2026-06-07
topic: стили confirm dialog в theme.ts
---

## Запрос
Поправить стили confirm dialog: Radius 12px, Padding 20px (top) / 24px (right) / 24px (bottom) / 24px (left). Добавить в `recursion-ai/src/app/core/config/theme.ts`.

## Что сделано
- В `core/config/theme.ts` добавлен компонент `confirmdialog` в блок `components` пресета `ZidiumPreset`.
- Стиль через `css()` внутри `definePreset`, скоуп по `.p-confirmdialog`:
  - `border-radius: 12px`
  - `padding: 20px 24px 24px 24px`

## Решения и причины
- Скоуп по `.p-confirmdialog`, а не по `.p-dialog`, чтобы не задеть Add/Edit модалку.
- Подход через `css()` — в едином стиле с остальными компонентами темы, без `::ng-deep`.

## Открытые вопросы / следующие шаги
- Паддинг задан на корне `.p-confirmdialog` и складывается с внутренними отступами header/content/footer. Если визуально получится двойной отступ — перенести 20/24/24/24 на конкретные секции и обнулить внутренние.
