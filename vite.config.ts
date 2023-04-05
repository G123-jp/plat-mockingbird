import { defineConfig } from 'vite';
import path from 'path';


export default defineConfig({
  build: {
    target: 'es2015',
    outDir: 'dist',
  },
  root: path.resolve(__dirname, 'frontend'),
  optimizeDeps: {
    include: ['@grafana/faro-web-sdk'], // Add this line
  },
});


