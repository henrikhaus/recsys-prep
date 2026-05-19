import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, FileText, Check } from 'lucide-react'
import { PageShell, PageHero } from '#/components/Page'
import { Card, Badge } from '#/components/ui'
import { EXAMS } from '#/content/exams'
import { useProgress } from '#/lib/progress'

export const Route = createFileRoute('/exam/')({ component: ExamIndex })

function ExamIndex() {
  const progress = useProgress()

  return (
    <PageShell>
      <PageHero
        kicker="Past exams"
        title="Real TDT4215 papers, 2022–2025"
        lead="Each question is reproduced with a model answer you can reveal. Draft your own answer first, then compare. Multiple-choice questions are interactive."
      />

      <Card className="mb-6 border-l-4 border-l-[var(--lagoon-deep)] p-4 text-sm text-[var(--sea-ink-soft)]">
        The 2024, 2024 re-sit and 2025 papers match the current 12-lecture syllabus and lecturer.
        The 2022–2023 papers are from an older syllabus — their semantic-web / SPARQL questions are
        omitted, but the rest is still fair game.
      </Card>

      <div className="grid gap-3">
        {EXAMS.map((exam) => {
          const total = exam.questions.reduce((s, q) => s + q.points, 0)
          const seen = progress.examSeen.includes(exam.id)
          return (
            <Link key={exam.id} to="/exam/$examId" params={{ examId: exam.id }} className="no-underline">
              <Card className="feature-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(79,184,178,0.16)] text-[var(--lagoon-deep)]">
                  <FileText size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-[var(--sea-ink)]">{exam.title}</h3>
                    {seen ? (
                      <Badge tone="palm">
                        <Check size={12} /> opened
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-[var(--sea-ink-soft)]">
                    {exam.date} · {exam.questions.length} questions · {total} points
                  </p>
                  <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">{exam.note}</p>
                </div>
                <ArrowRight size={18} className="hidden shrink-0 text-[var(--lagoon-deep)] sm:block" />
              </Card>
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}
