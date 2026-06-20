import { expect, test } from '@playwright/test';

test.describe('Login errors', () => {
  test('required fields show errors on submit', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Logon to Zidium' })).toBeVisible();

    // Трогаем поля — кликнуть и уйти (blur), чтобы появились ошибки валидации
    await page.getByLabel('Login').focus();
    await page.locator('#password input').focus();
    await page.locator('#password input').blur();
    await page.waitForTimeout(300);

    // Должны появиться ошибки "Field is required"
    const requiredErrors = page.locator('.p-error').filter({ hasText: 'Field is required' });
    expect(await requiredErrors.count()).toBeGreaterThanOrEqual(1);

    // Кнопка должна быть disabled при пустых полях
    const logonBtn = page.getByRole('button', { name: 'Logon' });
    await expect(logonBtn).toBeDisabled();
  });

  test('server error shows under password field, not as toast', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Logon to Zidium' })).toBeVisible();

    // Вводим неверные данные
    await page.getByLabel('Login').fill('wronguser');
    await page.locator('#password input').fill('wrongpassword');
    await page.getByRole('button', { name: 'Logon' }).click();

    // Ждём ответа сервера
    await page.waitForTimeout(3000);

    // Ошибка должна быть ПОД полем пароля, а не над кнопкой
    const passwordSection = page.locator('.field').last();
    const errorInPassword = passwordSection.locator('.p-error');
    const errorText = await errorInPassword.textContent();
    console.log('Error text:', errorText);
    // Ошибка сервера должна отображаться
    expect(errorText).toBeTruthy();
    expect(errorText!.length).toBeGreaterThan(0);

    // Кнопка НЕ должна быть в состоянии loading (спиннер)
    const logonBtn = page.getByRole('button', { name: 'Logon' });
    const btnClass = await logonBtn.getAttribute('class');
    console.log('Button class:', btnClass);
    expect(btnClass).not.toContain('p-button-loading');

    // Поле пароля должно иметь красную рамку (ng-invalid)
    const passwordHasError = await page.locator('#password.ng-invalid').count();
    console.log('Password has ng-invalid:', passwordHasError > 0);

    // Скриншот для проверки
    await page.screenshot({ path: 'e2e/login-error-state.png', fullPage: true });
  });

  test('server error clears when user types in password', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Logon to Zidium' })).toBeVisible();

    // Неверный логин
    await page.getByLabel('Login').fill('wronguser');
    await page.locator('#password input').fill('wrongpassword');
    await page.getByRole('button', { name: 'Logon' }).click();
    await page.waitForTimeout(3000);

    // Начинаем печатать в пароле — ошибка должна исчезнуть
    const passwordInput = page.locator('#password input');
    await passwordInput.fill('newpassword');
    await page.waitForTimeout(500);

    // Проверяем что ошибка сервера исчезла
    const passwordSection = page.locator('.field').last();
    const errorElements = passwordSection.locator('.p-error');
    const errorCount = await errorElements.count();
    console.log('Error messages after typing:', errorCount);
    // Ошибка сервера должна исчезнуть
    expect(errorCount).toBe(0);
  });
});
