import { expect, test } from '@playwright/test';

/** Смоук-проверки экрана входа — не требуют бэкенда. */
test.describe('Экран входа', () => {
  test('неавторизованный пользователь редиректится на /login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Logon to Zidium' })).toBeVisible();
  });

  test('пустой сабмит показывает "Field is required"', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Logon' }).click();
    await expect(page.getByText('Field is required')).toHaveCount(2);
  });
});
