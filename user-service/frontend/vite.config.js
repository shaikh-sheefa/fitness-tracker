import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The proxy sends API calls to the Spring Boot service, so no CORS setup is needed.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:8083' },
  },
});
