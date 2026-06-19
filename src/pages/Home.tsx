import { Link } from 'react-router-dom'
import { lessons } from '../lessons/registry'

export function Home() {
  const beginner = lessons.filter((l) => l.tier === 'beginner').slice(0, 6)
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="text-center">
        <div className="text-6xl">🐍✨</div>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-800 sm:text-5xl">
          See Python <span className="text-brand-500">actually run</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Watch variables fill their boxes, the call stack grow, and output
          appear — one step at a time. Real Python, running right in your
          browser. No setup, nothing to install.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link to="/learn" className="btn-primary text-lg">
            📚 Start learning
          </Link>
          <Link to="/sandbox" className="btn-ghost text-lg">
            🧪 Open the sandbox
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        <Feature emoji="👀" title="Step by step">
          Pause, rewind and scrub through execution. Every change is highlighted.
        </Feature>
        <Feature emoji="🧩" title="Real values">
          Lists, dicts and objects shown as living shapes that grow and mutate.
        </Feature>
        <Feature emoji="🚀" title="All levels">
          Starting with the fundamentals, expanding all the way to advanced.
        </Feature>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-extrabold text-slate-800">
          Start with the basics
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beginner.map((l) => (
            <Link
              key={l.id}
              to={`/lesson/${l.id}`}
              className="card group flex items-center gap-3 p-4 transition hover:-translate-y-1 hover:shadow-pop"
            >
              <span className="text-3xl">{l.emoji}</span>
              <div>
                <div className="font-extrabold text-slate-800 group-hover:text-brand-600">
                  {l.title}
                </div>
                <div className="text-sm text-slate-500">{l.blurb}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function Feature({
  emoji,
  title,
  children,
}: {
  emoji: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="card p-5">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-2 font-extrabold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{children}</p>
    </div>
  )
}
