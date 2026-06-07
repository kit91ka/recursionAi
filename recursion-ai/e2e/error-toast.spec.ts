import { expect, test } from '@playwright/test';

/**
 * Глобальная обработка ошибок HTTP: errorInterceptor показывает текст ошибки
 * в primeng/toast. Тест полностью замоканный (page.route) — бэкенд не нужен.
 *
 * Сценарий: список грузится успешно (одна строка), а DELETE падает с 500 —
 * подписки на ошибку в коде нет, текст ошибки должен прийти именно из toast.
 */
const TOKEN_KEY = 'zidium.token';
const DELETE_ERROR = 'Не удалось удалить категорию.';

test.describe('Глобальный toast ошибок', () => {
  test.beforeEach(async ({ page }) => {
    // Сидируем access-token, чтобы authGuard пустил на /categories без логина.
    await page.addInitScript((key) => localStorage.setItem(key, 'e2e-fake-token'), TOKEN_KEY);

    // Список — успешный ответ с одной строкой (items < PAGE_SIZE → без догрузки).
    await page.route(/\/front\/categories\?/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [{ id: 1, name: 'E2E Cat' }], canEdit: true }),
      }),
    );

    // Запросы по конкретному id: DELETE → 500, остальные методы не трогаем.
    await page.route(/\/front\/categories\/\d+$/, (route) => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ detail: DELETE_ERROR }),
        });
      }
      return route.continue();
    });
  });

  test('показывает текст ошибки удаления в toast', async ({ page }) => {
    await page.goto('/categories');
    await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'E2E Cat' })).toBeVisible();

    // Иконка удаления в строке (aria-label="Delete") → открывается confirm dialog.
    await page.getByRole('button', { name: 'Delete' }).first().click();

    const dialog = page.locator('.p-confirmdialog');
    await expect(dialog).toBeVisible();

    // Подтверждаем удаление — запрос упадёт с 500.
    await dialog.getByRole('button', { name: 'Delete' }).click();

    // Текст ошибки приходит из errorInterceptor → primeng toast.
    await expect(page.locator('.p-toast-detail')).toHaveText(DELETE_ERROR);
  });
});
