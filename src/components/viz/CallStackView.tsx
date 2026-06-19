import { AnimatePresence, motion } from 'framer-motion'
import type { Frame } from '../../engine/types'
import { ValueToken } from './ValueToken'

interface Props {
  stack: Frame[]
}

/** The call stack, innermost frame on top, animating push/pop. */
export function CallStackView({ stack }: Props) {
  // Show innermost (last) at the top.
  const ordered = [...stack].reverse()
  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {ordered.map((frame, i) => {
          const isActive = i === 0
          return (
            <motion.div
              layout
              key={`${frame.name}-${stack.length - i}`}
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
              className={`rounded-xl border-2 p-2.5 ${
                isActive
                  ? 'border-brand-400 bg-brand-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-lg bg-grape px-2 py-0.5 font-mono text-xs font-bold text-white">
                  {frame.name === '<module>' ? 'main' : frame.name + '()'}
                </span>
                <span className="text-[10px] text-slate-400">line {frame.line}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(frame.locals).map(([name, value]) => (
                  <span key={name} className="flex items-center gap-1">
                    <span className="font-mono text-xs text-slate-500">{name}</span>
                    <ValueToken value={value} />
                  </span>
                ))}
                {Object.keys(frame.locals).length === 0 && (
                  <span className="text-xs text-slate-400 italic">no locals</span>
                )}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
