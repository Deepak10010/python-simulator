import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Pyodide is loaded from the CDN at runtime (see pyodideClient/worker),
// so no special bundling config is required for it.
export default defineConfig({
  plugins: [react()],
  base: './',
  worker: {
    format: 'es',
  },
})
