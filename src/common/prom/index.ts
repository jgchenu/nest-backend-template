import { Histogram, Counter, register } from 'prom-client';

export const ErrorCounter = new Counter({
  name: 'custom_error_total',
  help: 'error msg counter',
  labelNames: ['name', 'message'],
});

export const ResponseTimeHistogram = new Histogram({
  name: 'http_response_time_ms',
  help: 'ms to handle a request',
  labelNames: ['method', 'routerName', 'status'],
  buckets: [100, 200, 500, 1000, 2000, 5000],
});

export const RequestTotalCounter = new Counter({
  name: 'http_request_total',
  help: 'number of requests to a route',
  labelNames: ['method', 'path', 'routerName', 'status'],
});

export const DurationHistogram = new Histogram({
  name: 'custom_duration_ms',
  help: 'ms to handle some thing',
  labelNames: ['event'],
  buckets: [100, 200, 500, 1000, 2000, 5000],
});

export function recordError(name: string, message: string) {
  ErrorCounter.labels(name, message).inc();
}

export function recordTimeStart(event: string) {
  return DurationHistogram.startTimer({ event });
}

// register.registerMetric(ErrorCounter);
// register.registerMetric(ResponseTimeHistogram);
// register.registerMetric(RequestTotalCounter);
// register.registerMetric(DurationHistogram);
