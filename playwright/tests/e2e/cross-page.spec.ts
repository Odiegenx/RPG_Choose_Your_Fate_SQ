import { test, expect } from '@playwright/test';

// test.beforeEach(async ({ page }) => {
//   await page.goto('');
// });

//Create test that confirms that when you enter the base page (login page), you can switch to the register page by using the button.
//Create a test of the reverse scenario i.e from register page to login page. THEY MUST NOT BE THE SAME TEST!!!

//Create test that creates new account on register page and then is capable of logging in with that same account after being redirected to the login page and that the account page is then opened.

// =====================================================================
// NAVIGATION TESTS — login <-> register switching via buttons
// =====================================================================

test('Login page navigates to Register page via "Go to Register" button', async ({ page }) => {
  // Arrange — start on login page
  await page.goto('');
  await expect(page).toHaveURL(/.*\/$/);
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Go to Register' })).toBeVisible();

  // Act — click the Go to Register button
  await page.getByRole('button', { name: 'Go to Register' }).click();

  // Assert — URL changed to /register and register page elements are visible
  await expect(page).toHaveURL(/.*\/register/);
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'email' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Register new account' })).toBeVisible();
});

test('Register page navigates to Login page via "Go to login" button', async ({ page }) => {
  // Arrange — start on register page
  await page.goto('/register');
  await expect(page).toHaveURL(/.*\/register/);
  await expect(page.getByRole('button', { name: 'Register new account' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Go to login' })).toBeVisible();

  // Act — click the Go to login button
  await page.getByRole('button', { name: 'Go to login' }).click();

  // Assert — URL is back to root and login page elements are visible
  await expect(page).not.toHaveURL(/.*\/register/);
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Go to Register' })).toBeVisible();
});

// =====================================================================
// FULL JOURNEY — register a new account, then login with it
// =====================================================================

test('Register a new account, then log in with that account and land on the account page', async ({ page }) => {
  // Generate unique credentials per test run so we never collide with existing users
  const username = 'e2e_' + Math.random().toString(36).substring(2, 10);
  const email = username + '@test.dk';
  const password = 'pw123';

  // ---------- Phase 1: Register ----------
  await page.goto('/register');
  await expect(page).toHaveURL(/.*\/register/);

  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Register new account' }).click();

  // After successful register, the frontend redirects to the login page
  await expect(page).not.toHaveURL(/.*\/register/);
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

  // ---------- Phase 2: Login with the freshly created account ----------
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  // Assert — successful login lands on /account
  await expect(page).toHaveURL(/.*\/account/);
});