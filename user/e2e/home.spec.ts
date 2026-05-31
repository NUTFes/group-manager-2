import { expect, test } from '@playwright/test';

test.describe('home page', () => {
  test('shows the registration and login entry points', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('button', { name: '新規登録' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();
    await expect(page.getByText('お知らせ', { exact: true })).toBeVisible();
  });

  test('opens the login modal from the welcome box', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'ログイン' }).click();

    await expect(page.getByLabel('メールアドレス')).toBeVisible();
    await expect(page.getByLabel('パスワード')).toBeVisible();
    await expect(
      page.locator('form').getByRole('button', { name: 'ログイン' })
    ).toBeVisible();
  });

  test('switches the public home page to English', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'English' }).click();

    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
    await expect(page.getByText('News', { exact: true })).toBeVisible();
  });
});
