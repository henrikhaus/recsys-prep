import { useState } from 'react'
import { fmt } from '#/lib/math'
import { VizPanel, NumInput, Slider, Segmented, ResultRow, Bar, Hint } from './kit'
import { Button } from '#/components/ui'
import { cn } from '#/lib/utils'

interface Arm {
  truth: number
  pulls: number
  succ: number
}

type Strategy = 'eps' | 'ucb' | 'thompson'

const INITIAL: Arm[] = [
  { truth: 0.3, pulls: 0, succ: 0 },
  { truth: 0.55, pulls: 0, succ: 0 },
  { truth: 0.72, pulls: 0, succ: 0 },
  { truth: 0.45, pulls: 0, succ: 0 },
]

const estimate = (a: Arm) => (a.pulls ? a.succ / a.pulls : 0)

// Box–Muller normal sample
function randNormal(mean: number, sd: number): number {
  const u = Math.random() || 1e-9
  const v = Math.random()
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function pickArm(arms: Arm[], strat: Strategy, eps: number, total: number): number {
  // any unpulled arm goes first
  const unpulled = arms.findIndex((a) => a.pulls === 0)
  if (unpulled !== -1) return unpulled

  if (strat === 'eps') {
    if (Math.random() < eps) return Math.floor(Math.random() * arms.length)
    return argmax(arms.map(estimate))
  }
  if (strat === 'ucb') {
    return argmax(
      arms.map((a) => estimate(a) + Math.sqrt((2 * Math.log(total)) / a.pulls)),
    )
  }
  // Thompson — sample from a normal approximation of each Beta posterior
  return argmax(
    arms.map((a) => {
      const s = a.succ + 1
      const f = a.pulls - a.succ + 1
      const n = s + f
      const m = s / n
      const sd = Math.sqrt((s * f) / (n * n * (n + 1)))
      return Math.min(1, Math.max(0, randNormal(m, sd)))
    }),
  )
}

const argmax = (xs: number[]): number =>
  xs.reduce((best, x, i) => (x > xs[best] ? i : best), 0)

export function BanditViz() {
  const [arms, setArms] = useState<Arm[]>(INITIAL)
  const [strat, setStrat] = useState<Strategy>('eps')
  const [eps, setEps] = useState(0.1)
  const [reward, setReward] = useState(0)
  const [regret, setRegret] = useState(0)

  const total = arms.reduce((s, a) => s + a.pulls, 0)
  const best = Math.max(...arms.map((a) => a.truth))
  const next = total > 0 || arms.some((a) => a.pulls > 0) ? pickArm(arms, strat, eps, total + 1) : 0

  const pull = (times: number) => {
    let cur = arms.map((a) => ({ ...a }))
    let r = reward
    let reg = regret
    for (let t = 0; t < times; t++) {
      const i = pickArm(cur, strat, eps, cur.reduce((s, a) => s + a.pulls, 0) + 1)
      const win = Math.random() < cur[i].truth ? 1 : 0
      cur[i] = { ...cur[i], pulls: cur[i].pulls + 1, succ: cur[i].succ + win }
      r += win
      reg += best - cur[i].truth
    }
    setArms(cur)
    setReward(r)
    setRegret(reg)
  }

  const reset = () => {
    setArms(arms.map((a) => ({ ...a, pulls: 0, succ: 0 })))
    setReward(0)
    setRegret(0)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={strat}
          onChange={setStrat}
          options={[
            { value: 'eps', label: 'ε-greedy' },
            { value: 'ucb', label: 'UCB' },
            { value: 'thompson', label: 'Thompson' },
          ]}
        />
        {strat === 'eps' ? (
          <div className="w-48">
            <Slider
              label="ε"
              value={eps}
              onChange={setEps}
              min={0}
              max={1}
              step={0.05}
              display={eps.toFixed(2)}
            />
          </div>
        ) : null}
      </div>

      <VizPanel title="Arms — set the hidden true win-rate, then let the strategy learn it">
        <div className="space-y-3">
          {arms.map((a, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold',
                    i === next
                      ? 'bg-[var(--lagoon-deep)] text-white'
                      : 'bg-[rgba(23,58,64,0.08)] text-[var(--sea-ink-soft)]',
                  )}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-[var(--sea-ink-soft)]">true rate</span>
                <div className="w-20">
                  <NumInput
                    value={a.truth}
                    step={0.05}
                    min={0}
                    max={1}
                    onChange={(v) => {
                      const n = [...arms]
                      n[i] = { ...n[i], truth: Math.min(1, Math.max(0, v)) }
                      setArms(n)
                    }}
                  />
                </div>
                {i === next ? (
                  <span className="rounded bg-[var(--lagoon-deep)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    next pull
                  </span>
                ) : null}
                <span className="ml-auto text-xs tabular-nums text-[var(--sea-ink-soft)]">
                  est {fmt(estimate(a), 2)} · {a.succ}/{a.pulls}
                </span>
              </div>
              <Bar
                value={estimate(a)}
                max={1}
                tone={i === argmax(arms.map((x) => x.truth)) ? 'palm' : 'lagoon'}
                label={<span className="text-xs">estimated value</span>}
                caption={`${a.pulls} pulls`}
              />
            </div>
          ))}
        </div>
      </VizPanel>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => pull(1)}>Pull once</Button>
        <Button variant="outline" onClick={() => pull(20)}>
          Pull ×20
        </Button>
        <Button variant="outline" onClick={() => pull(100)}>
          Pull ×100
        </Button>
        <Button variant="ghost" onClick={reset}>
          Reset
        </Button>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <ResultRow label="Total pulls" value={total} />
        <ResultRow label="Total reward" value={reward} hint={total ? fmt(reward / total, 2) : ''} />
        <ResultRow label="Cumulative regret" value={fmt(regret, 1)} strong />
      </div>

      <Hint>
        Regret is reward lost by not always pulling the best arm. A good strategy keeps regret
        growing <strong>slowly</strong>. Set ε = 0 (pure exploit) and a strategy can lock onto a
        sub-optimal arm forever; set ε = 1 (pure explore) and it never cashes in. UCB and Thompson
        explore <em>adaptively</em> — heavily at first, then less.
      </Hint>
    </div>
  )
}
