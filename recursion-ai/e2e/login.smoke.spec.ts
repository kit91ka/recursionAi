import { expect, test } from '@playwright/test';

/** Смоук-проверки экрана входа — не требуют бэкенда. */
test.describe('Экран входа', () => {
  test('неавторизованный пользователь редиректится на /login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Logon to Zidium' })).toBeVisible();
  });

  test('пустые поля показывают "Field is required" после touched', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Logon to Zidium' })).toBeVisible();

    // Клик в поле Login и blur — чтобы появилась ошибка валидации
    await page.getByLabel('Login').click();
    await page.getByLabel('Login').blur();
    await expect(page.getByText('Field is required')).toBeVisible();
  });
});
