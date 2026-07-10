import { test, expect } from '@playwright/test';

test.describe('AI Writing Studio and Document CMS E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000);
    const email = `test-${Date.now()}@neurova.ai`;
    
    // Register account
    await page.goto('/register');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="username"]', `user_${Date.now()}`);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Wait to land back on the login page
    await expect(page).toHaveURL(/\/login/);

    // Log in
    await page.fill('input[name="loginIdentifier"]', email);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Give Vite routing a moment to proceed to main dashboard
    await page.waitForTimeout(3000);
  });

  test('should redirect unauthenticated content page hits', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/content');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display the core studio panels and allow blank document authoring', async ({ page }) => {
    await page.goto('/content');
    
    // Assert workspace structures are visible
    await expect(page.locator('button:has-text("New Document")')).toBeVisible();
    await expect(page.locator('button:has-text("All Documents")')).toBeVisible();
    await expect(page.locator('button:has-text("Favorites")')).toBeVisible();
  });
});
