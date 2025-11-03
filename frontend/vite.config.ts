import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,              // Permite acceso desde la red local
    strictPort: true,        // Falla si el puerto está ocupado (en lugar de buscar otro)
    cors: true,              // Habilita CORS
  },
})
