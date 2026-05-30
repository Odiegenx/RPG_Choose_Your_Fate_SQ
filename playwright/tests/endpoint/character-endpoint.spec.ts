import { test, expect, type APIRequestContext } from '@playwright/test';

const rootEndpoint = 'choose-your-fate/characters';
const missingCharacterId = 999999999;

type Character = {
  id: number;
  accountId: number;
  chapterId: number;
  sceneId: number;
  raceDetailsId: number;
  name: string;
};

function endpoint(path = '') {
  if (!process.env.API_URL) {
    throw new Error('API_URL is missing. Add API_URL=http://localhost:8080/ to playwright/.env');
  }

  return process.env.API_URL + rootEndpoint + path;
}

function authorization(token: string | undefined) {
  return { Authorization: `Bearer ${token}` };
}

function uniqueName(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function createCharacter(
  request: APIRequestContext,
  token: string | undefined,
  data: { raceDetailsId: number; name: string; chapterId?: number; sceneId?: number },
) {
  const response = await request.post(endpoint(), {
    headers: authorization(token),
    data,
  });
  expect(response.status()).toBe(200);
  return response.json() as Promise<Character>;
}

async function deleteCharacter(
  request: APIRequestContext,
  token: string | undefined,
  characterId: number,
) {
  const response = await request.delete(endpoint(`/${characterId}`), {
    headers: authorization(token),
  });
  expect(response.status()).toBe(200);
}

test.describe('CharacterController endpoint tests', () => {
  test.describe.configure({ mode: 'serial' });

  // Verifies that the admin-only collection endpoint rejects requests without a JWT.
  test('GET /characters without token should return 403', async ({ request }) => {
    const response = await request.get(endpoint());
    expect(response.status()).toBe(403);
  });

  // Verifies that a normal user cannot retrieve every account's characters.
  test('GET /characters with USER token should return 403', async ({ request }) => {
    const response = await request.get(endpoint(), {
      headers: authorization(process.env.USER_TOKEN),
    });
    expect(response.status()).toBe(403);
  });

  // Verifies that an admin can retrieve the complete character collection.
  test('GET /characters with ADMIN token should return a list', async ({ request }) => {
    const response = await request.get(endpoint(), {
      headers: authorization(process.env.ADMIN_TOKEN),
    });
    expect(response.status()).toBe(200);
    expect(Array.isArray(await response.json())).toBe(true);
  });

  // Verifies that an admin can retrieve one existing character by id.
  test('GET /characters/{id} with ADMIN token should return the requested character', async ({ request }) => {
    const created = await createCharacter(request, process.env.ADMIN_TOKEN, {
      raceDetailsId: 1,
      name: uniqueName('get-admin'),
    });

    try {
      const response = await request.get(endpoint(`/${created.id}`), {
        headers: authorization(process.env.ADMIN_TOKEN),
      });
      expect(response.status()).toBe(200);
      expect((await response.json() as Character).id).toBe(created.id);
    } finally {
      await deleteCharacter(request, process.env.ADMIN_TOKEN, created.id);
    }
  });

  // Verifies object-level authorization: a user cannot read an admin-owned character.
  test('GET /characters/{id} with USER token for another account should return 403', async ({ request }) => {
    const created = await createCharacter(request, process.env.ADMIN_TOKEN, {
      raceDetailsId: 1,
      name: uniqueName('get-forbidden'),
    });

    try {
      const response = await request.get(endpoint(`/${created.id}`), {
        headers: authorization(process.env.USER_TOKEN),
      });
      expect(response.status()).toBe(403);
    } finally {
      await deleteCharacter(request, process.env.ADMIN_TOKEN, created.id);
    }
  });

  // Verifies that a well-formed id which is not stored returns not found.
  test('GET /characters/{id} with missing id should return 404', async ({ request }) => {
    const response = await request.get(endpoint(`/${missingCharacterId}`), {
      headers: authorization(process.env.ADMIN_TOKEN),
    });
    expect(response.status()).toBe(404);
  });

  // Verifies that the combined character-screen endpoint is protected.
  test('GET /characters/all/view without token should return 403', async ({ request }) => {
    const response = await request.get(endpoint('/all/view'));
    expect(response.status()).toBe(403);
  });

  // Verifies that the signed-in user receives character views and creation-limit information.
  test('GET /characters/all/view with USER token should return view data', async ({ request }) => {
    const response = await request.get(endpoint('/all/view'), {
      headers: authorization(process.env.USER_TOKEN),
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
      views: expect.any(Array),
      canCreateMoreCharacters: expect.any(Boolean),
    });
  });

  // Verifies that the signed-in account collection endpoint is protected.
  test('GET /characters/all without token should return 403', async ({ request }) => {
    const response = await request.get(endpoint('/all'));
    expect(response.status()).toBe(403);
  });

  // Verifies that a user can retrieve the collection tied to their JWT account.
  test('GET /characters/all with USER token should return one account collection', async ({ request }) => {
    const response = await request.get(endpoint('/all'), {
      headers: authorization(process.env.USER_TOKEN),
    });
    expect(response.status()).toBe(200);

    const data = await response.json() as Character[];
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      expect(data.every(character => character.accountId === data[0].accountId)).toBe(true);
    }
  });

  // Verifies the common create flow where chapter and scene are derived from the race.
  test('POST /characters with USER token and race should create defaults', async ({ request }) => {
    const created = await createCharacter(request, process.env.USER_TOKEN, {
      raceDetailsId: 1,
      name: uniqueName('create-user'),
    });

    try {
      expect(created.raceDetailsId).toBe(1);
      expect(created.chapterId).toBe(3);
      expect(created.sceneId).toBe(3);
    } finally {
      await deleteCharacter(request, process.env.USER_TOKEN, created.id);
    }
  });

  // Verifies that an admin can explicitly choose a valid chapter and scene.
  test('POST /characters with valid explicit references should create a character', async ({ request }) => {
    const created = await createCharacter(request, process.env.ADMIN_TOKEN, {
      chapterId: 1,
      sceneId: 1,
      raceDetailsId: 1,
      name: uniqueName('create-admin'),
    });

    try {
      expect(created.chapterId).toBe(1);
      expect(created.sceneId).toBe(1);
    } finally {
      await deleteCharacter(request, process.env.ADMIN_TOKEN, created.id);
    }
  });

  // Verifies that the create endpoint rejects requests without a JWT.
  test('POST /characters without token should return 403', async ({ request }) => {
    const response = await request.post(endpoint(), {
      data: { raceDetailsId: 1, name: uniqueName('create-no-token') },
    });
    expect(response.status()).toBe(403);
  });

  // Verifies that creation fails when the selected race does not exist.
  test('POST /characters with missing race should return 404', async ({ request }) => {
    const response = await request.post(endpoint(), {
      headers: authorization(process.env.ADMIN_TOKEN),
      data: { raceDetailsId: missingCharacterId, name: uniqueName('create-missing-race') },
    });
    expect(response.status()).toBe(404);
  });

  // Verifies the rule that a selected scene must belong to the selected chapter.
  test('POST /characters with mismatched chapter and scene should return 400', async ({ request }) => {
    const response = await request.post(endpoint(), {
      headers: authorization(process.env.ADMIN_TOKEN),
      data: { chapterId: 1, sceneId: 2, raceDetailsId: 1, name: uniqueName('create-mismatch') },
    });
    expect(response.status()).toBe(400);
  });

  // Documents the current behavior when the required race id is omitted.
  test('POST /characters without race should return 500', async ({ request }) => {
    const response = await request.post(endpoint(), {
      headers: authorization(process.env.ADMIN_TOKEN),
      data: { name: uniqueName('create-no-race') },
    });
    expect(response.status()).toBe(500);
  });

  // Verifies that an unauthenticated delete is rejected and leaves the character intact.
  test('DELETE /characters/{id} without token should return 403 and preserve data', async ({ request }) => {
    const created = await createCharacter(request, process.env.ADMIN_TOKEN, {
      raceDetailsId: 1,
      name: uniqueName('delete-no-token'),
    });

    try {
      const response = await request.delete(endpoint(`/${created.id}`));
      expect(response.status()).toBe(403);
    } finally {
      await deleteCharacter(request, process.env.ADMIN_TOKEN, created.id);
    }
  });

  // Verifies object-level authorization: a user cannot delete an admin-owned character.
  test('DELETE /characters/{id} with USER token for another account should return 403', async ({ request }) => {
    const created = await createCharacter(request, process.env.ADMIN_TOKEN, {
      raceDetailsId: 1,
      name: uniqueName('delete-forbidden'),
    });

    try {
      const response = await request.delete(endpoint(`/${created.id}`), {
        headers: authorization(process.env.USER_TOKEN),
      });
      expect(response.status()).toBe(403);
    } finally {
      await deleteCharacter(request, process.env.ADMIN_TOKEN, created.id);
    }
  });

  // Verifies that an admin can delete an existing character.
  test('DELETE /characters/{id} with ADMIN token should remove the character', async ({ request }) => {
    const created = await createCharacter(request, process.env.ADMIN_TOKEN, {
      raceDetailsId: 1,
      name: uniqueName('delete-admin'),
    });

    await deleteCharacter(request, process.env.ADMIN_TOKEN, created.id);

    const verification = await request.get(endpoint(`/${created.id}`), {
      headers: authorization(process.env.ADMIN_TOKEN),
    });
    expect(verification.status()).toBe(404);
  });

  // Verifies that deleting a well-formed id which is not stored returns not found.
  test('DELETE /characters/{id} with missing id should return 404', async ({ request }) => {
    const response = await request.delete(endpoint(`/${missingCharacterId}`), {
      headers: authorization(process.env.ADMIN_TOKEN),
    });
    expect(response.status()).toBe(404);
  });
});
