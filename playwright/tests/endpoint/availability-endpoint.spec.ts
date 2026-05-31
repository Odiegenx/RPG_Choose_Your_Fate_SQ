import {test , expect, APIRequestContext} from '@playwright/test';


const rootEndpoint = 'availability';

test.skip(({ browserName }) => browserName !== 'chromium',
    'Stateful backend; serialized to chromium project only');

const adminHeaders = () => ({ Authorization: `Bearer ${process.env.ADMIN_TOKEN}` });
const userHeaders = () => ({ Authorization: `Bearer ${process.env.USER_TOKEN}` });

// Makes sure the tests run serally, as these tests mutate the gobal routing state on the backend.
test.describe.configure({mode: 'serial'})


async function ensurePrimaryActiveState(request: APIRequestContext): Promise<void> {
    const statusResponse = await request.get(
        process.env.API_URL + rootEndpoint + '/status',
        { headers: adminHeaders() }
    );
    if (statusResponse.status() !== 200) {
        throw new Error(
            `Cleanup precheck failed: GET /status returned ${statusResponse.status()}`
        );
    }
    const data = await statusResponse.json();

    if (data.state === "PRIMARY_ACTIVE") return;

    if (data.state === "SECONDARY_ACTIVE") {
        const begin = await request.post(
            process.env.API_URL + rootEndpoint + '/failback/begin',
            { headers: adminHeaders() }
        );
        if (begin.status() !== 200) {
            throw new Error(`failback/begin failed with ${begin.status()}: ${await begin.text()}`);
        }
        const complete = await request.post(
            process.env.API_URL + rootEndpoint + '/failback/complete',
            { headers: adminHeaders() }
        );
        if (complete.status() !== 200) {
            throw new Error(`failback/complete failed with ${complete.status()}: ${await complete.text()}`);
        }
        return;
    }

    if (data.state === "FAILBACK_IN_PROGRESS") {
        const complete = await request.post(
            process.env.API_URL + rootEndpoint + '/failback/complete',
            { headers: adminHeaders() }
        );
        if (complete.status() !== 200) {
            throw new Error(`failback/complete failed with ${complete.status()}: ${await complete.text()}`);
        }
        return;
    }

    throw new Error(`Unrecoverable state in cleanup: ${data.state}`);
}


//
// AUTHORIZATION TESTS
//
test.describe("Authorization: GET /availability/status", () => {
    test('Without token should return 403', async ({ request }) => {
        const response = await request.get(process.env.API_URL + rootEndpoint + "/status");
        expect(response.status()).toBe(403);
    });

    test('With token of USER should return 403', async ({ request }) => {
        const response = await request.get(process.env.API_URL + rootEndpoint + "/status",
            { headers: userHeaders() });
        expect(response.status()).toBe(403);
    });

    test('With token of ADMIN should return 200', async ({ request }) => {
        const response = await request.get(process.env.API_URL + rootEndpoint + "/status",
            { headers: adminHeaders() });
        expect(response.status()).toBe(200);
    });
});

test.describe("Authorization: POST /availability/failover", () => {
    test.afterEach(async ({ request }) => { await ensurePrimaryActiveState(request); });

    test('Without token should return 403', async ({ request }) => {
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failover");
        expect(response.status()).toBe(403);
    });

    test('With token of USER should return 403', async ({ request }) => {
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failover",
            { headers: userHeaders() });
        expect(response.status()).toBe(403);
    });
});
test.describe("Authorization: POST /availability/failback/begin", () => {
    test('Without token should return 403', async ({ request }) => {
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failback/begin");
        expect(response.status()).toBe(403);
    });

    test('With token of USER should return 403', async ({ request }) => {
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failback/begin",
            { headers: userHeaders() });
        expect(response.status()).toBe(403);
    });
});

test.describe("Authorization: POST /availability/failback/complete", () => {
    test('Without token should return 403', async ({ request }) => {
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failback/complete");
        expect(response.status()).toBe(403);
    });

    test('With token of USER should return 403', async ({ request }) => {
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failback/complete",
            { headers: userHeaders() });
        expect(response.status()).toBe(403);
    });
});

