import type { PlayerState } from '../engine/usePlayer'
import { SPEEDS } from '../engine/usePlayer'

interface Props {
  player: PlayerState
}

/** Playback controls: step, play/pause, scrub, speed. */
export function Controls({ player }: Props) {
  const { steps, index, isPlaying, current } = player
  const total = steps.length
  const atStart = index <= 0
  const atEnd = index >= total - 1
  const disabled = total === 0
  const line = current?.line ?? null

  return (
    <div className="flex flex-col gap-3">
      {/* Prominent step + line indicator */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2 rounded-xl border-2 border-brand-200 bg-brand-50 px-4 py-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-400">
            Step
          </span>
          <span className="font-mono text-xl font-extrabold text-brand-700">
            {disabled ? '–' : index + 1}
          </span>
          <span className="font-mono text-sm text-brand-300">
            / {disabled ? '–' : total}
          </span>
        </div>
        {line !== null && !disabled && (
          <div className="rounded-xl border-2 border-grape/30 bg-grape/10 px-3 py-1.5 font-mono text-sm font-bold text-grape">
            line {line}
          </div>
        )}
      </div>

      {/* Transport buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="btn-ghost px-3"
          onClick={player.reset}
          disabled={disabled || atStart}
          title="Restart"
        >
          ⏮
        </button>
        <button
          className="btn-ghost px-3"
          onClick={player.prev}
          disabled={disabled || atStart}
          title="Previous step"
        >
          ◀ Back
        </button>
        <button
          className="btn-primary px-5 text-lg"
          onClick={player.toggle}
          disabled={disabled || atEnd}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          className="btn-ghost px-3"
          onClick={player.next}
          disabled={disabled || atEnd}
          title="Next step"
        >
          Next ▶
        </button>

        <div className="ml-auto flex items-center gap-1 text-sm">
          <span className="text-slate-400">speed</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => player.setSpeed(s)}
              className={`rounded-lg px-2 py-1 font-bold ${
                player.speed === s
                  ? 'bg-grape text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Scrubber */}
      <input
        type="range"
        min={0}
        max={Math.max(0, total - 1)}
        value={index}
        onChange={(e) => player.seek(Number(e.target.value))}
        disabled={disabled}
        className="w-full accent-brand-500"
        aria-label="Step scrubber"
      />
    </div>
  )
}
