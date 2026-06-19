import { useEffect, useRef } from 'react'
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from '@codemirror/view'
import { StateEffect, StateField } from '@codemirror/state'

// --- active line highlight via a StateField ---------------------------------
const setHighlightLine = StateEffect.define<number | null>()

const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none
  },
  update(deco, tr) {
    deco = deco.map(tr.changes)
    for (const e of tr.effects) {
      if (e.is(setHighlightLine)) {
        if (e.value == null || e.value < 1 || e.value > tr.state.doc.lines) {
          deco = Decoration.none
        } else {
          const line = tr.state.doc.line(e.value)
          deco = Decoration.set([
            Decoration.line({ class: 'cm-activeStep' }).range(line.from),
          ])
        }
      }
    }
    return deco
  },
  provide: (f) => EditorView.decorations.from(f),
})

const highlightTheme = EditorView.baseTheme({
  '.cm-activeStep': {
    backgroundColor: 'rgba(251, 191, 36, 0.35)',
    borderRadius: '4px',
  },
})

// Keep a no-op plugin so the theme + field load together cleanly.
const noop = ViewPlugin.fromClass(
  class {
    update(_u: ViewUpdate) {}
  }
)

interface Props {
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
  highlightLine?: number | null
  minHeight?: string
}

export function CodeEditor({
  value,
  onChange,
  readOnly,
  highlightLine,
  minHeight = '14rem',
}: Props) {
  const ref = useRef<ReactCodeMirrorRef>(null)

  useEffect(() => {
    const view = ref.current?.view
    if (!view) return
    view.dispatch({ effects: setHighlightLine.of(highlightLine ?? null) })
  }, [highlightLine])

  return (
    <div className="overflow-hidden rounded-xl border-2 border-slate-200">
      <CodeMirror
        ref={ref}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        minHeight={minHeight}
        extensions={[python(), highlightField, highlightTheme, noop]}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: false,
        }}
      />
    </div>
  )
}
