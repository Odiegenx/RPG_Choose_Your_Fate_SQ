import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate((token) => {
        localStorage.setItem('token', token);
    }, process.env.USER_TOKEN);
    await page.goto('/account');
    await expect(page).toHaveURL(/.*\/account/);
});

test('Click on Eris Dawn character, press play, and make 2 choices', async ({ page }) => {

  await expect(page.getByText(/Eris Dawn/)).toBeVisible();
  await expect(page.getByText('New Character')).toBeVisible();

  await page.getByText(/Eris Dawn/).click();

  await expect(page.locator('#character-detail-grid-portrait')).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Equipment'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Inventory'})).toBeVisible();
  await expect(page.getByText(/Name:/)).toBeVisible();
  await expect(page.getByText(/Current chapter/)).toBeVisible();
  await expect(page.getByText(/Story so far for/)).toBeVisible();
  await expect(page.getByRole('button', {name: 'Generate Audio'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Play'})).toBeVisible();

  await page.getByRole('button', {name: 'Play'}).click();

  //First scene
  await expect(page).toHaveURL(/.*\/game/);
  await expect(page.getByRole('img', {name: 'scene'})).toBeVisible();
  const scene1 = await (page.locator('.dialogTextContainer')).innerText();

  await page.getByRole('img', {name: 'scene'}).click();

  //First choice
  await expect(page.locator('.choice').first()).toBeVisible();
  const choice1 = await page.locator('.choice').first().innerText();

  await page.locator('.choice').first().click();

  //Second scene
  await expect(page.getByRole('img', {name: 'scene'})).toBeVisible();
  await expect(page.locator('.dialogTextContainer')).not.toHaveText(scene1);
  const scene2 = await (page.locator('.dialogTextContainer')).innerText();


  await page.getByRole('img', {name: 'scene'}).click();

  //Second choice
  await expect(page.locator('.choice').first()).toBeVisible();
  await expect(page.locator('.choice').first()).not.toHaveText(choice1);
  const choice2 = await page.locator('.choice').first().innerText();

  await page.locator('.choice').first().click();

  //Third scene
  await expect(page.getByRole('img', {name: 'scene'})).toBeVisible();
  await expect(page.locator('.dialogTextContainer')).not.toHaveText(scene2);
  const scene3 = await (page.locator('.dialogTextContainer')).innerText();

  await page.getByRole('img', {name: 'scene'}).click();

  //Third choice
  await expect(page.locator('.choice').first()).toBeVisible();
  await expect(page.locator('.choice').first()).not.toHaveText(choice2);

});