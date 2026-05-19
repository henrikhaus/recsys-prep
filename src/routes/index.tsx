import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BookOpen,
  FlaskConical,
  ListChecks,
  FileText,
  Calculator,
  ScrollText,
  ArrowRight,
  Sparkles,
  Compass,
} from 'lucide-react'
import { PageShell } from '#/components/Page'
import { Button, Card, Kicker, Stat, ProgressBar } from '#/components/ui'
import { TOPICS } from '#/content/topics'
import { CONCEPT_QUESTIONS } from '#/content/conceptQuiz'
import { VISUALIZERS } from '#/content/visualizers'
import { useProgress } from '#/lib/progress'

export const Route = createFileRoute('/')({ component: Home })

const PILLARS = [
  {
    to: '/learn',
    icon: BookOpen,
    title: 'Topic guides',
    desc: '12 lecture-by-lecture explainers built to teach visually, with worked examples and exam tips.',
    meta: `${TOPICS.length} topics`,
  },
  {
    to: '/visualizers',
    icon: FlaskConical,
    title: 'Visualizers',
    desc: 'Interactive tools — drag the numbers and watch cosine, kNN, bandits and metrics come alive.',
    meta: `${VISUALIZERS.length} tools`,
  },
  {
    to: '/quiz',
    icon: ListChecks,
    title: 'Concept quizzes',
    desc: 'Fast multiple-choice self-tests per topic with instant explanations.',
    meta: `${CONCEPT_QUESTIONS.length} questions`,
  },
  {
    to: '/exam',
    icon: FileText,
    title: 'Past exams',
    desc: 'Real TDT4215 papers from 2022–2025 with model answers — practise under exam framing.',
    meta: '5 papers',
  },
  {
    to: '/drills',
    icon: Calculator,
    title: 'Calculation drills',
    desc: 'Endless randomised numeric problems: TF-IDF, cosine, RMSE, Kendall and more.',
    meta: '8 drill types',
  },
  {
    to: '/cheatsheet',
    icon: ScrollText,
    title: 'Cheat sheet',
    desc: 'Every formula and definition on one page — the last-hour revision view.',
    meta: 'one page',
  },
]

const PATH = [
  {
    n: 1,
    title: 'Read the topic guides',
    text: 'Work through the 12 topics. Each takes 11–22 minutes and ends with a self-check.',
    to: '/learn',
    cta: 'Open topics',
  },
  {
    n: 2,
    title: 'Play with the visualizers',
    text: 'Build intuition for the maths — similarity, factorization, bandits, metrics — by tinkering.',
    to: '/visualizers',
    cta: 'Open visualizers',
  },
  {
    n: 3,
    title: 'Drill the calculations',
    text: 'The exam always has hand-calculations. Repeat randomised drills until they are automatic.',
    to: '/drills',
    cta: 'Start drilling',
  },
  {
    n: 4,
    title: 'Sit the past exams',
    text: 'Quiz yourself per topic, then answer full past papers and compare with the model answers.',
    to: '/exam',
    cta: 'Open past exams',
  },
]

function Home() {
  const progress = useProgress()
  const done = progress.topicsDone.length
  const taken = Object.values(progress.conceptQuiz)
  const avg = taken.length
    ? Math.round((taken.reduce((s, q) => s + q.best, 0) / taken.length) * 100)
    : 0
  const drillRate = progress.drill.attempted
    ? Math.round((progress.drill.correct / progress.drill.attempted) * 100)
    : 0

  return (
    <PageShell>
      <section className="island-shell mb-10 rounded-3xl p-8 sm:p-12">
        <Kicker className="mb-3">TDT4215 · Recommender Systems</Kicker>
        <h1 className="display-title max-w-3xl text-4xl font-bold leading-[1.1] text-[var(--sea-ink)] sm:text-5xl">
          Everything you need for the RecSys exam, in one focused trainer.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--sea-ink-soft)]">
          Topic guides, interactive visualizers, quizzes, past papers and endless calculation
          drills — built to take you from the lecture list to exam-ready as fast as possible.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/learn">
            <Button size="lg">
              Start learning <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/visualizers">
            <Button size="lg" variant="outline">
              <Sparkles size={18} /> Explore visualizers
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <Compass size={18} className="text-[var(--lagoon-deep)]" />
          <h2 className="display-title text-xl font-bold text-[var(--sea-ink)]">Your progress</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Stat label="Topics completed" value={`${done} / ${TOPICS.length}`} />
            <ProgressBar className="mt-2" value={done / TOPICS.length} />
          </div>
          <div>
            <Stat
              label="Quiz best average"
              value={`${avg}%`}
              hint={`${taken.length} topic quizzes attempted`}
            />
            <ProgressBar className="mt-2" value={avg / 100} tone="palm" />
          </div>
          <div>
            <Stat
              label="Drill accuracy"
              value={`${drillRate}%`}
              hint={`${progress.drill.correct}/${progress.drill.attempted} drills correct`}
            />
            <ProgressBar className="mt-2" value={drillRate / 100} tone="amber" />
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="display-title mb-4 text-xl font-bold text-[var(--sea-ink)]">
          A 4-step study path
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {PATH.map((s) => (
            <Card key={s.n} className="feature-card flex flex-col gap-2 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-fill)] text-base font-bold text-[var(--accent-on)]">
                  {s.n}
                </span>
                <h3 className="text-lg font-bold text-[var(--sea-ink)]">{s.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--sea-ink-soft)]">{s.text}</p>
              <Link
                to={s.to}
                className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-[var(--lagoon-deep)] no-underline"
              >
                {s.cta} <ArrowRight size={15} />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="display-title mb-4 text-xl font-bold text-[var(--sea-ink)]">
          Everything in the trainer
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon
            return (
              <Link key={p.to} to={p.to} className="no-underline">
                <Card className="feature-card flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(79,184,178,0.16)] text-[var(--lagoon-deep)]">
                      <Icon size={20} />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
                      {p.meta}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--sea-ink)]">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--sea-ink-soft)]">{p.desc}</p>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </PageShell>
  )
}
