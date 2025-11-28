import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared/src'),
      '@core': path.resolve(__dirname, '../core/src'),
      '@components': path.resolve(__dirname, '../components/src'),
      '@assets': path.resolve(__dirname, '../assets/src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: ({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    } as any),
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
    host: true,              // Permite acceso desde la red local
    strictPort: true,        // Falla si el puerto está ocupado (en lugar de buscar otro)
    cors: true,              // Habilita CORS
    proxy: {
      // Proxy para que las cookies HttpOnly funcionen
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
