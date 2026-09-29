import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// base relativo: com HashRouter o index.html fica sempre na raiz do site,
// então funciona em usuario.github.io/<repo>/ sem depender do nome do repositório.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'],
  },
})
