import { useEffect } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Clock, Check, ArrowRight, ArrowLeft, FlaskConical, ListChecks } from 'lucide-react'
import { PageShell, BackLink } from '#/components/Page'
import { Button, Card, Badge } from '#/components/ui'
import { TOPICS, getTopic, topicIndex } from '#/content/topics'
import { getViz } from '#/content/visualizers'
import { conceptByTopic } from '#/content/conceptQuiz'
import { useProgress, progressActions } from '#/lib/progress'

export const Route = createFileRoute('/learn/$topicId')({
  component: TopicPage,
  loader: ({ params }) => {
    if (!getTopic(params.topicId)) throw notFound()
    return null
  },
  notFoundComponent: () => (
    <PageShell>
      <p className="text-[var(--sea-ink)]">Topic not found.</p>
      <Link to="/learn" className="text-[var(--lagoon-deep)]">
        Back to all topics
      </Link>
    </PageShell>
  ),
})

const WEIGHT: Record<string, { tone: 'lagoon' | 'palm' | 'neutral'; label: string }> = {
  core: { tone: 'lagoon', label: 'Core topic' },
  high: { tone: 'palm', label: 'High-yield' },
  medium: { tone: 'neutral', label: 'Good to know' },
}

function TopicPage() {
  const { topicId } = Route.useParams()
  const topic = getTopic(topicId)!
  const progress = useProgress()

  useEffect(() => {
    progressActions.viewTopic(topicId)
  }, [topicId])

  const isDone = progress.topicsDone.includes(topicId)
  const idx = topicIndex(topicId)
  const prev = idx > 0 ? TOPICS[idx - 1] : null
  const next = idx < TOPICS.length - 1 ? TOPICS[idx + 1] : null
  const w = WEIGHT[topic.examWeight]
  const vizzes = topic.visualizers.map(getViz).filter(Boolean)
  const quizCount = conceptByTopic(topicId).length
  const Content = topic.Content

  return (
    <PageShell>
      <div className="mb-5">
        <BackLink to="/learn" label="All topics" />
      </div>

      <header className="mb-8">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
            {topic.lecture}
          </span>
          <Badge tone={w.tone}>{w.label}</Badge>
          <span className="flex items-center gap-1 text-xs text-[var(--sea-ink-soft)]">
            <Clock size={13} /> {topic.minutes} min read
          </span>
        </div>
        <h1 className="display-title text-3xl font-bold leading-tight text-[var(--sea-ink)] sm:text-4xl">
          {topic.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--sea-ink-soft)]">{topic.blurb}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[var(--chip-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--sea-ink-soft)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_270px]">
        <article className="min-w-0">
          <Content />

          <div className="mt-10 flex flex-col gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:justify-between">
            {prev ? (
              <Link to="/learn/$topicId" params={{ topicId: prev.id }} className="no-underline">
                <Button variant="outline">
                  <ArrowLeft size={16} /> {prev.title}
                </Button>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to="/learn/$topicId" params={{ topicId: next.id }} className="no-underline">
                <Button variant="outline">
                  {next.title} <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
              Track progress
            </div>
            <Button
              variant={isDone ? 'soft' : 'primary'}
              className="w-full"
              onClick={() => progressActions.toggleTopicDone(topicId)}
            >
              {isDone ? (
                <>
                  <Check size={16} /> Completed — undo
                </>
              ) : (
                'Mark topic complete'
              )}
            </Button>
          </Card>

          {quizCount > 0 ? (
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
                <ListChecks size={14} /> Test yourself
              </div>
              <Link
                to="/quiz/$topicId"
                params={{ topicId }}
                className="text-sm font-semibold text-[var(--lagoon-deep)] no-underline"
              >
                Take the {quizCount}-question quiz <ArrowRight size={14} className="inline" />
              </Link>
            </Card>
          ) : null}

          {vizzes.length > 0 ? (
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
                <FlaskConical size={14} /> Related visualizers
              </div>
              <div className="space-y-1.5">
                {vizzes.map((v) => (
                  <Link
                    key={v!.id}
                    to="/visualizers/$vizId"
                    params={{ vizId: v!.id }}
                    className="block text-sm font-semibold text-[var(--lagoon-deep)] no-underline hover:underline"
                  >
                    {v!.title}
                  </Link>
                ))}
              </div>
            </Card>
          ) : null}
        </aside>
      </div>
    </PageShell>
  )
}
