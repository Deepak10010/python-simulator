import { Link } from 'react-router-dom'
import { lessons } from '../lessons/registry'
import { TIER_LABELS, TIER_ORDER, type Lesson, type Tier } from '../lessons/types'

export function LearnPage() {
  const byTier = TIER_ORDER.map((tier) => ({
    tier,
    items: lessons.filter((l) => l.tier === tier),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-800">Learn Python, visually</h1>
      <p className="mt-2 text-slate-600">
        Pick a concept and watch it run. More lessons are added tier by tier.
      </p>

      {byTier.map((group) => (
        <section key={group.tier} className="mt-8">
          <TierHeading tier={group.tier} count={group.items.length} />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function TierHeading({ tier, count }: { tier: Tier; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-extrabold text-slate-700">{TIER_LABELS[tier]}</h2>
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">
        {count} {count === 1 ? 'lesson' : 'lessons'}
      </span>
    </div>
  )
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className="card group flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-pop"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{lesson.emoji}</span>
        <h3 className="font-extrabold text-slate-800 group-hover:text-brand-600">
          {lesson.title}
        </h3>
      </div>
      <p className="mt-2 flex-1 text-sm text-slate-600">{lesson.blurb}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {lesson.topics.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded-full bg-grape/10 px-2 py-0.5 text-[11px] font-semibold text-grape"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  )
}
