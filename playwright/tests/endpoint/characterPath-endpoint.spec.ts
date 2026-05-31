import { test, expect } from '@playwright/test';

const rootEndpoint = "choose-your-fate/character-paths";

const userCharacterId = 5;
const adminCharacterId = 1;

test.describe("character-paths Get All endpoint", () => {
    test('Without token should return 403', async ({ request }) => {
        const response = await request.get(process.env.API_URL + rootEndpoint);
        expect(response.status()).toBe(403);
    });

    test('With token of USER should return 403', async ({ request }) => {
        const response = await request.get(process.env.API_URL + rootEndpoint, {
            headers: { Authorization: `Bearer ${process.env.USER_TOKEN}` }
        });
        expect(response.status()).toBe(403);
    });

    test('With token of ADMIN should return 200 and a list', async ({ request }) => {
        const response = await request.get(process.env.API_URL + rootEndpoint, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` }
        });
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });
});

test.describe("character-paths Get by characterId endpoint", () => {
    test('Without token should return 403', async ({ request }) => {
        const response = await request.get(process.env.API_URL + rootEndpoint + `/${adminCharacterId}`);
        expect(response.status()).toBe(403);
    });

    test('With ADMIN token should return 200', async ({ request }) => {
        const response = await request.get(process.env.API_URL + rootEndpoint + `/${adminCharacterId}`, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` }
        });
        expect(response.status()).toBe(200);
        const data = await response.json()
        expect(data).not.toBeNull();
        expect(data.characterId).toBe(adminCharacterId)
        expect(typeof data.summary).toBe('string');
        
    });

    test('With USER token for own character should return 200', async ({ request }) => {
        const response = await request.get(process.env.API_URL + rootEndpoint + `/${userCharacterId}`, {
            headers: { Authorization: `Bearer ${process.env.USER_TOKEN}` }
        });
        expect(response.status()).toBe(200);
        const data = await response.json()
        expect(data).not.toBeNull();
        expect(data.characterId).toBe(userCharacterId)
        expect(typeof data.summary).toBe('string');
    });

    test('With USER token for another users character should return 403', async ({ request }) => {
        const response = await request.get(process.env.API_URL + rootEndpoint + `/${adminCharacterId}`, {
            headers: { Authorization: `Bearer ${process.env.USER_TOKEN}` }
        });
        expect(response.status()).toBe(403);
    });

    test('With id that doesnt exist should return 404', async ({ request }) => {
        const response = await request.get(process.env.API_URL + rootEndpoint + "/99999", {
            headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` }
        });
        expect(response.status()).toBe(404);
    });
});

test.describe("character-paths Update endpoint", () => {
    test('Without token should return 403', async ({ request }) => {
        const response = await request.put(process.env.API_URL + rootEndpoint + `/${adminCharacterId}`, {
            data: { currentChapterId: 1 }
        });
        expect(response.status()).toBe(403);
    });

    test('With ADMIN token should return 200', async ({ request }) => {
        const newSummary = "test summary " + Math.random().toString(36).substring(2, 10);
        const response = await request.put(process.env.API_URL + rootEndpoint + `/${adminCharacterId}`, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
            data: { summary: newSummary }
        });
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.summary).toBe(newSummary);
        expect(data.characterId).toBe(adminCharacterId);
    });

    test('With USER token for own character should return 200', async ({ request }) => {
        const newSummary = "test summary " + Math.random().toString(36).substring(2, 10);
        const response = await request.put(process.env.API_URL + rootEndpoint + `/${userCharacterId}`, {
            headers: { Authorization: `Bearer ${process.env.USER_TOKEN}` },
            data: { summary: newSummary }
        });
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.summary).toBe(newSummary);
        expect(data.characterId).toBe(userCharacterId);
    });

    test('With USER token for another users character should return 403', async ({ request }) => {
        const response = await request.put(process.env.API_URL + rootEndpoint + `/${adminCharacterId}`, {
            headers: { Authorization: `Bearer ${process.env.USER_TOKEN}` },
            data: { currentChapterId: 1 }
        });
        expect(response.status()).toBe(403);
    });
});

test.describe("character-paths Update choices endpoint", () => {
    let adminSceneId: number;
    let userSceneId: number;

    test.beforeEach(async ({ request }) => {
        const userCharacterResponse = await request.get(process.env.API_URL + `choose-your-fate/characters/${userCharacterId}`, {
            headers: { Authorization: `Bearer ${process.env.USER_TOKEN}` }
        });
        const userCharacterData = await userCharacterResponse.json();
        userSceneId = userCharacterData.sceneId;

        const adminCharacterResponse = await request.get(process.env.API_URL + `choose-your-fate/characters/${adminCharacterId}`, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` }
        });
        const adminCharacterData = await adminCharacterResponse.json();
        adminSceneId = adminCharacterData.sceneId;
    });

    test('Without token should return 403', async ({ request }) => {
        const response = await request.put(process.env.API_URL + rootEndpoint + `/${adminCharacterId}/chosen/${adminSceneId}`);
        expect(response.status()).toBe(403);
    });

    test('With ADMIN token should return 200', async ({ request }) => {
        const response = await request.put(process.env.API_URL + rootEndpoint + `/${adminCharacterId}/chosen/${adminSceneId}`, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` }
        });
        expect(response.status()).toBe(200);
    });

    test('With USER token for own character should return 200', async ({ request }) => {
        const response = await request.put(process.env.API_URL + rootEndpoint + `/${userCharacterId}/chosen/${userSceneId}`, {
            headers: { Authorization: `Bearer ${process.env.USER_TOKEN}` }
        });
        expect(response.status()).toBe(200);
    });

        test('With USER token for another users character should return 403', async ({ request }) => {
        const response = await request.put(process.env.API_URL + rootEndpoint + `/${adminCharacterId}/chosen/${adminSceneId}`, {
            headers: { Authorization: `Bearer ${process.env.USER_TOKEN}` }
        });
        expect(response.status()).toBe(403);
    });

});