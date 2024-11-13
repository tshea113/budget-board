import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        format: 'es',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        manualChunks(id) {
          if (/projectEnvVariables.ts/.test(id)) {
            return 'projectEnvVariables';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
