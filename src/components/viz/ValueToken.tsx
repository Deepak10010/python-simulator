import { motion } from 'framer-motion'
import type { VarValue } from '../../engine/types'
import { shortDisplay, tokenClasses } from './valueColors'

interface Props {
  value: VarValue
  changed?: boolean
}

/** A single value rendered as a playful rounded token. */
export function ValueToken({ value, changed }: Props) {
  const isRef = value.kind === 'ref'
  return (
    <motion.span
      layout
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={`token px-2.5 py-1 text-sm border-2 ${tokenClasses(value)} ${
        changed ? 'ring-4 ring-coral/40' : ''
      }`}
      title={value.repr}
    >
      {isRef ? `→ ${value.repr}` : shortDisplay(value)}
    </motion.span>
  )
}
