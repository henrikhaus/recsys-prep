import { useState } from 'react'
import { Check, X, RotateCcw, ArrowRight } from 'lucide-react'
import { Button, Card, ProgressBar } from '#/components/ui'
import { cn } from '#/lib/utils'
import { progressActions } from '#/lib/progress'
import type { ConceptQuestion } from '#/content/conceptQuiz'

export function QuizRunner({
  questions,
  quizId,
  onRestart,
}: {
  questions: ConceptQuestion[]
  quizId: string
  onRestart: () => void
}) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null))
  const [finished, setFinished] = useState(false)

  const q = questions[i]
  const choice = picked[i]
  const answered = choice !== null
  const score = picked.reduce(
    (s, p, idx) => s + (p === questions[idx].answer ? 1 : 0),
    0,
  )

  const pick = (opt: number) => {
    if (answered) return
    const next = [...picked]
    next[i] = opt
    setPicked(next)
  }

  const finish = () => {
    progressActions.recordConceptQuiz(quizId, score, questions.length)
    setFinished(true)
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <Card className="p-6 text-center">
        <div className="display-title text-5xl font-bold text-[var(--lagoon-deep)]">{pct}%</div>
        <p className="mt-1 text-[var(--sea-ink-soft)]">
          {score} of {questions.length} correct
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-[var(--sea-ink-soft)]">
          {pct >= 80
            ? 'Strong — you have this topic down. Move on or push for 100%.'
            : pct >= 50
              ? 'Decent — review the explanations you missed and try again.'
              : 'Worth another pass through the topic guide before re-testing.'}
        </p>
        <div className="mt-5 space-y-2 text-left">
          {questions.map((qq, idx) => {
            const ok = picked[idx] === qq.answer
            return (
              <div
                key={qq.id}
                className="flex items-start gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2"
              >
                <span className={ok ? 'text-[var(--palm)]' : 'text-[#c0445b]'}>
                  {ok ? <Check size={16} /> : <X size={16} />}
                </span>
                <span className="text-sm text-[var(--sea-ink)]">{qq.question}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-5 flex justify-center gap-2">
          <Button
            onClick={() => {
              setI(0)
              setPicked(questions.map(() => null))
              setFinished(false)
              onRestart()
            }}
          >
            <RotateCcw size={16} /> Try again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-sm font-semibold text-[var(--sea-ink-soft)]">
          <span>
            Question {i + 1} of {questions.length}
          </span>
          <span>Score {score}</span>
        </div>
        <ProgressBar value={(i + (answered ? 1 : 0)) / questions.length} />
      </div>

      <h2 className="text-lg font-bold text-[var(--sea-ink)]">{q.question}</h2>

      <div className="mt-4 space-y-2">
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.answer
          const isPicked = idx === choice
          let style = 'border-[var(--line)] bg-[var(--surface-strong)] hover:border-[var(--lagoon-deep)]'
          if (answered && isCorrect)
            style = 'border-[var(--palm)] bg-[rgba(47,106,74,0.12)]'
          else if (answered && isPicked && !isCorrect)
            style = 'border-[#c0445b] bg-[rgba(214,69,89,0.1)]'
          else if (answered) style = 'border-[var(--line)] bg-[var(--surface-strong)] opacity-60'
          return (
            <button
              key={idx}
              type="button"
              onClick={() => pick(idx)}
              disabled={answered}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium text-[var(--sea-ink)] transition-colors',
                style,
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--line)] text-xs font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{opt}</span>
              {answered && isCorrect ? <Check size={16} className="text-[var(--palm)]" /> : null}
              {answered && isPicked && !isCorrect ? (
                <X size={16} className="text-[#c0445b]" />
              ) : null}
            </button>
          )
        })}
      </div>

      {answered ? (
        <div className="mt-4 rounded-xl border border-[var(--line)] bg-[rgba(79,184,178,0.08)] px-4 py-3 text-sm leading-relaxed text-[var(--sea-ink)]">
          <span className="font-bold">
            {choice === q.answer ? 'Correct. ' : 'Not quite. '}
          </span>
          {q.explanation}
        </div>
      ) : null}

      <div className="mt-5 flex justify-end">
        {i < questions.length - 1 ? (
          <Button onClick={() => setI(i + 1)} disabled={!answered}>
            Next question <ArrowRight size={16} />
          </Button>
        ) : (
          <Button onClick={finish} disabled={!answered}>
            See results
          </Button>
        )}
      </div>
    </Card>
  )
}
