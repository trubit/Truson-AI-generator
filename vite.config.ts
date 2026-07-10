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
        configure: (proxy) => {
          proxy.on('error', (err, _req, res: any) => {
            if (err.message.includes('ECONNREFUSED')) {
              if (!res.headersSent) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                  success: false, 
                  message: 'Neurova backend is starting up, please try again in a few seconds...' 
                }));
              }
            }
          });
        }
      },
    },
  },
});
