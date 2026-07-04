import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const targetPort = process.env.PORT || '5050';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  server: {
    port: 5180,
    proxy: {
      '/api': {
        target: `http://localhost:${targetPort}`,
        changeOrigin: true,
      },
    },
  },
});
