import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check, X, RefreshCw } from 'lucide-react'
import { PageShell, PageHero } from '#/components/Page'
import { Card, Button, Stat, Badge } from '#/components/ui'
import { Segmented } from '#/components/viz/kit'
import { DRILL_KINDS, getDrillKind, randomDrill } from '#/content/drills'
import type { DrillInstance } from '#/content/drills'
import { useProgress, progressActions } from '#/lib/progress'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/drills')({ component: DrillsPage })

function make(kind: string): DrillInstance {
  if (kind === 'mixed') return randomDrill()
  return (getDrillKind(kind) ?? DRILL_KINDS[0]).gen()
}

function DrillsPage() {
  const progress = useProgress()
  const [kind, setKind] = useState('mixed')
  const [drill, setDrill] = useState<DrillInstance | null>(null)
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [showSolution, setShowSolution] = useState(false)

  const fresh = (k: string) => {
    setDrill(make(k))
    setInput('')
    setResult(null)
    setShowSolution(false)
  }

  useEffect(() => {
    fresh(kind)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])

  const check = () => {
    if (!drill || result) return
    const val = parseFloat(input.replace(',', '.'))
    const ok = Number.isFinite(val) && Math.abs(val - drill.answer) <= drill.tolerance
    setResult(ok ? 'correct' : 'wrong')
    setShowSolution(true)
    progressActions.recordDrill(drill.kind, ok)
  }

  const acc = progress.drill.attempted
    ? Math.round((progress.drill.correct / progress.drill.attempted) * 100)
    : 0

  return (
    <PageShell>
      <PageHero
        kicker="Calculation drills"
        title="Drill the exam arithmetic"
        lead="Every TDT4215 paper has hand-calculations. These randomised problems never run out — repeat until TF-IDF, cosine and the metrics are automatic."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Drills attempted" value={progress.drill.attempted} />
        <Stat label="Correct" value={progress.drill.correct} />
        <Stat label="Accuracy" value={`${acc}%`} />
      </div>

      <div className="mb-5">
        <div className="mb-2 text-sm font-semibold text-[var(--sea-ink)]">Drill type</div>
        <Segmented
          value={kind}
          onChange={setKind}
          options={[
            { value: 'mixed', label: 'Mixed' },
            ...DRILL_KINDS.map((d) => ({ value: d.id, label: d.title })),
          ]}
        />
      </div>

      {drill ? (
        <Card className="p-6">
          <div className="mb-3 flex items-center gap-2">
            <Badge tone="lagoon">{drill.title}</Badge>
          </div>
          <p className="text-[var(--sea-ink)]">{drill.question}</p>

          <div className="mt-4 space-y-1.5">
            {drill.given.map((g, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between gap-3 rounded-lg bg-[rgba(23,58,64,0.04)] px-3 py-2"
              >
                <span className="text-sm text-[var(--sea-ink-soft)]">{g.label}</span>
                <span className="font-bold tabular-nums text-[var(--sea-ink)]">{g.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-2">
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">Your answer</div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && check()}
                disabled={result !== null}
                placeholder="number"
                className="w-44 rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm font-semibold text-[var(--sea-ink)] tabular-nums focus:border-[var(--lagoon-deep)] focus:outline-none disabled:opacity-60"
              />
            </label>
            {result === null ? (
              <Button onClick={check}>Check answer</Button>
            ) : (
              <Button variant="outline" onClick={() => fresh(kind)}>
                <RefreshCw size={15} /> Next problem
              </Button>
            )}
          </div>

          {result ? (
            <div
              className={cn(
                'mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold',
                result === 'correct'
                  ? 'border-[var(--palm)] bg-[rgba(47,106,74,0.1)] text-[var(--palm)]'
                  : 'border-[#c0445b] bg-[rgba(214,69,89,0.09)] text-[#b23a4c]',
              )}
            >
              {result === 'correct' ? <Check size={16} /> : <X size={16} />}
              {result === 'correct'
                ? 'Correct!'
                : `Not quite — the answer is ${drill.answer}${drill.unit ?? ''}.`}
            </div>
          ) : null}

          {showSolution ? (
            <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
                Worked solution
              </div>
              <ol className="space-y-1.5">
                {drill.solution.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed text-[var(--sea-ink)]">
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </Card>
      ) : (
        <Card className="p-6 text-[var(--sea-ink-soft)]">Loading a problem…</Card>
      )}
    </PageShell>
  )
}
