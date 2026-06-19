import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

interface SortStep {
  array: number[]
  compare: [number, number] | null
  swapped: boolean
  done: number // count of sorted-from-end elements
  note: string
}

function buildBubbleSortSteps(input: number[]): SortStep[] {
  const arr = [...input]
  const steps: SortStep[] = [
    { array: [...arr], compare: null, swapped: false, done: 0, note: 'Starting bubble sort.' },
  ]
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({
        array: [...arr],
        compare: [j, j + 1],
        swapped: false,
        done: i,
        note: `Compare ${arr[j]} and ${arr[j + 1]}.`,
      })
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        steps.push({
          array: [...arr],
          compare: [j, j + 1],
          swapped: true,
          done: i,
          note: `${arr[j + 1]} > ${arr[j]} → swap!`,
        })
      }
    }
  }
  steps.push({ array: [...arr], compare: null, swapped: false, done: n, note: 'Sorted! 🎉' })
  return steps
}

const SAMPLE = [5, 2, 8, 1, 9, 3, 7]

export function SortingScene() {
  const steps = useMemo(() => buildBubbleSortSteps(SAMPLE), [])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const step = steps[index]
  const maxVal = Math.max(...SAMPLE)
  const atEnd = index >= steps.length - 1

  useEffect(() => {
    if (!playing || atEnd) {
      if (atEnd) setPlaying(false)
      return
    }
    const t = window.setTimeout(() => setIndex((i) => i + 1), 700)
    return () => window.clearTimeout(t)
  }, [playing, index, atEnd])

  return (
    <div className="flex flex-col gap-4">
      <div className="card flex min-h-[18rem] items-end justify-center gap-3 p-6">
        {step.array.map((value, i) => {
          const isComparing = step.compare?.includes(i)
          const isSorted = i >= step.array.length - step.done
          const color = isSorted
            ? 'bg-mint'
            : isComparing
              ? step.swapped
                ? 'bg-coral'
                : 'bg-sunny'
              : 'bg-brand-400'
          return (
            <motion.div
              key={value}
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="flex w-10 flex-col items-center justify-end"
            >
              <motion.div
                layout
                className={`flex w-10 items-start justify-center rounded-t-lg pt-1 font-mono font-bold text-white ${color}`}
                style={{ height: `${(value / maxVal) * 200 + 28}px` }}
              >
                {value}
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      <div className="rounded-xl bg-slate-900 px-4 py-2 font-mono text-sm text-slate-100">
        {step.note}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="btn-ghost px-3"
          onClick={() => {
            setPlaying(false)
            setIndex(0)
          }}
          disabled={index === 0}
        >
          ⏮
        </button>
        <button
          className="btn-ghost px-3"
          onClick={() => {
            setPlaying(false)
            setIndex((i) => Math.max(0, i - 1))
          }}
          disabled={index === 0}
        >
          ◀
        </button>
        <button
          className="btn-primary px-5"
          onClick={() => setPlaying((p) => !p)}
          disabled={atEnd}
        >
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          className="btn-ghost px-3"
          onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          disabled={atEnd}
        >
          ▶
        </button>
        <span className="ml-auto font-mono text-sm text-slate-500">
          step {index + 1} / {steps.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <Legend className="bg-brand-400" label="unsorted" />
        <Legend className="bg-sunny" label="comparing" />
        <Legend className="bg-coral" label="swapping" />
        <Legend className="bg-mint" label="sorted" />
      </div>
    </div>
  )
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded ${className}`} />
      {label}
    </span>
  )
}
