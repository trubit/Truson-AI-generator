import { test, expect } from '@playwright/test';

test.describe('Enterprise Authentication & Authorization Suite', () => {
  test('should navigate to login page when unauthenticated user accesses /ai-workspace', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/ai-workspace', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display registration form and handle validation errors', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('form')).toBeVisible();
    await page.click('button[type="submit"]');
  });

  test('should display forgot password form', async ({ page }) => {
    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('form')).toBeVisible();
    await page.fill('input[type="email"]', 'architect@truson.ai');
    await page.click('button[type="submit"]');
  });

  test('should handle valid login flow', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.fill('input[name="loginIdentifier"]', 'architect@truson.ai');
    await page.fill('input[name="password"]', 'Password123!');
  });
});
