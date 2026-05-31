import { expect, test as setup } from '@playwright/test';

const rootEndpoint = "auth/"


setup('create new ADMIN token', async ({ request}) => {
    //Username and password are static in this file, so they can be run by the auditors of the exam
    //Normally they would be passed through the .env file
    const response = await request.post(process.env.API_URL + rootEndpoint + "login",
            {
                data: {
                    username: "admin",
                    password: "admin123"
                }
            }
        );

    expect(response.status()).toBe(200);
    const responseToken: { token: string, tokenType: string} = await response.json();

    process.env.ADMIN_TOKEN = responseToken.token;

});

setup('create new USER token', async ({ request}) => {
    //Username and password are static in this file, so they can be run by the auditors of the exam
    //Normally they would be passed through the .env file
    const response = await request.post(process.env.API_URL + rootEndpoint + "login",
            {
                data: {
                    username: "fisk",
                    password: "fisk123"
                }
            }
        );

    expect(response.status()).toBe(200);
    const responseToken: { token: string, tokenType: string} = await response.json();
    
    process.env.USER_TOKEN = responseToken.token;
});