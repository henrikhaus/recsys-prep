import { useEffect, useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Check, X } from 'lucide-react'
import { PageShell, BackLink } from '#/components/Page'
import { Card, Badge, Button } from '#/components/ui'
import { Reveal } from '#/components/teach'
import { getExam } from '#/content/exams'
import type { ExamQuestion } from '#/content/exams'
import { getTopic } from '#/content/topics'
import { progressActions } from '#/lib/progress'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/exam/$examId')({
  component: ExamPage,
  loader: ({ params }) => {
    if (!getExam(params.examId)) throw notFound()
    return null
  },
  notFoundComponent: () => (
    <PageShell>
      <p className="text-[var(--sea-ink)]">Exam not found.</p>
      <Link to="/exam" className="text-[var(--lagoon-deep)]">
        Back to past exams
      </Link>
    </PageShell>
  ),
})

function MultiLine({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <p key={i} className="leading-relaxed text-[var(--sea-ink)]">
          {line}
        </p>
      ))}
    </>
  )
}

function QuestionCard({ q }: { q: ExamQuestion }) {
  const [pick, setPick] = useState<number | null>(null)
  const [draft, setDraft] = useState('')

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-[var(--sea-ink)] px-2 py-0.5 text-xs font-bold text-white">
          {q.number}
        </span>
        <h3 className="text-lg font-bold text-[var(--sea-ink)]">{q.title}</h3>
        <Badge tone="amber">{q.points} pts</Badge>
        {q.type === 'mcq' ? <Badge tone="lagoon">multiple choice</Badge> : null}
      </div>

      <div className="mb-4 space-y-1.5">
        <MultiLine text={q.prompt} />
      </div>

      {q.type === 'mcq' && q.options ? (
        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            const answered = pick !== null
            const isCorrect = idx === q.answer
            const isPicked = idx === pick
            let style = 'border-[var(--line)] bg-white hover:border-[var(--lagoon-deep)]'
            if (answered && isCorrect) style = 'border-[var(--palm)] bg-[rgba(47,106,74,0.12)]'
            else if (answered && isPicked) style = 'border-[#c0445b] bg-[rgba(214,69,89,0.1)]'
            else if (answered) style = 'border-[var(--line)] bg-white opacity-60'
            return (
              <button
                key={idx}
                type="button"
                disabled={answered}
                onClick={() => setPick(idx)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm font-medium text-[var(--sea-ink)]',
                  style,
                )}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--line)] text-xs font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{opt}</span>
                {answered && isCorrect ? <Check size={15} className="text-[var(--palm)]" /> : null}
                {answered && isPicked && !isCorrect ? (
                  <X size={15} className="text-[#c0445b]" />
                ) : null}
              </button>
            )
          })}
        </div>
      ) : (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          placeholder="Draft your answer here, then reveal the model answer to compare…"
          className="w-full resize-y rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none"
        />
      )}

      <div className="mt-4">
        <Reveal label={q.type === 'mcq' ? 'Show answer & explanation' : 'Show model answer'}>
          <MultiLine text={q.modelAnswer} />
          {q.topics.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {q.topics.map((tid) => {
                const t = getTopic(tid)
                if (!t) return null
                return (
                  <Link
                    key={tid}
                    to="/learn/$topicId"
                    params={{ topicId: tid }}
                    className="rounded-md bg-[var(--chip-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--lagoon-deep)] no-underline"
                  >
                    {t.title}
                  </Link>
                )
              })}
            </div>
          ) : null}
        </Reveal>
      </div>
    </Card>
  )
}

function ExamPage() {
  const { examId } = Route.useParams()
  const exam = getExam(examId)!

  useEffect(() => {
    progressActions.markExamSeen(examId)
  }, [examId])

  const total = exam.questions.reduce((s, q) => s + q.points, 0)

  return (
    <PageShell>
      <div className="mb-5">
        <BackLink to="/exam" label="All past exams" />
      </div>

      <header className="mb-6">
        <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
          {exam.title}
        </h1>
        <p className="mt-2 text-[var(--sea-ink-soft)]">
          {exam.date} · {exam.support} · {exam.questions.length} questions · {total} points
        </p>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sea-ink-soft)]">{exam.note}</p>
      </header>

      <div className="space-y-4">
        {exam.questions.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/exam" className="no-underline">
          <Button variant="outline">Back to all exams</Button>
        </Link>
      </div>
    </PageShell>
  )
}
