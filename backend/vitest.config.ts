import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/__tests__/**/*.test.ts'],
    /** Tests de integración comparten BD local — ejecución secuencial. */
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
})
