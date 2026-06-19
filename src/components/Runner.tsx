import { useEffect, useState } from 'react'
import { pyodideClient } from '../pyodide/pyodideClient'
import { usePlayer } from '../engine/usePlayer'
import { CodeEditor } from './CodeEditor'
import { Controls } from './Controls'
import { VisualizationPanel } from './VisualizationPanel'

interface Props {
  initialCode: string
  /** Restrict which visualization panels show (e.g. lessons). */
  show?: {
    calc?: boolean
    variables?: boolean
    heap?: boolean
    stack?: boolean
    output?: boolean
  }
  /** Predefined responses for input() calls. */
  inputs?: string[]
  editorMinHeight?: string
  /** Notified whenever the editor contents change (for sharing, etc.). */
  onCodeChange?: (code: string) => void
}

/**
 * The flagship interactive surface: edit code → run → watch it execute.
 * Used by both the Sandbox and trace-driven lessons.
 */
export function Runner({
  initialCode,
  show,
  inputs,
  editorMinHeight,
  onCodeChange,
}: Props) {
  const [code, setCode] = useState(initialCode)

  function updateCode(next: string) {
    setCode(next)
    onCodeChange?.(next)
  }
  const [running, setRunning] = useState(false)
  const [pyReady, setPyReady] = useState(pyodideClient.isReady)
  const [runError, setRunError] = useState<string | null>(null)
  const player = usePlayer()

  useEffect(() => {
    pyodideClient.preload()
    setPyReady(pyodideClient.isReady)
    return pyodideClient.onReadyChange(setPyReady)
  }, [])

  // Reset when the lesson/sample changes.
  useEffect(() => {
    setCode(initialCode)
    player.setSteps(null)
    setRunError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode])

  async function handleRun() {
    setRunning(true)
    setRunError(null)
    player.setSteps(null)
    try {
      const result = await pyodideClient.run(code, inputs)
      // Start paused at the first step so you control the pace — press ▶ to
      // play, or step through one line at a time, pausing on any step.
      player.setSteps(result)
    } catch (err) {
      setRunError(err instanceof Error ? err.message : String(err))
    } finally {
      setRunning(false)
    }
  }

  const currentLine = player.current?.line ?? null

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Left: editor + controls */}
      <div className="flex flex-col gap-3">
        <CodeEditor
          value={code}
          onChange={updateCode}
          highlightLine={currentLine}
          minHeight={editorMinHeight}
        />
        <div className="flex items-center gap-3">
          <button
            className="btn-primary"
            onClick={handleRun}
            disabled={running || !pyReady}
          >
            {running ? 'Running…' : pyReady ? '▶ Run' : 'Loading Python…'}
          </button>
          {!pyReady && (
            <span className="text-sm text-slate-400">
              Booting real Python in your browser (first time only)…
            </span>
          )}
          {runError && (
            <span className="text-sm font-bold text-coral">{runError}</span>
          )}
        </div>
        <div className="card p-4">
          <Controls player={player} />
        </div>
      </div>

      {/* Right: visualization */}
      <div>
        <VisualizationPanel player={player} show={show} />
      </div>
    </div>
  )
}
