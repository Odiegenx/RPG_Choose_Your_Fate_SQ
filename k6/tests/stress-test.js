/**
 * STRESS TEST — GET /choose-your-fate/scenes/1/lookahead
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
import { getToken, authHeaders, BASE_URL } from './auth.js';

const sceneResponseTime = new Trend('scene_lookahead_response_time');
const sceneErrorRate = new Rate('scene_lookahead_error_rate');

export const options = {
  stages: [
    { duration: '30s', target: 20  },
    { duration: '30s', target: 50  },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0   },
  ],
  thresholds: {
    // Under stress we allow slightly higher response times
    scene_lookahead_response_time: ['p(95)<1500'],
    scene_lookahead_error_rate: ['rate<0.05'],
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

export default function (data) {
  const sceneId = Math.floor(Math.random() * 100) + 1;
  const res = http.get(
    `${BASE_URL}/choose-your-fate/scene/${sceneId}/lookahead`,
    authHeaders(data.token)
  );

  sceneResponseTime.add(res.timings.duration);
  sceneErrorRate.add(res.status !== 200);

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
