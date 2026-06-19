/// <reference types="vite/client" />

// Raw text imports (used for tracer.py).
declare module '*.py?raw' {
  const content: string
  export default content
}
