import { AnimatePresence, motion } from 'framer-motion'
import type { ExecutionStep, HeapObject } from '../../engine/types'
import { ValueToken } from './ValueToken'

interface Props {
  step: ExecutionStep
  prev: ExecutionStep | null
}

/** Renders heap objects (lists, dicts, sets, tuples, custom objects). */
export function HeapView({ step, prev }: Props) {
  const objects = Object.values(step.heap)
  if (objects.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">
        No lists, dicts, or objects yet.
      </p>
    )
  }
  return (
    <div className="flex flex-wrap gap-4">
      <AnimatePresence>
        {objects.map((obj) => (
          <motion.div
            key={obj.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card p-3"
          >
            <HeapObjectView obj={obj} prevHeap={prev?.heap} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function HeapObjectView({
  obj,
  prevHeap,
}: {
  obj: HeapObject
  prevHeap?: Record<number, HeapObject>
}) {
  const prevObj = prevHeap?.[obj.id]
  const label =
    obj.type === 'object' ? obj.className ?? 'object' : obj.type

  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-grape">
        {label}
      </div>
      {(obj.type === 'list' || obj.type === 'tuple' || obj.type === 'set') && (
        <div className="flex flex-wrap items-end gap-1.5">
          {(obj.items ?? []).map((item, i) => {
            const prevItem = prevObj?.items?.[i]
            const changed = !prevItem || prevItem.repr !== item.repr
            return (
              <div key={i} className="flex flex-col items-center">
                <ValueToken value={item} changed={changed} />
                {obj.type !== 'set' && (
                  <span className="mt-0.5 text-[10px] font-mono text-slate-400">
                    {i}
                  </span>
                )}
              </div>
            )
          })}
          {(obj.items ?? []).length === 0 && (
            <span className="text-sm text-slate-400 italic">empty</span>
          )}
        </div>
      )}
      {obj.type === 'dict' && (
        <div className="flex flex-col gap-1">
          {(obj.entries ?? []).map((e, i) => {
            const prevVal = prevObj?.entries?.find((p) => p.key === e.key)?.value
            const changed = !prevVal || prevVal.repr !== e.value.repr
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="font-mono text-sm text-slate-500">{e.key}</span>
                <span className="text-slate-300">:</span>
                <ValueToken value={e.value} changed={changed} />
              </div>
            )
          })}
          {(obj.entries ?? []).length === 0 && (
            <span className="text-sm text-slate-400 italic">empty</span>
          )}
        </div>
      )}
      {obj.type === 'object' && (
        <div className="flex flex-col gap-1">
          {(obj.attrs ?? []).map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-mono text-sm text-slate-600">{a.name}</span>
              <span className="text-slate-300">=</span>
              <ValueToken value={a.value} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
