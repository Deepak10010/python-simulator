import { AnimatePresence, motion } from 'framer-motion'
import type { Frame } from '../../engine/types'
import { ValueToken } from './ValueToken'

interface Props {
  frame: Frame | null
  prevFrame: Frame | null
}

/** Variables of a single frame, as name → value tokens. Changed vars pulse. */
export function VariablesView({ frame, prevFrame }: Props) {
  const entries = frame ? Object.entries(frame.locals) : []
  if (entries.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">No variables yet.</p>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {entries.map(([name, value]) => {
          const prev = prevFrame?.locals[name]
          const changed = !prev || prev.repr !== value.repr
          return (
            <motion.div
              layout
              key={name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <span className="min-w-[3rem] font-mono font-bold text-slate-700">
                {name}
              </span>
              <span className="text-slate-300">=</span>
              <ValueToken value={value} changed={changed} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
