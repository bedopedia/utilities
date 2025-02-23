import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failureRate = new Rate('failed_requests');

export const options = {
  stages: [
    { duration: __ENV.RAMP_UP_DURATION, target: __ENV.VUS_INITIAL },
    { duration: __ENV.STEADY_STATE_DURATION, target: __ENV.VUS_INITIAL },
    { duration: __ENV.RAMP_UP_DURATION, target: __ENV.VUS_MAX },
    { duration: __ENV.STEADY_STATE_DURATION, target: __ENV.VUS_MAX },
    { duration: __ENV.RAMP_DOWN_DURATION, target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    failed_requests: ['rate<0.1'],
  },
};

const BASE_URL = `http://${__ENV.TARGET_HOST}:${__ENV.TARGET_PORT}`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Host': __ENV.HOST_HEADER
};

export default function () {
  // Health check
  const healthCheck = http.get(`${BASE_URL}/up`, { headers: HEADERS });
  check(healthCheck, {
    'health_check_200': (r) => r.status === 200,
    'health_check_body': (r) => r.body.includes('OK'),
  });

  // Record failures
  failureRate.add(healthCheck.status !== 200);

  sleep(1);
}
