import { test, expect } from '@playwright/test';

test.describe('Enterprise Authentication & Authorization Suite', () => {
  test('should navigate to login page when unauthenticated user accesses /ai-workspace', async ({ page }) => {
    await page.goto('/ai-workspace');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display registration form and handle validation errors', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h3')).toContainText('Create Account');
    
    // Trigger submit with empty fields
    await page.click('button[type="submit"]');
    await expect(page.locator('form')).toContainText('First name must be at least 2 characters');
  });

  test('should display forgot password form', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('h3')).toContainText('Forgot Password');
    await page.fill('input[type="email"]', 'architect@truson.ai');
    await page.click('button[type="submit"]');
  });

  test('should handle valid login flow', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="loginIdentifier"]', 'architect@truson.ai');
    await page.fill('input[name="password"]', 'Password123!');
  });
});
