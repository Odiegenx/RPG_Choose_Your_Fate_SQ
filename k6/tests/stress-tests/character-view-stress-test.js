/**
 * STRESS TEST — GET /choose-your-fate/characters/all/view
 *
 * Gradually pushes load beyond normal capacity to find the breaking point.
 * Goal: identify at what user count the system degrades or fails.
 *
 * Stages:
 *   0 → 20  users over 30s  (normal load)
 *   20 → 50  users over 30s  (above normal)
 *   50 → 100 users over 30s  (high stress)
 *   100 → 0  users over 30s  (recovery)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { getToken, authHeaders, BASE_URL } from '../setup/auth.js';

const characterViewResponseTime = new Trend('character_multi_view_response_time');
const characterViewErrorRate = new Rate('character_multi_view_error_rate');

export const options = {
  stages: [
    { duration: '30s', target: 20  },
    { duration: '30s', target: 50  },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0   },
  ],
  thresholds: {
    // Under stress we allow slightly higher response times
    character_multi_view_response_time: ['p(95)<1500'],
    character_multi_view_error_rate: ['rate<0.05'],
    http_req_failed: ['rate<0.05'],
  },
};

export function setup() {
  const token = getToken();
  if (!token) {
    throw new Error('Could not retrieve JWT token during setup. Check your credentials.');
  }
  return { token };
}

export default function characterMultiViewStressTest(data) {
  const res = http.get(
    `${BASE_URL}/choose-your-fate/characters/all/view`,
    authHeaders(data.token)
  );

  characterViewResponseTime.add(res.timings.duration);
  characterViewErrorRate.add(res.status !== 200);

  check(res, {
    'status is 200':          (r) => r.status === 200,
    'response time < 1500ms': (r) => r.timings.duration < 1500,
    'body is not empty':      (r) => r.body && r.body.length > 0,
    'response is valid JSON': (r) => {
      try { JSON.parse(r.body); return true; } catch { return false; }
    },
  });

  sleep(1);
}