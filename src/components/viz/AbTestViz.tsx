import { useState } from 'react'
import { fmt } from '#/lib/math'
import { VizPanel, Slider, Segmented, ResultRow, Bar, Hint } from './kit'
import { Button } from '#/components/ui'

// standard normal CDF via an erf approximation
function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp(-(x * x) / 2)
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return x >= 0 ? 1 - p : p
}

function binomial(n: number, p: number): number {
  let c = 0
  for (let i = 0; i < n; i++) if (Math.random() < p) c++
  return c
}

interface Result {
  xA: number
  xB: number
  n: number
}

export function AbTestViz() {
  const [trueA, setTrueA] = useState(0.2)
  const [trueB, setTrueB] = useState(0.24)
  const [n, setN] = useState(800)
  const [mode, setMode] = useState<'ab' | 'aa'>('ab')
  const [res, setRes] = useState<Result | null>(null)

  const run = () => {
    const pB = mode === 'aa' ? trueA : trueB
    setRes({ xA: binomial(n, trueA), xB: binomial(n, pB), n })
  }

  let view = null
  if (res) {
    const pA = res.xA / res.n
    const pB = res.xB / res.n
    const pooled = (res.xA + res.xB) / (2 * res.n)
    const se = Math.sqrt(pooled * (1 - pooled) * (2 / res.n)) || 1e-9
    const z = (pB - pA) / se
    const pValue = 2 * (1 - normalCdf(Math.abs(z)))
    const sig = pValue < 0.05
    view = (
      <>
        <VizPanel title="Observed conversion rates">
          <div className="space-y-3">
            <Bar value={pA} max={Math.max(pA, pB, 0.01) * 1.2} tone="muted" label="A — control" caption={`${res.xA}/${res.n} = ${fmt(pA, 3)}`} />
            <Bar value={pB} max={Math.max(pA, pB, 0.01) * 1.2} tone={sig ? 'palm' : 'amber'} label="B — treatment" caption={`${res.xB}/${res.n} = ${fmt(pB, 3)}`} />
          </div>
        </VizPanel>
        <div className="grid gap-2 sm:grid-cols-3">
          <ResultRow label="Observed lift" value={`${fmt((pB - pA) * 100, 2)} pp`} />
          <ResultRow label="z-statistic" value={fmt(z, 2)} />
          <ResultRow label="p-value (2-sided)" value={fmt(pValue, 4)} />
        </div>
        <div
          className="rounded-xl border px-4 py-3 text-sm font-semibold"
          style={{
            borderColor: sig ? 'rgba(47,106,74,0.4)' : 'rgba(214,158,46,0.45)',
            background: sig ? 'rgba(47,106,74,0.1)' : 'rgba(214,158,46,0.1)',
            color: 'var(--sea-ink)',
          }}
        >
          {sig
            ? '✓ Statistically significant at α = 0.05 — the difference is unlikely to be chance.'
            : '✗ Not significant at α = 0.05 — this difference could easily be random noise.'}
        </div>
      </>
    )
  }

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: 'ab', label: 'A/B test' },
          { value: 'aa', label: 'A/A test' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Slider
          label="True rate — A"
          value={trueA}
          onChange={setTrueA}
          min={0.05}
          max={0.5}
          step={0.01}
          display={fmt(trueA, 2)}
        />
        <Slider
          label={mode === 'aa' ? 'True rate — B (= A)' : 'True rate — B'}
          value={mode === 'aa' ? trueA : trueB}
          onChange={setTrueB}
          min={0.05}
          max={0.5}
          step={0.01}
          display={fmt(mode === 'aa' ? trueA : trueB, 2)}
        />
        <Slider
          label="Users per group"
          value={n}
          onChange={(v) => setN(Math.round(v))}
          min={50}
          max={5000}
          step={50}
        />
      </div>

      <Button onClick={run}>Run experiment</Button>

      {view ?? (
        <Hint>
          Pick true rates and a sample size, then run. With A/B and a real difference, a{' '}
          <strong>large enough sample</strong> makes it significant. Switch to A/A (both groups
          identical) — you should rarely see significance; if you do, it is a false positive,
          which is exactly what an A/A test is meant to catch.
        </Hint>
      )}

      {view ? (
        <Hint>
          Try a tiny sample (n = 50): even a real lift often looks &ldquo;not significant&rdquo; —
          the test is under-powered. Then try n = 5000. In A/A mode any &ldquo;significant&rdquo;
          result is purely noise: ~5% of A/A runs trip α = 0.05 by chance.
        </Hint>
      ) : null}
    </div>
  )
}
