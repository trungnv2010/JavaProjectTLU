import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, 'src'),
      '@/apis': path.resolve(__dirname, 'src/apis'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/assets': path.resolve(__dirname, 'src/assets'),
      '@/constants': path.resolve(__dirname, 'src/constants'),
      '@/ui': path.resolve(__dirname, 'src/components/ui'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/schema': path.resolve(__dirname, 'src/schema'),
      '@/common': path.resolve(__dirname, 'src/common'),
      '@/routers': path.resolve(__dirname, 'src/routers')
    }
  }
})
