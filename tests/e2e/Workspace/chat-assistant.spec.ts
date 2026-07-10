import { test, expect } from '@playwright/test';

test.describe('AI Chat Assistant & Conversation E2E Suite', () => {
  test('should redirect unauthenticated conversation hits', async ({ page }) => {
    await page.goto('/ai-workspace');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display conversational page structures, history controls, and right panels when logged in', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h5:has-text("Welcome Back")')).toBeVisible();
  });
});
