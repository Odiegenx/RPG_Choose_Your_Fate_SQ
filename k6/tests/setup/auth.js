import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

/**
 * Logs in and returns a JWT token.
 * Expects env vars K6_USERNAME and K6_PASSWORD to be set,
 * or falls back to default test credentials.
 */
export function getToken() {
  const credentials = {
    username: __ENV.K6_USERNAME,
    password: __ENV.K6_PASSWORD
  };

  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify(credentials),
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (res.status !== 200) {
    console.error(`Login failed: ${res.status} ${res.body}`);
    return null;
  }

  const body = JSON.parse(res.body);
  // Adjust 'token' to match whatever field your API returns, e.g. 'accessToken'
  return body.token;
}

export function authHeaders(token) {
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}

export { BASE_URL };
