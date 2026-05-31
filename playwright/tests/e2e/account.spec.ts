import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

type Character = {
  id: number;
  name: string;
};

type AuthenticatedAccount = {
  id: number;
  token: string;
};

const accountTestCharacterPrefix = 'account-e2e-';
const accountTestUsername = 'account-page-e2e-user';
const accountTestEmail = 'account-page-e2e-user@chooseyourfate.dk';
const accountTestPassword = 'account-page-e2e-password';
const accountTestCharacterLimit = 20;

test.describe.configure({ mode: 'serial' });

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

function tokenAccountId(token: string) {
  const payload = token.split('.')[1];
  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
  const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
  const claims = JSON.parse(Buffer.from(paddedPayload, 'base64').toString('utf8')) as { sqlId: string };
  return Number(claims.sqlId);
}

async function getDedicatedAccount(request: APIRequestContext): Promise<AuthenticatedAccount> {
  await request.post(apiEndpoint('auth/register'), {
    data: {
      username: accountTestUsername,
      email: accountTestEmail,
      password: accountTestPassword,
    },
  });

  const loginResponse = await request.post(apiEndpoint('auth/login'), {
    data: {
      username: accountTestUsername,
      password: accountTestPassword,
    },
  });
  expect(loginResponse.status()).toBe(200);

  const { token } = await loginResponse.json() as { token: string };
  const account = {
    id: tokenAccountId(token),
    token,
  };

  const updateResponse = await request.put(apiEndpoint(`choose-your-fate/accounts/${account.id}`), {
    headers: authorization(account.token),
    data: {
      characterLimit: accountTestCharacterLimit,
    },
  });
  expect(updateResponse.status()).toBe(200);

  return account;
}

async function openAccountPage(page: Page, token: string) {
  await page.addInitScript((savedToken) => {
    window.localStorage.setItem('token', savedToken);
  }, token);

  await page.goto('/account');
  await expect(page).toHaveURL(/.*\/account/);
  await expect(page.getByText('You are logged in (token present)')).toBeVisible();
}

async function createCharacter(request: APIRequestContext, token: string): Promise<Character> {
  const response = await request.post(apiEndpoint('choose-your-fate/characters'), {
    headers: authorization(token),
    data: {
      raceDetailsId: 1,
      name: uniqueValue(accountTestCharacterPrefix),
    },
  });
  expect(response.status()).toBe(200);

  return response.json() as Promise<Character>;
}

async function setCharacterSummary(request: APIRequestContext, token: string, characterId: number, summary: string) {
  const response = await request.put(apiEndpoint(`choose-your-fate/character-paths/${characterId}`), {
    headers: authorization(token),
    data: { summary },
  });
  expect(response.status()).toBe(200);
}

async function deleteCharacter(request: APIRequestContext, token: string, characterId: number) {
  const response = await request.delete(apiEndpoint(`choose-your-fate/characters/${characterId}`), {
    headers: authorization(token),
  });
  expect(response.status()).toBe(200);
}

async function createCharacterFromAccountPage(page: Page): Promise<Character> {
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

// Verifies that a signed-in user can open the account page and return to login by logging out.
test('account page shows the signed-in state and logs the user out', async ({ page, request }) => {
  const { token } = await getDedicatedAccount(request);
  await openAccountPage(page, token);

  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page).toHaveURL(/.*\/$/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.evaluate(() => window.localStorage.getItem('token'))).resolves.toBeNull();
});

// Verifies the account-page character creation flow, including required fields and the refreshed list.
test('account page creates a character from the new-character form', async ({ page, request }) => {
  const { token } = await getDedicatedAccount(request);
  let createdCharacter: Character | null = null;

  try {
    await openAccountPage(page, token);
    createdCharacter = await createCharacterFromAccountPage(page);
  } finally {
    if (createdCharacter) {
      await deleteCharacter(request, token, createdCharacter.id);
    }
  }
});

// Verifies that selecting a character reveals its account-page details and that Play opens the game with that character.
test('account page opens character details, shows the story, and starts the game', async ({ page, request }) => {
  const { token } = await getDedicatedAccount(request);
  const character = await createCharacter(request, token);

  try {
    await setCharacterSummary(request, token, character.id, 'The account E2E character is ready to continue the story.');
    await openAccountPage(page, token);
    await page.getByText(character.name, { exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Equipment' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Inventory' })).toBeVisible();
    await expect(page.getByText(`Name: ${character.name}`)).toBeVisible();
    await expect(page.getByText(`Story so far for ${character.name}`)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate Audio' })).toBeVisible();

    await page.getByRole('button', { name: 'Play', exact: true }).click();

    await expect(page).toHaveURL(/.*\/game/);
    await expect(page.evaluate(() => window.localStorage.getItem('characterId'))).resolves.toBe(character.id.toString());
  } finally {
    await deleteCharacter(request, token, character.id);
  }
});

// Verifies the live TTS journey once in Chromium: create a character, make two choices, generate MP3 data, and play it.
// To run the paid TTS check in Firefox or WebKit as well, comment out the skip below.
// Firefox and WebKit remain listed by Playwright and will run the same test body once the skip is removed.
test('generate audio calls the TTS endpoint and starts audio playback', async ({ browserName, page, request }) => {
  test.skip(browserName !== 'chromium', 'The live TTS playback check runs once and uses Chromium autoplay behavior.');
  test.setTimeout(180_000);

  const { token } = await getDedicatedAccount(request);
  let character: Character | null = null;

  try {
    await openAccountPage(page, token);
    character = await createCharacterFromAccountPage(page);
    const characterId = character.id;
    await page.getByText(character.name, { exact: true }).click();
    await page.getByRole('button', { name: 'Play', exact: true }).click();

    await expect(page).toHaveURL(/.*\/game/);
    await chooseFirstAvailableOption(page);
    await chooseFirstAvailableOption(page);

    await page.goto('/account');
    await page.getByText(character.name, { exact: true }).click();
    await expect(page.locator('#paragraph')).not.toHaveText('Loading story...', { timeout: 120_000 });

    const audioResponsePromise = page.waitForResponse((response) =>
      response.url() === apiEndpoint(`choose-your-fate/character-paths/${characterId}/audio`)
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
    if (character) {
      await deleteCharacter(request, token, character.id);
    }
  }
});
