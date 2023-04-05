console.log('Hello, World!');

import { initializeFaro, LogLevel } from '@grafana/faro-web-sdk';

initializeFaro({
  url: 'http://localhost:12345/collect',
//   apiKey: 'secret',
  app: {
    name: 'frontend',
    version: '1.0.0',
  },
});

const faro = window.faro;
faro.api.pushLog(['Hello world', 123], { level: LogLevel.DEBUG });
