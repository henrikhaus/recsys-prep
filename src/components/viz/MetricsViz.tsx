import { useState } from 'react'
import {
  precisionAtK,
  recallAtK,
  ndcg,
  reciprocalRank,
  arhr,
  mae,
  rmse,
  kendallTau,
  sum,
  fmt,
} from '#/lib/math'
import { VizPanel, Segmented, Slider, NumInput, ResultRow, Hint } from './kit'
import { cn } from '#/lib/utils'
import { ArrowUp, ArrowDown } from 'lucide-react'

function RankingTab() {
  const [rel, setRel] = useState<boolean[]>([
    true,
    false,
    false,
    true,
    false,
    true,
    false,
    false,
  ])
  const [k, setK] = useState(5)
  const bits = rel.map((r) => (r ? 1 : 0))
  const totalRel = sum(bits)

  return (
    <div className="space-y-4">
      <VizPanel title="Recommended list — tap an item to flag it relevant">
        <div className="flex flex-wrap gap-2">
          {rel.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const n = [...rel]
                n[i] = !n[i]
                setRel(n)
              }}
              className={cn(
                'flex h-12 w-12 flex-col items-center justify-center rounded-lg border text-sm font-bold transition-colors',
                i < k ? 'ring-2 ring-[var(--lagoon-deep)] ring-offset-1' : '',
                r
                  ? 'border-[var(--palm)] bg-[rgba(47,106,74,0.16)] text-[var(--palm)]'
                  : 'border-[var(--line)] bg-white text-[var(--sea-ink-soft)]',
              )}
            >
              <span className="text-[10px] font-semibold opacity-70">#{i + 1}</span>
              {r ? '✓' : '·'}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-[var(--sea-ink-soft)]">
          Green = relevant. Ringed = inside the top-k cutoff.
        </p>
      </VizPanel>

      <Slider label="k — cutoff" value={k} onChange={setK} min={1} max={8} />

      <div className="grid gap-2 sm:grid-cols-2">
        <ResultRow
          label={`Precision@${k}`}
          value={fmt(precisionAtK(bits, k), 3)}
          hint="relevant in top-k ÷ k"
        />
        <ResultRow
          label={`Recall@${k}`}
          value={fmt(recallAtK(bits, k, totalRel), 3)}
          hint="found ÷ all relevant"
        />
        <ResultRow label="NDCG" value={fmt(ndcg(bits), 3)} hint="vs. ideal order" />
        <ResultRow
          label="MRR / RR"
          value={fmt(reciprocalRank(bits), 3)}
          hint="1 ÷ rank of first hit"
        />
        <ResultRow label="ARHR" value={fmt(arhr(bits), 3)} hint="Σ 1/rank over all hits" strong />
        <ResultRow label="Total relevant" value={totalRel} />
      </div>

      <Hint>
        Precision asks &ldquo;how much of what I showed is good?&rdquo;, recall asks &ldquo;how
        much of the good stuff did I find?&rdquo;. NDCG and MRR/ARHR additionally{' '}
        <strong>reward hits near the top</strong> — move a relevant item to rank 1 and watch them
        jump.
      </Hint>
    </div>
  )
}

