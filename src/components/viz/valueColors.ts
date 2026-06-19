import type { VarValue } from '../../engine/types'

// Consistent playful colors per value kind.
export function tokenClasses(v: VarValue): string {
  switch (v.kind) {
    case 'int':
    case 'float':
    case 'complex':
      return 'bg-brand-100 text-brand-700 border-brand-300'
    case 'str':
      return 'bg-mint/20 text-emerald-700 border-mint'
    case 'bool':
      return 'bg-sunny/20 text-amber-700 border-sunny'
    case 'none':
      return 'bg-slate-100 text-slate-500 border-slate-300'
    case 'ref':
      return 'bg-grape/15 text-grape border-grape/50'
    default:
      return 'bg-slate-100 text-slate-600 border-slate-300'
  }
}

export function shortDisplay(v: VarValue): string {
  if (v.kind === 'str') {
    const s = v.value.length > 18 ? v.value.slice(0, 17) + '…' : v.value
    return `"${s}"`
  }
  if (v.kind === 'none') return 'None'
  return v.repr
}
