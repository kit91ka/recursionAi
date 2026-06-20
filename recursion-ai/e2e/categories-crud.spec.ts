import { expect, test } from '@playwright/test';

test.describe('Categories CRUD', () => {
  test('login, add, and delete category', async ({ page }) => {
    test.setTimeout(60000);

    // Логин
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Logon to Zidium' })).toBeVisible({ timeout: 10000 });
    await page.getByLabel('Login').fill('test');
    await page.locator('#password input').fill('77777');
    await page.getByRole('button', { name: 'Logon' }).click();
    await page.waitForURL(/\/categories/, { timeout: 20000 });
    await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible({ timeout: 10000 });

    // Добавление
    await page.locator('.add-btn').click();
    await page.waitForTimeout(2000);

    const nameInput = page.locator('#edit-name');
    await expect(nameInput).toBeVisible();

    await nameInput.fill('E2E_Test_' + Date.now());
    await page.waitForTimeout(2500);

    const saveBtn = page.locator('.dialog-footer button').filter({ hasText: 'Save' });
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();
    await page.waitForTimeout(4000);

    // URL должен очиститься
    await expect(page).toHaveURL(/\/categories$/);

    // Удаление
    const delBtn = page.locator('p-button[icon="pi pi-trash"]').first();
    await expect(delBtn).toBeVisible();
    await delBtn.click();
    await page.waitForTimeout(1000);

    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Confirmation');
    expect(bodyText).toContain('Sure to delete');

    const confirmDelBtn = page.locator('button').filter({ hasText: 'Delete' }).last();
    await expect(confirmDelBtn).toBeVisible();
    await confirmDelBtn.click();
    await page.waitForTimeout(2000);
  });
});
