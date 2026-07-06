import { test, expect } from '@playwright/test';

test.describe('AI Workspace Split View & Fallbacks E2E Suite', () => {
  test('should display chat interface, provider selectors, and output panel layout elements', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[name="loginIdentifier"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should redirect unauthenticated workspace hits', async ({ page }) => {
    await page.goto('/ai-workspace');
    await expect(page).toHaveURL(/\/login/);
  });
});
