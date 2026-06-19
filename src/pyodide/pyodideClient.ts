// Promise-based API around the Pyodide web worker.
// A single shared worker instance serves the whole app.

import type { TraceResult } from '../engine/types'

type Listener = (ready: boolean) => void

class PyodideClient {
  private worker: Worker | null = null
  private nextId = 1
  private pending = new Map<
    number,
    { resolve: (r: TraceResult) => void; reject: (e: Error) => void }
  >()
  private _ready = false
  private readyListeners = new Set<Listener>()

  get isReady() {
    return this._ready
  }

  /** Subscribe to ready-state changes. Returns an unsubscribe fn. */
  onReadyChange(fn: Listener): () => void {
    this.readyListeners.add(fn)
    return () => this.readyListeners.delete(fn)
  }

  private ensureWorker() {
    if (this.worker) return
    this.worker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    })
    this.worker.onmessage = (e: MessageEvent) => {
      const msg = e.data
      if (msg.type === 'ready') {
        this._ready = true
        this.readyListeners.forEach((fn) => fn(true))
      } else if (msg.type === 'result') {
        const p = this.pending.get(msg.id)
        if (p) {
          this.pending.delete(msg.id)
          try {
            p.resolve(JSON.parse(msg.json) as TraceResult)
          } catch (err) {
            p.reject(err as Error)
          }
        }
      } else if (msg.type === 'error') {
        const p = this.pending.get(msg.id)
        if (p) {
          this.pending.delete(msg.id)
          p.reject(new Error(msg.message))
        }
      }
    }
    this.worker.postMessage({ type: 'init' })
  }

  /** Kick off Pyodide loading early (e.g. on app mount). */
  preload() {
    this.ensureWorker()
  }

  /** Run source code and return the full execution trace. */
  run(source: string, inputs?: string[]): Promise<TraceResult> {
    this.ensureWorker()
    const id = this.nextId++
    return new Promise<TraceResult>((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.worker!.postMessage({ type: 'run', id, source, inputs })
    })
  }
}

export const pyodideClient = new PyodideClient()
