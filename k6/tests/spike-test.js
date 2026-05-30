/**
 * SPIKE TEST — GET /choose-your-fate/scenes/1/lookahead
 *
 * Simulates a sudden massive surge in traffic, then a drop back to normal.
 * Goal: verify the system can survive and recover from sudden traffic spikes.
 *
 * Stages:
 *   0 → 5    users over 10s   (baseline)
 *   5 → 200  users over 10s   (sudden spike)
 *   200 → 5  users over 10s   (spike drops)
 *   5 users  for 30s           (recovery observation)
 *   5 → 0    users over 10s   (ramp down)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { getToken, authHeaders, BASE_URL } from './auth.js';

const sceneResponseTime = new Trend('scene_lookahead_response_time');
const sceneErrorRate = new Rate('scene_lookahead_error_rate');

export const options = {
  stages: [
    { duration: '10s', target: 5   },
    { duration: '10s', target: 200 },
    { duration: '10s', target: 5   },
    { duration: '30s', target: 5   },
    { duration: '10s', target: 0   },
  ],
  thresholds: {
    // Spike tests are expected to be rough — we're mainly watching for total failure
    scene_lookahead_response_time: ['p(95)<3000'],
    scene_lookahead_error_rate: ['rate<0.10'],
    http_req_failed: ['rate<0.10'],
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
    'response time < 3000ms': (r) => r.timings.duration < 3000,
    'body is not empty':      (r) => r.body && r.body.length > 0,
    'response is valid JSON': (r) => {
      try { JSON.parse(r.body); return true; } catch { return false; }
    },
  });

  sleep(1);
}
