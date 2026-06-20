import { expect, test } from '@playwright/test';

/**
 * Global error handling via errorInterceptor + primeng toast.
 * Fully mocked (page.route) — no backend needed.
 */
const TOKEN_KEY = 'zidium_token';
const DELETE_ERROR = 'Failed to delete category.';

const MOCK_ITEM = { id: 1, name: 'E2E Cat', canEdit: true, canDelete: true };
const MOCK_LIST = { items: [MOCK_ITEM], canAdd: true };

test.describe('Global error toast', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => localStorage.setItem(key, 'e2e-fake-token'), TOKEN_KEY);

    // List API: return one item with canDelete: true
    await page.route(/\/front\/categories\?/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_LIST),
      }),
    );

    // DELETE /front/categories/{id} → 500
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

  test('shows delete error text in toast', async ({ page }) => {
    await page.goto('/categories');
    await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'E2E Cat' })).toBeVisible();

    // Find delete icon button (pi-trash)
    const deleteBtn = page.locator('button.pi-trash, .pi-trash').first();
    await expect(deleteBtn).toBeVisible({ timeout: 5000 });
    await deleteBtn.click();

    const dialog = page.locator('.p-confirmdialog');
    await expect(dialog).toBeVisible();

    // Confirm delete in dialog
    await dialog.getByRole('button', { name: 'Delete' }).click();

    // Error text appears in primeng toast
    await expect(page.locator('.p-toast-detail')).toHaveText(DELETE_ERROR);
  });
});
