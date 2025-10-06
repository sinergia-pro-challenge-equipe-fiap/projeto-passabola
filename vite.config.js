// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  css: {
    // garante que o Vite use seu postcss.config.js
    postcss: './postcss.config.js',
  },
});