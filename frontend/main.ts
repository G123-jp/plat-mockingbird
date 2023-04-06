import { initializeFaro, 
  LogLevel,
  getWebInstrumentations } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

const faro = initializeFaro({
  url: 'http://localhost:12345/collect',
  apiKey: 'igaiMoo7uloh',
  instrumentations: [...getWebInstrumentations(), new TracingInstrumentation()],
  app: {
    name: 'frontend',
    version: '1.0.0',
  },
});

//PUSH LOG
faro.api.pushLog(['This is a log', 'With another message']);
faro.api.pushLog(['This is a log'], { skipDedupe: true });
faro.api.pushLog(['This is a warning'], { level: LogLevel.WARN });
faro.api.pushLog(['This is a log with context'], {
  context: {
    // randomNumber: Math.random(),
    "key1": "value1",
    "key2": "value2"
  },
  level: LogLevel.INFO,
  skipDedupe: true,
});

//PUSH ERROR
faro.api.pushError(new Error('This is an error'));
faro.api.pushError(new Error('This is an unhandled exception'), { skipDedupe: true });
faro.api.pushError(new Error('This is an error with stack frames'), {
  stackFrames: [
    {
      filename: 'file.js',
      function: 'myFunction',
      colno: 120,
      lineno: 80,
    },
  ],
});

//PUSH EVENT
faro.api.pushEvent('user-logged-in');
faro.api.pushEvent('user-logged-out', { username: 'the-user-id' }, 'auth');
faro.api.pushEvent('user-create-role', { username: 'the-user-id' }, 'auth', { skipDedupe: true });

//PUSH TRACE
const { trace, context } = faro.api.getOTEL();
const tracer = trace.getTracer('default');
const span1 = tracer.startSpan('click');
context.with(trace.setSpan(context.active(), span1), () => {
  doSomething("left click");
  span1.end();
});

function doSomething(msg: string) {
  console.log('doing ' + msg);
  faro.api.pushEvent('doing-something ' + msg);
  //sleep for 1 second
  const start = Date.now();
  while (Date.now() - start < 1000) {}
  console.log('done' + msg);
  faro.api.pushEvent('done-something ' + msg);
}
