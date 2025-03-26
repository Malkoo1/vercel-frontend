import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // server: {
  //   proxy: {
  //     '/auth': { // Proxy requests starting with /auth
  //       target: 'http://localhost:5000',
  //       changeOrigin: true,
  //       secure: false,
  //       cookieDomainRewrite: 'localhost',
  //     },
  //     '/api': { // Proxy requests starting with /api
  //       target: 'http://localhost:5000',
  //       changeOrigin: true,
  //       secure: false,
  //       cookieDomainRewrite: 'localhost',
  //     },
  //     // Add other API paths to proxy as needed
  //   }
  // }
})
