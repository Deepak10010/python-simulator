import type { PlayerState } from '../engine/usePlayer'
import { CalculationView } from './viz/CalculationView'
import { CallStackView } from './viz/CallStackView'
import { HeapView } from './viz/HeapView'
import { OutputView } from './viz/OutputView'
import { VariablesView } from './viz/VariablesView'

interface Props {
  player: PlayerState
  /** Which panels to show; defaults to all. */
  show?: {
    calc?: boolean
    variables?: boolean
    heap?: boolean
    stack?: boolean
    output?: boolean
  }
}

const ALL = { calc: true, variables: true, heap: true, stack: true, output: true }

/** Assembles the per-step visualization from the player's current step. */
export function VisualizationPanel({ player, show = ALL }: Props) {
  const { current, previous } = player
  const topFrame = current?.stack[current.stack.length - 1] ?? null
  const prevTopFrame =
    previous && current && previous.stack.length === current.stack.length
      ? previous.stack[previous.stack.length - 1]
      : null
  const multiFrame = (current?.stack.length ?? 0) > 1

  if (!current) {
    return (
      <div className="card flex h-full min-h-[16rem] items-center justify-center p-6 text-center">
        <p className="text-slate-400">
          ▶ Run your code to watch it come alive, step by step.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {current.note && (
        <div className="rounded-xl bg-sunny/20 border-2 border-sunny px-3 py-2 text-sm font-bold text-amber-700">
          ⚠ {current.note}
        </div>
      )}

      {(show.stack && multiFrame) && (
        <Section title="Call stack" emoji="🥞">
          <CallStackView stack={current.stack} />
        </Section>
      )}

      {show.variables && (
        <Section title="Variables" emoji="📦">
          <VariablesView frame={topFrame} prevFrame={prevTopFrame} />
        </Section>
      )}

      {show.calc && (
        <Section title="Calculation" emoji="🧮">
          <CalculationView calc={current.calc} />
        </Section>
      )}

      {show.heap && (
        <Section title="Lists, dicts & objects" emoji="🧩">
          <HeapView step={current} prev={previous} />
        </Section>
      )}

      {show.output && (
        <Section title="Output" emoji="🖨️">
          <OutputView stdout={current.stdout} error={current.error} />
        </Section>
      )}
    </div>
  )
}

function Section({
  title,
  emoji,
  children,
}: {
  title: string
  emoji: string
  children: React.ReactNode
}) {
  return (
    <div className="card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-500">
        <span className="text-base">{emoji}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}
