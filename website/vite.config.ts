import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@oxog/formkeeper': path.resolve(__dirname, '../dist'),
      '@oxog/formkeeper/react': path.resolve(__dirname, '../dist/react'),
      '@oxog/formkeeper/plugins': path.resolve(__dirname, '../dist/plugins'),
    },
  },
  optimizeDeps: {
    exclude: ['@oxog/formkeeper', '@oxog/formkeeper/react', '@oxog/formkeeper/plugins'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
          ],
        },
      },
    },
  },
})
