import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Shuffle, ListChecks } from 'lucide-react'
import { PageShell, PageHero } from '#/components/Page'
import { Card, Badge } from '#/components/ui'
import { TOPICS } from '#/content/topics'
import { CONCEPT_QUESTIONS, conceptByTopic } from '#/content/conceptQuiz'
import { useProgress } from '#/lib/progress'

export const Route = createFileRoute('/quiz/')({ component: QuizIndex })

function QuizIndex() {
  const progress = useProgress()
  const withQuiz = TOPICS.filter((t) => conceptByTopic(t.id).length > 0)

  return (
    <PageShell>
      <PageHero
        kicker="Concept quizzes"
        title="Quick-fire self-testing"
        lead="Multiple-choice questions with an instant explanation after every answer. Test one topic, or shuffle the whole question bank."
      />

      <Link to="/quiz/$topicId" params={{ topicId: 'mixed' }} className="no-underline">
        <Card className="feature-card mb-6 flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--lagoon-deep)] text-white">
            <Shuffle size={22} />
          </span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[var(--sea-ink)]">Mixed quiz</h3>
            <p className="text-sm text-[var(--sea-ink-soft)]">
              All {CONCEPT_QUESTIONS.length} questions, shuffled — a full course self-test.
            </p>
          </div>
          <ArrowRight size={18} className="text-[var(--lagoon-deep)]" />
        </Card>
      </Link>

      <div className="grid gap-3 sm:grid-cols-2">
        {withQuiz.map((t) => {
          const count = conceptByTopic(t.id).length
          const result = progress.conceptQuiz[t.id]
          const best = result ? Math.round(result.best * 100) : null
          return (
            <Link key={t.id} to="/quiz/$topicId" params={{ topicId: t.id }} className="no-underline">
              <Card className="feature-card flex h-full items-center gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(79,184,178,0.16)] text-[var(--lagoon-deep)]">
                  <ListChecks size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-bold text-[var(--sea-ink)]">
                    {t.title}
                  </h3>
                  <p className="text-sm text-[var(--sea-ink-soft)]">{count} questions</p>
                </div>
                {best !== null ? (
                  <Badge tone={best >= 80 ? 'palm' : best >= 50 ? 'amber' : 'rose'}>
                    best {best}%
                  </Badge>
                ) : (
                  <ArrowRight size={16} className="text-[var(--lagoon-deep)]" />
                )}
              </Card>
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}
