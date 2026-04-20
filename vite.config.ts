import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':           resolve(__dirname, './src'),
      '@features':   resolve(__dirname, './src/features'),
      '@store':      resolve(__dirname, './src/store'),
      '@api':        resolve(__dirname, './src/api'),
      '@types-app':  resolve(__dirname, './src/types'),
      '@lib':        resolve(__dirname, './src/lib'),
      '@hooks':      resolve(__dirname, './src/hooks'),
      '@components': resolve(__dirname, './src/components'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
