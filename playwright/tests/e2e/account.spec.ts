import { expect, firefox, test, webkit, type APIRequestContext, type Browser, type Page } from '@playwright/test';

type AccountCredentials = {
  username: string;
  email: string;
  password: string;
};

type Character = {
  id: number;
  name: string;
};

const accountTestCharacterPrefix = 'account-e2e-';

function apiEndpoint(path: string) {
  if (!process.env.API_URL) {
    throw new Error('API_URL is missing. Add it to playwright/.env, for example: API_URL=http://localhost:8080/');
  }

  return process.env.API_URL + path;
}

function authorization(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function uniqueValue(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function newAccountCredentials(): AccountCredentials {
  const username = uniqueValue('account-page-user');

  return {
    username,
    email: `${username}@chooseyourfate.dk`,
    password: 'account-page-password',
  };
}

async function login(page: Page, credentials: AccountCredentials) {
  await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/.*\/account/);
  const token = await page.evaluate(() => window.localStorage.getItem('token'));
  expect(token).not.toBeNull();
  return token!;
}

async function registerAndLogin(page: Page) {
  const credentials = newAccountCredentials();

  await page.goto('/register');
  await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
  await page.getByRole('textbox', { name: 'email' }).fill(credentials.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
  await page.getByRole('button', { name: 'Register new account' }).click();

  await expect(page).not.toHaveURL(/.*\/register/);
  return {
    credentials,
    token: await login(page, credentials),
  };
}

async function openAccountPage(page: Page, token: string) {
  await page.addInitScript((savedToken) => {
    window.localStorage.setItem('token', savedToken);
  }, token);

  await page.goto('/account');
  await expect(page).toHaveURL(/.*\/account/);
  await expect(page.getByText('You are logged in (token present)')).toBeVisible();
}

async function openAccountPageInBrowser(browser: Browser, token: string) {
  const page = await browser.newPage();
  await openAccountPage(page, token);
  return page;
}

async function deleteCharacter(request: APIRequestContext, token: string, characterId: number) {
  const response = await request.delete(apiEndpoint(`choose-your-fate/characters/${characterId}`), {
    headers: authorization(token),
  });
  expect(response.status()).toBe(200);
}

async function createCharacterFromAccountPage(page: Page): Promise<Character> {
  await expect(page.getByText('New Character', { exact: true })).toBeVisible({ timeout: 15_000 });
  await page.getByText('New Character', { exact: true }).click();

  const nameInput = page.getByRole('textbox', { name: 'name' });
  const raceSelector = page.locator('#RaceDetailsSelector');
  const createButton = page.getByRole('button', { name: 'Create character' });
  const characterName = uniqueValue(accountTestCharacterPrefix);

  await expect(nameInput).toBeVisible();
  await expect(raceSelector).toBeVisible();
  await expect(createButton).toBeDisabled();

  await nameInput.fill(characterName);
  await raceSelector.selectOption({ label: 'Bobs' });
  await expect(createButton).toBeEnabled();

  const createResponsePromise = page.waitForResponse((response) =>
    response.url() === apiEndpoint('choose-your-fate/characters')
    && response.request().method() === 'POST'
  );
  await createButton.click();

  const createResponse = await createResponsePromise;
  expect(createResponse.status()).toBe(200);

  const character = await createResponse.json() as Character;
  await expect(page.getByText(characterName, { exact: true })).toBeVisible();
  return character;
}

async function chooseFirstAvailableOption(page: Page) {
  await page.locator('.App').click();

  const choice = page.locator('.choice').first();
  await expect(choice).toBeVisible();

  const lookaheadResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/choose-your-fate/scene/')
    && response.url().endsWith('/lookahead')
    && response.request().method() === 'GET'
  );
  await choice.click();

  const lookaheadResponse = await lookaheadResponsePromise;
  expect(lookaheadResponse.status()).toBe(200);
}

// Verifies that the protected account page cannot be opened without a saved login token.
test('account page redirects unauthenticated users to login', async ({ page }) => {
  await page.goto('/account');

  await expect(page).toHaveURL(/.*\/$/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});

// Verifies one complete account journey with one shared account and one character created by each browser engine.
// The paid TTS request runs once from Chromium after the three character slots have been filled.
test('account page supports registration, three browser character slots, logout, game choices, and TTS playback', async ({ browserName, page, request }) => {
  test.skip(browserName !== 'chromium', 'Chromium coordinates this shared-account journey and launches Firefox and WebKit.');
  test.setTimeout(240_000);

  const characters: Character[] = [];
  let token = '';

  try {
    const account = await registerAndLogin(page);
    token = account.token;

    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/.*\/$/);
    await expect(page.evaluate(() => window.localStorage.getItem('token'))).resolves.toBeNull();
    token = await login(page, account.credentials);

    characters.push(await createCharacterFromAccountPage(page));

    const firefoxBrowser = await firefox.launch();
    try {
      const firefoxPage = await openAccountPageInBrowser(firefoxBrowser, token);
      characters.push(await createCharacterFromAccountPage(firefoxPage));
    } finally {
      await firefoxBrowser.close();
    }

    const webkitBrowser = await webkit.launch();
    try {
      const webkitPage = await openAccountPageInBrowser(webkitBrowser, token);
      characters.push(await createCharacterFromAccountPage(webkitPage));
      await expect(webkitPage.getByText('New Character', { exact: true })).toHaveCount(0);
    } finally {
      await webkitBrowser.close();
    }

    await page.goto('/account');
    await expect(page.getByText('New Character', { exact: true })).toHaveCount(0);

    const character = characters[0];
    await page.getByText(character.name, { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Equipment' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Inventory' })).toBeVisible();
    await expect(page.getByText(`Name: ${character.name}`)).toBeVisible();
    await expect(page.getByText(`Story so far for ${character.name}`)).toBeVisible();

    await page.getByRole('button', { name: 'Play', exact: true }).click();
    await expect(page).toHaveURL(/.*\/game/);
    await chooseFirstAvailableOption(page);
    await chooseFirstAvailableOption(page);

    await page.goto('/account');
    await page.getByText(character.name, { exact: true }).click();
    await expect(page.locator('#paragraph')).not.toHaveText('Loading story...', { timeout: 120_000 });

    const audioResponsePromise = page.waitForResponse((response) =>
      response.url() === apiEndpoint(`choose-your-fate/character-paths/${character.id}/audio`)
      && response.request().method() === 'GET'
    , { timeout: 120_000 });
    await page.getByRole('button', { name: 'Generate Audio' }).click();

    const audioResponse = await audioResponsePromise;
    expect(audioResponse.status()).toBe(200);
    expect(audioResponse.headers()['content-type']).toContain('audio/mpeg');
    expect((await audioResponse.body()).length).toBeGreaterThan(0);

    const audio = page.locator('audio');
    await expect(audio).toBeAttached();
    await expect.poll(() => audio.evaluate((element) => !element.paused), { timeout: 30_000 }).toBe(true);
  } finally {
    for (const character of characters) {
      await deleteCharacter(request, token, character.id);
    }
  }
});
