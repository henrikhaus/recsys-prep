import { createFileRoute, Link } from '@tanstack/react-router'
import { Clock, Check, ArrowRight } from 'lucide-react'
import { PageShell, PageHero } from '#/components/Page'
import { Card, Badge, ProgressBar } from '#/components/ui'
import { TOPICS } from '#/content/topics'
import { useProgress } from '#/lib/progress'

export const Route = createFileRoute('/learn/')({ component: LearnIndex })

const WEIGHT: Record<string, { tone: 'lagoon' | 'palm' | 'neutral'; label: string }> = {
  core: { tone: 'lagoon', label: 'Core topic' },
  high: { tone: 'palm', label: 'High-yield' },
  medium: { tone: 'neutral', label: 'Good to know' },
}

function LearnIndex() {
  const progress = useProgress()
  const done = progress.topicsDone.length

  return (
    <PageShell>
      <PageHero
        kicker="Topic guides"
        title="The 12 topics of TDT4215"
        lead="Each guide is a self-contained explainer with worked examples, common mistakes and a self-check. Work top to bottom, or jump to whatever you need."
      />

      <div className="mb-6">
        <div className="mb-1 flex justify-between text-sm font-semibold text-[var(--sea-ink-soft)]">
          <span>Course progress</span>
          <span>
            {done} / {TOPICS.length} marked complete
          </span>
        </div>
        <ProgressBar value={done / TOPICS.length} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {TOPICS.map((t) => {
          const isDone = progress.topicsDone.includes(t.id)
          const isViewed = progress.topicsViewed.includes(t.id)
          const w = WEIGHT[t.examWeight]
          return (
            <Link key={t.id} to="/learn/$topicId" params={{ topicId: t.id }} className="no-underline">
              <Card className="feature-card flex h-full flex-col gap-3 p-5">
                <div className="flex items-start gap-3">
                  <span
                    className={
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold ' +
                      (isDone
                        ? 'bg-[var(--palm)] text-[var(--accent-on)]'
                        : 'bg-[rgba(79,184,178,0.16)] text-[var(--lagoon-deep)]')
                    }
                  >
                    {isDone ? <Check size={20} /> : t.num}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
                      {t.lecture}
                    </div>
                    <h3 className="text-lg font-bold leading-tight text-[var(--sea-ink)]">
                      {t.title}
                    </h3>
                  </div>
                  <Badge tone={w.tone}>{w.label}</Badge>
                </div>
                <p className="text-sm leading-relaxed text-[var(--sea-ink-soft)]">{t.blurb}</p>
                <div className="mt-auto flex items-center justify-between pt-1">
                  <span className="flex items-center gap-3 text-xs text-[var(--sea-ink-soft)]">
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {t.minutes} min
                    </span>
                    {isViewed && !isDone ? (
                      <span className="font-semibold text-[var(--lagoon-deep)]">In progress</span>
                    ) : null}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-[var(--lagoon-deep)]">
                    Read <ArrowRight size={15} />
                  </span>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}
