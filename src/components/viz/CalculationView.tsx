import { AnimatePresence, motion } from 'framer-motion'
import type { Calc } from '../../engine/types'

interface Props {
  calc: Calc | undefined
}

/**
 * Shows the calculation on the current line as a three-step reveal:
 *   age = age + 1   (original)
 *       = 36 + 1    (values substituted in)
 *       = 37        (result)
 */
export function CalculationView({ calc }: Props) {
  return (
    <div className="min-h-[3.5rem]">
      <AnimatePresence mode="wait">
        {calc ? (
          <motion.div
            key={`${calc.expr}-${calc.substituted}-${calc.result}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-mono text-base leading-relaxed"
          >
            <Row prefix={prefix(calc)} body={calc.expr} tone="muted" />
            {calc.substituted !== calc.expr && (
              <Row prefix={eqPrefix(calc)} body={calc.substituted} tone="highlight" />
            )}
            {calc.result !== null && calc.result !== calc.substituted && (
              <Row prefix={eqPrefix(calc)} body={calc.result} tone="result" />
            )}
          </motion.div>
        ) : (
          <motion.p
            key="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm italic text-slate-400"
          >
            This line has no calculation to show.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function prefix(calc: Calc): string {
  if (calc.target === 'return') return 'return '
  if (calc.target) return `${calc.target} = `
  return ''
}

function eqPrefix(calc: Calc): string {
  // Align the "=" rows under the target, or just indent for bare expressions.
  if (calc.target === 'return') return '       ' // under "return "
  if (calc.target) return `${' '.repeat(calc.target.length)} = `
  return '= '
}

function Row({
  prefix,
  body,
  tone,
}: {
  prefix: string
  body: string
  tone: 'muted' | 'highlight' | 'result'
}) {
  const bodyClass =
    tone === 'muted'
      ? 'text-slate-400'
      : tone === 'highlight'
        ? 'rounded-md bg-sunny/30 px-1.5 text-amber-800 font-bold'
        : 'rounded-md bg-mint/25 px-1.5 text-emerald-700 font-extrabold'
  return (
    <div className="whitespace-pre">
      <span className="text-slate-400">{prefix}</span>
      <span className={bodyClass}>{body}</span>
    </div>
  )
}
