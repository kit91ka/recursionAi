import { expect, test, type Page } from '@playwright/test';
import * as path from 'node:path';

/**
 * Снимает скриншоты приложения в docs/screenshots/ корневого репозитория.
 * Скриншоты экрана входа не требуют бэкенда; авторизованный поток — best-effort
 * (если бэкенд недоступен, шаг логируется и пропускается, тест не падает).
 */
const SHOTS = path.join(__dirname, '..', '..', 'docs', 'screenshots');
const CREDENTIALS = { login: 'test', password: '77777' };

function shot(page: Page, name: string) {
  return page.screenshot({ path: path.join(SHOTS, name), fullPage: true });
}

test('скриншоты экрана входа (без бэкенда)', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Logon to Zidium' })).toBeVisible();
  await shot(page, 'login.png');

  await page.getByRole('button', { name: 'Logon' }).click();
  await expect(page.getByText('Field is required').first()).toBeVisible();
  await shot(page, 'login-required.png');

  // Ошибка входа — требует бэкенда; best-effort.
  try {
    await page.getByLabel('Login').fill('nosuchuser');
    await page.locator('#password').fill('wrongpass');
    await page.getByRole('button', { name: 'Logon' }).click();
    await page.waitForTimeout(2500);
    await shot(page, 'login-error.png');
  } catch (e) {
    console.warn('login-error screenshot skipped:', (e as Error).message);
  }
});

test('скриншоты авторизованного потока (best-effort, нужен бэкенд)', async ({ page }) => {
  try {
    await page.goto('/login');
    await page.getByLabel('Login').fill(CREDENTIALS.login);
    await page.locator('#password').fill(CREDENTIALS.password);
    await page.getByRole('button', { name: 'Logon' }).click();

    await page.waitForURL(/\/categories/, { timeout: 8000 });
    await page.getByRole('heading', { name: 'Categories' }).waitFor({ timeout: 8000 });
    await page.waitForTimeout(1500);
    await shot(page, 'list.png');

    // Add
    const addBtn = page.getByRole('button', { name: 'Add' });
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.getByRole('dialog').waitFor({ timeout: 5000 });
      await shot(page, 'add.png');

      await page.locator('#name').fill('e2e-проверка-имени');
      await page.waitForTimeout(1200);
      await shot(page, 'name-validation.png');
      await page.getByRole('button', { name: 'Close' }).click();
      await page.waitForTimeout(500);
    }

    // Edit — первая строка таблицы
    const firstRow = page.locator('tr.categories__row, tbody tr').first();
    if (await firstRow.isVisible()) {
      await firstRow.click();
      await page.getByRole('dialog').waitFor({ timeout: 5000 });
      await shot(page, 'edit.png');
      await page.getByRole('button', { name: 'Close' }).click();
      await page.waitForTimeout(500);
    }

    // Delete confirmation
    const delBtn = page.getByRole('button', { name: 'Delete' }).first();
    if (await delBtn.isVisible().catch(() => false)) {
      await delBtn.click();
      await page.waitForTimeout(600);
      await shot(page, 'delete.png');
    }
  } catch (e) {
    console.warn('authenticated flow screenshots skipped:', (e as Error).message);
  }
});
