import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, FlaskConical } from 'lucide-react'
import { PageShell, PageHero } from '#/components/Page'
import { Card } from '#/components/ui'
import { VISUALIZERS } from '#/content/visualizers'
import { getTopic } from '#/content/topics'

export const Route = createFileRoute('/visualizers/')({ component: VizIndex })

function VizIndex() {
  const groups = Array.from(new Set(VISUALIZERS.map((v) => v.group)))

  return (
    <PageShell>
      <PageHero
        kicker="Visualizers"
        title="Learn the maths by playing with it"
        lead="Every visualizer is fully interactive — change the inputs and the calculation, ranking or simulation updates live. This is the fastest way to build real intuition."
      />

      {groups.map((group) => (
        <section key={group} className="mb-8">
          <h2 className="display-title mb-3 text-xl font-bold text-[var(--sea-ink)]">{group}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {VISUALIZERS.filter((v) => v.group === group).map((v) => {
              const topic = getTopic(v.topicId)
              return (
                <Link
                  key={v.id}
                  to="/visualizers/$vizId"
                  params={{ vizId: v.id }}
                  className="no-underline"
                >
                  <Card className="feature-card flex h-full flex-col gap-3 p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(79,184,178,0.16)] text-[var(--lagoon-deep)]">
                      <FlaskConical size={20} />
                    </span>
                    <h3 className="text-lg font-bold leading-tight text-[var(--sea-ink)]">
                      {v.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--sea-ink-soft)]">{v.blurb}</p>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <span className="text-xs text-[var(--sea-ink-soft)]">
                        {topic ? topic.title : ''}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-[var(--lagoon-deep)]">
                        Open <ArrowRight size={15} />
                      </span>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </PageShell>
  )
}
