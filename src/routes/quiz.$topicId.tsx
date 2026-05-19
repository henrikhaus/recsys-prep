import { useMemo, useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { PageShell, BackLink } from '#/components/Page'
import { QuizRunner } from '#/components/QuizRunner'
import { getTopic } from '#/content/topics'
import { CONCEPT_QUESTIONS, conceptByTopic } from '#/content/conceptQuiz'
import type { ConceptQuestion } from '#/content/conceptQuiz'

export const Route = createFileRoute('/quiz/$topicId')({
  component: QuizPage,
  loader: ({ params }) => {
    if (params.topicId !== 'mixed' && !getTopic(params.topicId)) throw notFound()
    return null
  },
  notFoundComponent: () => (
    <PageShell>
      <p className="text-[var(--sea-ink)]">Quiz not found.</p>
      <Link to="/quiz" className="text-[var(--lagoon-deep)]">
        Back to quizzes
      </Link>
    </PageShell>
  ),
})

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function QuizPage() {
  const { topicId } = Route.useParams()
  const [seed, setSeed] = useState(0)
  const isMixed = topicId === 'mixed'
  const topic = isMixed ? null : getTopic(topicId)
  const title = isMixed ? 'Mixed quiz' : topic!.title

  const questions = useMemo<ConceptQuestion[]>(() => {
    void seed
    const base = isMixed ? CONCEPT_QUESTIONS : conceptByTopic(topicId)
    return shuffle(base)
  }, [topicId, isMixed, seed])

  return (
    <PageShell>
      <div className="mb-5">
        <BackLink to="/quiz" label="All quizzes" />
      </div>
      <header className="mb-6">
        <div className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
          Concept quiz
        </div>
        <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-[var(--sea-ink-soft)]">
          {questions.length} questions · pick an answer to see the explanation.
        </p>
      </header>

      <QuizRunner
        key={seed}
        questions={questions}
        quizId={topicId}
        onRestart={() => setSeed((s) => s + 1)}
      />
    </PageShell>
  )
}
