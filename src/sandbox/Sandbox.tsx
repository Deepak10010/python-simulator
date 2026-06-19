import { useEffect, useRef, useState } from 'react'
import { Runner } from '../components/Runner'
import { decodeCode, encodeCode } from '../lib/share'

const DEFAULT_CODE = `# Write any Python and press Run to watch it execute.
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

numbers = [factorial(i) for i in range(1, 6)]
print("Factorials:", numbers)
`

export function Sandbox() {
  // Seed from ?code= in the URL if present (shared links).
  const [seed] = useState(() => {
    const hash = window.location.hash
    const q = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : ''
    const c = new URLSearchParams(q).get('code')
    return c ? decodeCode(c) : DEFAULT_CODE
  })
  const liveCode = useRef(seed)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(t)
  }, [copied])

  async function share() {
    const base = `${window.location.origin}${window.location.pathname}`
    const url = `${base}#/sandbox?code=${encodeCode(liveCode.current)}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* clipboard may be blocked; the user can still copy from the address bar */
    }
    setCopied(true)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">🧪 Sandbox</h1>
          <p className="mt-1 text-slate-600">
            Type any Python and watch it run step by step.
          </p>
        </div>
        <button className="btn-ghost" onClick={share}>
          {copied ? '✓ Link copied!' : '🔗 Share this code'}
        </button>
      </div>

      <Runner
        initialCode={seed}
        editorMinHeight="22rem"
        onCodeChange={(c) => (liveCode.current = c)}
      />
    </div>
  )
}
