// Shared types for the execution-tracing engine.
// These mirror exactly what tracer.py emits as JSON.

export type TraceEvent = 'line' | 'call' | 'return' | 'exception'

/**
 * A JSON-friendly representation of a Python value.
 * `kind` drives how the visualization renders it.
 */
export type VarValue =
  | { kind: 'int'; value: number; repr: string }
  | { kind: 'float'; value: number; repr: string }
  | { kind: 'bool'; value: boolean; repr: string }
  | { kind: 'str'; value: string; repr: string }
  | { kind: 'none'; repr: string }
  | { kind: 'complex'; repr: string }
  // Containers reference heap objects by id so shared references are visible.
  | { kind: 'ref'; id: number; repr: string }
  // Fallback for anything we don't model specially.
  | { kind: 'opaque'; repr: string }

export interface HeapObject {
  id: number
  type: 'list' | 'tuple' | 'set' | 'dict' | 'object'
  // For list/tuple/set: ordered element values.
  items?: VarValue[]
  // For dict: key/value pairs (keys rendered via repr).
  entries?: { key: string; value: VarValue }[]
  // For generic objects: class name + attributes.
  className?: string
  attrs?: { name: string; value: VarValue }[]
}

export interface Frame {
  /** Function name; "<module>" for top level. */
  name: string
  /** Local variables in this frame at this step. */
  locals: Record<string, VarValue>
  /** Line currently executing within this frame. */
  line: number
}

/**
 * The calculation happening on the current line, with variables substituted
 * for their current values, e.g. target "total", expr "total + n",
 * substituted "5 + 3", result "8".
 */
export interface Calc {
  /** Assignment target (e.g. "age"), "return", or null for a bare call. */
  target: string | null
  /** Original expression source (with variable names). */
  expr: string
  /** Expression with variable names replaced by their current values. */
  substituted: string
  /** Computed result repr, or null when not safely evaluable (e.g. a call). */
  result: string | null
}

export interface ExecutionStep {
  /** 1-based line number of the about-to-execute / just-executed line. */
  line: number
  event: TraceEvent
  /** Call stack, innermost frame last. */
  stack: Frame[]
  /** Heap objects referenced (by id) anywhere in this step. */
  heap: Record<number, HeapObject>
  /** Full stdout accumulated up to and including this step. */
  stdout: string
  /** The calculation on this line, when there is one worth showing. */
  calc?: Calc
  /** Set on the final step if an uncaught exception occurred. */
  error?: string
  /** Optional human note, e.g. "execution limit reached". */
  note?: string
}

export interface TraceResult {
  steps: ExecutionStep[]
  /** True if we stopped early due to the step/time guard. */
  truncated: boolean
  /** Top-level error string if the program raised, else null. */
  error: string | null
}
