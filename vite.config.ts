import { defineConfig } from 'vite';
import path from 'path';


export default defineConfig({
  build: {
    target: 'es2015',
    outDir: 'dist',
  },
  root: path.resolve('frontend'),
  optimizeDeps: {
    include: ['@grafana/faro-web-sdk',
      '@grafana/faro-web-tracing'],
  },
});


