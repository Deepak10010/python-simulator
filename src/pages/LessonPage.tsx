import { Link, useParams } from 'react-router-dom'
import { getLesson, lessons } from '../lessons/registry'
import { Runner } from '../components/Runner'
import { TIER_LABELS } from '../lessons/types'

export function LessonPage() {
  const { id } = useParams()
  const lesson = id ? getLesson(id) : undefined

  if (!lesson) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold">Lesson not found 🤔</h1>
        <Link to="/learn" className="btn-primary mt-4">
          Back to lessons
        </Link>
      </div>
    )
  }

  const idx = lessons.findIndex((l) => l.id === lesson.id)
  const prev = idx > 0 ? lessons[idx - 1] : null
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/learn" className="text-sm font-bold text-brand-600 hover:underline">
        ← All lessons
      </Link>

      <header className="mt-3 mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-grape">
          <span>{TIER_LABELS[lesson.tier]}</span>
          <span className="text-slate-300">•</span>
          <span>Strategy {lesson.strategy}</span>
        </div>
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-slate-800">
          <span className="text-4xl">{lesson.emoji}</span>
          {lesson.title}
        </h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {lesson.topics.map((t) => (
            <span
              key={t}
              className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="card mb-6 space-y-2 p-5">
        {lesson.explanation.map((p, i) => (
          <p key={i} className="text-slate-700 leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      {lesson.strategy === 'A' ? (
        <Runner
          initialCode={lesson.sampleCode}
          show={lesson.show}
          inputs={lesson.inputs}
        />
      ) : (
        <lesson.Scene />
      )}

      <nav className="mt-10 flex items-center justify-between">
        {prev ? (
          <Link to={`/lesson/${prev.id}`} className="btn-ghost">
            ← {prev.emoji} {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/lesson/${next.id}`} className="btn-primary">
            {next.emoji} {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