test.describe("GET /availability/status",()=> {
    test.beforeEach(async ({request}) => {
        await ensurePrimaryActiveState(request);
    })
    test.afterEach(async ({request}) => {
        await ensurePrimaryActiveState(request);
    });
    test('Returns 200 with full AvailabilityStatusResponse', async ({request}) => {
        const response = await request.get(process.env.API_URL + rootEndpoint + '/status', { headers: adminHeaders() });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('state');
        expect(data).toHaveProperty('activeRole');
        expect(data).toHaveProperty('maintenanceMode');
        expect(data).toHaveProperty('primaryConsecutiveFailures');
        expect(data).toHaveProperty('pendingReplicationJobs');
        expect(data).toHaveProperty('completedReplicationJobs');
        expect(data).toHaveProperty('deadLetterReplicationJobs');
    });

    test('Returns PRIMARY_ACTIVE by default', async ({request}) => {
        const response = await request.get(process.env.API_URL + rootEndpoint + "/status", { headers: adminHeaders() });
        const data = await response.json();

        expect(data.state).toBe('PRIMARY_ACTIVE');
        expect(data.activeRole).toBe('PRIMARY');
        expect(data.maintenanceMode).toBe(false);
    });

    test('Reflects SECONDARY_ACTIVE state after failover', async ({request}) => {
        // Arrange - trigger failover
        await request.post(process.env.API_URL + rootEndpoint + '/failover', { headers: adminHeaders() });
        // act
        const response = await request.get(process.env.API_URL + rootEndpoint + '/status', { headers: adminHeaders() });
        // Assert
        const data = await response.json();
        expect(data.state).toBe('SECONDARY_ACTIVE');
        expect(data.activeRole).toBe('SECONDARY');
        // clean is handled in beforeEach for the next test.
    });
});

test.describe("POST /availability/failover", ()=> {
    test.beforeEach(async ({request}) => {
        await ensurePrimaryActiveState(request);
    })
    test.afterEach(async ({request}) => {
        await ensurePrimaryActiveState(request);
    });
    test('Valid partition: from PRIMARY_ACTIVE returns 200 and to SECONDARY on failover trigger', async ({request}) => {
        // act
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failover", { headers: adminHeaders() });
        const data = await response.json();
        // assert
        expect(response.status()).toBe(200);

        expect(data.state).toBe("SECONDARY_ACTIVE");
        expect(data.activeRole).toBe("SECONDARY");
    });
    test('Invalid partition: from SECONDARY_ACTIVE returns 503 if failover is triggered twice', async ({request}) => {
        // Arrange - set failover
        await request.post(process.env.API_URL + rootEndpoint + "/failover", { headers: adminHeaders() });
        // Act - try failover again
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failover", { headers: adminHeaders() });
        // Assert
        expect(response.status()).toBe(503);
        const data = await response.json();
        expect(data.error).toBe("Service Unavailable");
        expect(data.message).toContain("PRIMARY_ACTIVE"); // since failover is not yet completed
    });
});
test.describe("POST /availability/failback/begin", ()=> {
    test.beforeEach(async ({request}) => {
        await ensurePrimaryActiveState(request);
    })
    test.afterEach(async ({request}) => {
        await ensurePrimaryActiveState(request);
    })
    test('Valid partition: from SECONDARY_ACTIVE returns 200 and enter maintenacne on failback begin', async ({request}) => {
        // Arrange - trigger failover first to get to SECONDARY_ACTIVE
        await request.post(process.env.API_URL + rootEndpoint + "/failover", { headers: adminHeaders() });
        // act
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failback/begin", { headers: adminHeaders() });
        // Assert
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.state).toBe("FAILBACK_IN_PROGRESS");
        expect(data.maintenanceMode).toBe(true);
    })
    test('Invalid partion: from PRIMARY_ACTIVE returns 503 if failback is triggered if state is PRIMARY_ACTIVE', async ({request}) => {
        // we are already in PRIMARY_ACTIVE
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failback/begin", { headers: adminHeaders() });
        expect(response.status()).toBe(503);
        const data = await response.json();
        expect(data.error).toBe("Service Unavailable");
    });
});

test.describe("POST /availability/failback/complete", ()=>{
    test.beforeEach(async ({request}) => {
        await ensurePrimaryActiveState(request);
    });
    test.afterEach(async ({request}) => {
        await ensurePrimaryActiveState(request);
    });
    test('Valid partition: from FAILBACK_IN_PROGRESS returns 200 and returns PRIMARY after failback complete', async ({request}) => {
        // arrange - set FAILBACK_IN_PROGRESS state
        await request.post(process.env.API_URL + rootEndpoint + "/failover", { headers: adminHeaders() });
        await request.post(process.env.API_URL + rootEndpoint + "/failback/begin", { headers: adminHeaders() });
        // Act
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failback/complete", { headers: adminHeaders() });
        // Assert
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.state).toBe("PRIMARY_ACTIVE");
        expect(data.activeRole).toBe("PRIMARY");
        expect(data.maintenanceMode).toBe(false);
    })
    test('Invalid partition: from PRIMARY_ACTIVE returns 503 if failback/complete is attempted', async ({request}) => {
        const response = await request.post(process.env.API_URL + rootEndpoint + "/failback/complete", { headers: adminHeaders() });
        expect(response.status()).toBe(503);
    })

});