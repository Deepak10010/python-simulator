interface Props {
  stdout: string
  error?: string
}

/** Terminal-style incremental stdout view. */
export function OutputView({ stdout, error }: Props) {
  return (
    <div className="rounded-xl bg-slate-900 p-3 font-mono text-sm text-slate-100 min-h-[3rem] max-h-48 overflow-auto">
      {stdout ? (
        <pre className="whitespace-pre-wrap break-words">{stdout}</pre>
      ) : (
        <span className="text-slate-500 italic">No output yet…</span>
      )}
      {error && (
        <pre className="mt-2 whitespace-pre-wrap break-words text-coral font-bold">
          {error}
        </pre>
      )}
    </div>
  )
}
