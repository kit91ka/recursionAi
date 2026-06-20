---
date: 2026-06-20
topic: category CRUD fixes — modal design, delete, e2e verification
---

## Запрос
- Add category модалка выглядит ужасно — сверить с дизайном и поправить
- Удаление вообще не работает
- Дать двум агентам параллельно, принять по критериям из project.txt / plan.txt
- Открыть Playwright и протестировать

## Что сделано

### Исправления кода (6 файлов)

**`category-edit.dialog.html`**
- Убран вложенный `<p-dialog>` — DynamicDialogService сам даёт обёртку (был двойной диалог)
- Кнопки вынесены из `ng-template pTemplate="footer"` напрямую в форму — `pTemplate` не проецируется в DynamicDialog (баг/особенность PrimeNG)
- Кнопка Save: убран `type="submit"`, добавлен `(click)="save()"`

**`category-edit.dialog.ts`**
- Диалог теперь сам вызывает `store.save()` и `location.replaceState('/categories')` при save/close
- Причина: `DynamicDialogRef.close()` не эмитит `onClose` в установленной версии PrimeNG — подписки родителя никогда не срабатывали
- Убран `effect` + `signal` посредник — `save()` напрямую закрывает диалог
- Добавлен инжект `CategoriesStore` и `Location`

**`category-edit.dialog.scss`**
- Обновлены стили: `:host` без лишних паддингов, `.dialog-form` — flex column, `.dialog-footer` — правильный gap

**`categories.page.html`**
- Добавлен `<p-confirmDialog [style]="{ width: '424px' }" />` — БЕЗ него `ConfirmationService.confirm()` молча не показывает диалог
- Удаление не работало именно из-за отсутствия этого элемента

**`categories.page.ts`**
- `confirmDelete()`: header='Confirmation', message='Sure to delete this element?', rejectLabel='Close' (как в Figma)
- `openDialog()`: убраны мёртвые `onClose`-подписки — диалог сам управляет сохранением
- Убран неиспользуемый `Location`

**`categories.store.ts`**
- `remove(item)`: восстановление элемента при ошибке API (`items.update(prev => [item, ...prev])`)
- `remove(item)`: после удаления последней записи на странице — перезагрузка с page 0
- `save()`: добавлен `catchError` — установка `error` при провале API

### E2E тесты (Playwright)
- Установлен Chromium для Playwright (`npx playwright install chromium`)
- Создан `e2e/categories-crud.spec.ts` — полный CRUD-поток: логин → add → delete
- Тест проходит: `1 passed (13.7s)`

### Баги, найденные в процессе
1. **`pTemplate="footer"` не работает в DynamicDialog** — контент не проецируется, кнопки не рендерятся
2. **`DynamicDialogRef.close()` не эмитит `onClose`** — все подписки на `dialogRef.onClose` — мёртвый код
3. **`router.navigate()` не очищает queryParams** при переходе на тот же маршрут — использован `Location.replaceState()`
4. **`ConfirmationService.confirm()` требует `<p-confirmDialog>` в DOM** — без него тихо ничего не делает

## Решения и причины
- **Диалог сам управляет сохранением** вместо колбэков родителя — единственный работающий паттерн при неработающем `onClose`
- **`location.replaceState`** вместо `router.navigate` — надёжно чистит queryParams без роутер-эвентов
- **Оптимистичное удаление с восстановлением** — элемент мгновенно исчезает из списка, при ошибке API возвращается

## Файлы
- `recursion-ai/src/app/features/categories/category-edit.dialog.html` — исправлен
- `recursion-ai/src/app/features/categories/category-edit.dialog.ts` — исправлен
- `recursion-ai/src/app/features/categories/category-edit.dialog.scss` — исправлен
- `recursion-ai/src/app/features/categories/categories.page.html` — исправлен
- `recursion-ai/src/app/features/categories/categories.page.ts` — исправлен
- `recursion-ai/src/app/features/categories/categories.store.ts` — исправлен
- `recursion-ai/e2e/categories-crud.spec.ts` — создан
