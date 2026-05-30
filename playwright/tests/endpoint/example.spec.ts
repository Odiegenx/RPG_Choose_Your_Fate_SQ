import { test, expect } from '@playwright/test';

const url = ""
//TODO: remove this describe and everything within it, when example is no longer needed
test.describe("example endpoint", ()=> {
    test('Valid GET request returning address', async ({ request }) => {
        const response = await request.get(url + 'address');
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data).toMatchObject({
            address: expect.objectContaining({
                number: expect.any(String),
                door: expect.anything(),
                town_name: expect.any(String),
                street: expect.any(String),
                floor: expect.anything(),
                postal_code: expect.any(String)
            })
        })

    });
})