function ErrorTab() {
  const [rows, setRows] = useState<{ p: number; a: number }[]>([
    { p: 3.5, a: 5 },
    { p: 1.7, a: 3 },
    { p: 3.6, a: 2 },
    { p: 2.0, a: 1 },
    { p: 2.5, a: 4 },
    { p: 4.6, a: 5 },
  ])
  const errors = rows.map((r) => r.p - r.a)
  const maxErr = Math.max(0.5, ...errors.map((e) => Math.abs(e)))

  return (
    <div className="space-y-4">
      <VizPanel title="Predicted vs. actual ratings">
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
            <span>Predicted</span>
            <span>Actual</span>
            <span className="w-20 text-right">error</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
              <NumInput
                value={r.p}
                step={0.1}
                onChange={(v) => {
                  const n = [...rows]
                  n[i] = { ...n[i], p: v }
                  setRows(n)
                }}
              />
              <NumInput
                value={r.a}
                step={0.5}
                onChange={(v) => {
                  const n = [...rows]
                  n[i] = { ...n[i], a: v }
                  setRows(n)
                }}
              />
              <span className="w-20 text-right text-sm font-bold tabular-nums text-[var(--sea-ink)]">
                {fmt(errors[i], 2)}
              </span>
            </div>
          ))}
        </div>
      </VizPanel>

      <VizPanel title="Squared vs. absolute error">
        <div className="space-y-2">
          {errors.map((e, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-8 text-xs text-[var(--sea-ink-soft)]">#{i + 1}</span>
              <div className="flex-1">
                <div className="h-2.5 overflow-hidden rounded-full bg-[rgba(23,58,64,0.08)]">
                  <div
                    className="h-full rounded-full bg-[var(--lagoon-deep)]"
                    style={{ width: `${(Math.abs(e) / maxErr) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-28 text-right text-xs tabular-nums text-[var(--sea-ink-soft)]">
                |e|={fmt(Math.abs(e), 2)} · e²={fmt(e * e, 2)}
              </span>
            </div>
          ))}
        </div>
      </VizPanel>

      <div className="grid gap-2 sm:grid-cols-2">
        <ResultRow label="MAE" value={fmt(mae(errors), 4)} hint="mean of |e|" />
        <ResultRow label="RMSE" value={fmt(rmse(errors), 4)} hint="√ mean of e²" strong />
      </div>
      <Hint>
        RMSE ≥ MAE always. Push one prediction far from its actual value — RMSE climbs faster
        because the error is <strong>squared</strong>, so RMSE punishes a few big mistakes harder
        than many small ones.
      </Hint>
    </div>
  )
}

const LETTERS = ['A', 'B', 'C', 'D', 'E']

function KendallTab() {
  // order holds, for each predicted position, the item's ground-truth rank (1=best)
  const [order, setOrder] = useState<number[]>([2, 1, 3, 5, 4])

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= order.length) return
    const n = [...order]
    ;[n[i], n[j]] = [n[j], n[i]]
    setOrder(n)
  }

  let concordant = 0
  let discordant = 0
  for (let i = 0; i < order.length; i++)
    for (let j = i + 1; j < order.length; j++)
      order[j] > order[i] ? concordant++ : discordant++
  const tau = kendallTau(order)

  return (
    <div className="space-y-4">
      <VizPanel title="Predicted ranking — reorder it; the number is each item's true rank">
        <div className="space-y-2">
          {order.map((trueRank, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-white px-3 py-2"
            >
              <span className="text-sm font-bold text-[var(--sea-ink-soft)]">#{i + 1}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--lagoon-deep)] text-sm font-bold text-white">
                {LETTERS[trueRank - 1]}
              </span>
              <span className="flex-1 text-sm text-[var(--sea-ink)]">
                true rank <strong>{trueRank}</strong>
              </span>
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="rounded-md border border-[var(--line)] p-1 text-[var(--sea-ink)] disabled:opacity-30"
                disabled={i === 0}
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="rounded-md border border-[var(--line)] p-1 text-[var(--sea-ink)] disabled:opacity-30"
                disabled={i === order.length - 1}
              >
                <ArrowDown size={14} />
              </button>
            </div>
          ))}
        </div>
      </VizPanel>

      <div className="grid gap-2 sm:grid-cols-3">
        <ResultRow label="Concordant pairs" value={concordant} />
        <ResultRow label="Discordant pairs" value={discordant} />
        <ResultRow label="Total pairs" value={(order.length * (order.length - 1)) / 2} />
      </div>
      <ResultRow
        label="Kendall's τ = (C − D) / total pairs"
        value={fmt(tau, 3)}
        strong
        hint={`(${concordant} − ${discordant}) / ${(order.length * (order.length - 1)) / 2}`}
      />
      <Hint>
        Put the items in perfect order (1,2,3,4,5) for τ = 1; reverse it for τ = −1. Kendall&rsquo;s
        τ counts how many pairs of items the predicted order gets in the correct relative sequence.
      </Hint>
    </div>
  )
}

export function MetricsViz() {
  const [tab, setTab] = useState<'rank' | 'error' | 'kendall'>('rank')
  return (
    <div className="space-y-4">
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'rank', label: 'Ranking metrics' },
          { value: 'error', label: 'Rating error' },
          { value: 'kendall', label: 'Rank correlation' },
        ]}
      />
      {tab === 'rank' ? <RankingTab /> : tab === 'error' ? <ErrorTab /> : <KendallTab />}
    </div>
  )
}
