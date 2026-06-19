/// <reference lib="webworker" />
// Web Worker that boots Pyodide (real CPython/WASM) and runs the tracer.
// Keeping Python off the main thread keeps the UI responsive.

import tracerSource from './tracer.py?raw'

const PYODIDE_VERSION = '0.26.4'
const PYODIDE_INDEX = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

type InMsg =
  | { type: 'init' }
  | { type: 'run'; id: number; source: string; inputs?: string[] }

interface PyodideAPI {
  runPythonAsync: (code: string) => Promise<unknown>
  globals: { get: (name: string) => unknown }
  loadPackagesFromImports: (code: string) => Promise<void>
}

let pyodide: PyodideAPI | null = null
let ready: Promise<void> | null = null

async function loadPyodideOnce(): Promise<void> {
  if (ready) return ready
  ready = (async () => {
    // Dynamic import of the Pyodide ESM bundle from the CDN.
    const mod: any = await import(/* @vite-ignore */ `${PYODIDE_INDEX}pyodide.mjs`)
    pyodide = await mod.loadPyodide({ indexURL: PYODIDE_INDEX })
    // Register the tracer module once.
    ;(pyodide as any).FS.writeFile('/home/pyodide/tracer.py', tracerSource)
    await pyodide!.runPythonAsync('import sys; sys.path.insert(0, "/home/pyodide")')
    postMessage({ type: 'ready' })
  })()
  return ready
}

async function runTrace(id: number, source: string, inputs?: string[]) {
  await loadPyodideOnce()
  if (!pyodide) throw new Error('Pyodide failed to load')
  try {
    // Auto-install any packages the user code imports (e.g. numpy) on demand.
    try {
      await pyodide.loadPackagesFromImports(source)
    } catch {
      /* best-effort; ignore if a package can't be located */
    }
    // Pass source + inputs into the Python namespace and run the tracer.
    ;(pyodide.globals as any).set('__user_source', source)
    ;(pyodide.globals as any).set('__user_inputs', inputs ?? [])
    const json = (await pyodide.runPythonAsync(
      'import tracer, json\n' +
        'tracer.run_trace(__user_source, list(__user_inputs))'
    )) as string
    postMessage({ type: 'result', id, json })
  } catch (err) {
    postMessage({
      type: 'error',
      id,
      message: err instanceof Error ? err.message : String(err),
    })
  }
}

self.onmessage = (e: MessageEvent<InMsg>) => {
  const msg = e.data
  if (msg.type === 'init') {
    void loadPyodideOnce()
  } else if (msg.type === 'run') {
    void runTrace(msg.id, msg.source, msg.inputs)
  }
}
