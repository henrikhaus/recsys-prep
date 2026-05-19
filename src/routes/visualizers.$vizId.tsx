import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowRight, BookOpen } from 'lucide-react'
import { PageShell, BackLink } from '#/components/Page'
import { Card } from '#/components/ui'
import { VISUALIZERS, getViz } from '#/content/visualizers'
import { getTopic } from '#/content/topics'

export const Route = createFileRoute('/visualizers/$vizId')({
  component: VizPage,
  loader: ({ params }) => {
    if (!getViz(params.vizId)) throw notFound()
    return null
  },
  notFoundComponent: () => (
    <PageShell>
      <p className="text-[var(--sea-ink)]">Visualizer not found.</p>
      <Link to="/visualizers" className="text-[var(--lagoon-deep)]">
        Back to all visualizers
      </Link>
    </PageShell>
  ),
})

function VizPage() {
  const { vizId } = Route.useParams()
  const viz = getViz(vizId)!
  const topic = getTopic(viz.topicId)
  const Component = viz.Component
  const others = VISUALIZERS.filter((v) => v.id !== vizId)

  return (
    <PageShell>
      <div className="mb-5">
        <BackLink to="/visualizers" label="All visualizers" />
      </div>

      <header className="mb-6">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
          {viz.group}
        </div>
        <h1 className="display-title text-3xl font-bold leading-tight text-[var(--sea-ink)] sm:text-4xl">
          {viz.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--sea-ink-soft)]">{viz.blurb}</p>
        {topic ? (
          <Link
            to="/learn/$topicId"
            params={{ topicId: topic.id }}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline"
          >
            <BookOpen size={15} /> Read the topic: {topic.title}
          </Link>
        ) : null}
      </header>

      <Card className="mb-8 p-5 sm:p-6">
        <Component />
      </Card>

      <section>
        <h2 className="display-title mb-3 text-lg font-bold text-[var(--sea-ink)]">
          More visualizers
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((v) => (
            <Link
              key={v.id}
              to="/visualizers/$vizId"
              params={{ vizId: v.id }}
              className="no-underline"
            >
              <div className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 hover:border-[var(--lagoon-deep)]">
                <span className="text-sm font-semibold text-[var(--sea-ink)]">{v.title}</span>
                <ArrowRight size={15} className="text-[var(--lagoon-deep)]" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
