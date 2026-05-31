/**
 * LOAD TEST — GET /choose-your-fate/characters/all/view
 *
 * Simulates a realistic number of concurrent users sustaining normal traffic.
 * Goal: verify the endpoint handles expected load with acceptable response times.
 *
 * Stages:
 *   0 → 20 users over 30s  (ramp up)
 *   20 users for 1 minute  (sustained load)
 *   20 → 0 users over 30s  (ramp down)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { getToken, authHeaders, BASE_URL } from '../setup/auth.js';

const characterViewResponseTime = new Trend('character_multi_view_response_time');
const characterViewErrorRate = new Rate('character_multi_view_error_rate');

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m',  target: 20 },
    { duration: '30s', target: 0  },
  ],
  thresholds: {
    // 95% of requests must complete within 500ms
    character_multi_view_response_time: ['p(95)<500'],
    // Error rate must stay below 1%
    character_multi_view_error_rate: ['rate<0.01'],
    http_req_failed: ['rate<0.01'],
  },
};

// Runs once per VU before the test starts — get a token per virtual user
export function setup() {
  const token = getToken();
  if (!token) {
    throw new Error('Could not retrieve JWT token during setup. Check your credentials.');
  }
  return { token };
}

export default function characterMultiView(data) {
  const res = http.get(
    `${BASE_URL}/choose-your-fate/characters/all/view`,
    authHeaders(data.token)
  );

  characterViewResponseTime.add(res.timings.duration);
  characterViewErrorRate.add(res.status !== 200);

  check(res, {
    'status is 200':              (r) => r.status === 200,
    'response time < 500ms':      (r) => r.timings.duration < 500,
    'body is not empty':          (r) => r.body && r.body.length > 0,
    'response is valid JSON':     (r) => {
      try { JSON.parse(r.body); return true; } catch { return false; }
    },
  });

  sleep(1);
}