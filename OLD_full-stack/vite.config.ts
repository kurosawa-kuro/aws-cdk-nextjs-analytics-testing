import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/__tests__/test-setup.ts'],
    coverage: {
      provider: 'v8'
    }
  }
}) 