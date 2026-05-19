import { useState } from 'react'
import { dot, fmt } from '#/lib/math'
import { VizPanel, NumInput, Bar, Hint } from './kit'
import { cn } from '#/lib/utils'

const FACTORS = ['Factor 1', 'Factor 2', 'Factor 3']

export function MfViz() {
  const [user, setUser] = useState<number[]>([0.9, 0.3, 0.2])
  const [items, setItems] = useState<number[][]>([
    [0.9, 0.3, 0.25],
    [0.75, 0.4, 0.3],
    [0.6, 0.5, 0.4],
    [0.3, 0.85, 0.4],
    [0.4, 0.7, 0.5],
    [0.25, 0.35, 0.95],
  ])

  const setUserCell = (i: number, v: number) => {
    const n = [...user]
    n[i] = v
    setUser(n)
  }
  const setItemCell = (it: number, i: number, v: number) => {
    const n = items.map((r) => [...r])
    n[it][i] = v
    setItems(n)
  }

  const scored = items
    .map((q, idx) => ({ idx, score: dot(user, q), q }))
    .sort((a, b) => b.score - a.score)
  const max = Math.max(0.001, ...scored.map((s) => s.score))

  return (
    <div className="space-y-4">
      <VizPanel title="User factor vector  pᵤ">
        <div className="grid grid-cols-3 gap-2">
          {user.map((v, i) => (
            <div key={i}>
              <div className="mb-1 text-center text-xs font-semibold text-[var(--sea-ink-soft)]">
                {FACTORS[i]}
              </div>
              <NumInput value={v} onChange={(x) => setUserCell(i, x)} step={0.05} />
            </div>
          ))}
        </div>
      </VizPanel>

      <VizPanel title="Item factor vectors  qᵢ">
        <div className="space-y-2">
          {items.map((q, it) => (
            <div key={it} className="flex items-center gap-2">
              <span className="w-14 shrink-0 text-sm font-semibold text-[var(--sea-ink)]">
                Item {it + 1}
              </span>
              <div className="grid flex-1 grid-cols-3 gap-2">
                {q.map((v, i) => (
                  <NumInput
                    key={i}
                    value={v}
                    onChange={(x) => setItemCell(it, i, x)}
                    step={0.05}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </VizPanel>

      <VizPanel title="Predicted score  r̂ = pᵤ · qᵢ  — ranked">
        <div className="space-y-2.5">
          {scored.map((s, rank) => (
            <Bar
              key={s.idx}
              value={s.score}
              max={max}
              tone={rank < 3 ? 'lagoon' : 'muted'}
              label={
                <span>
                  <span
                    className={cn(
                      'mr-2 inline-block w-5 text-center font-bold',
                      rank < 3 ? 'text-[var(--lagoon-deep)]' : 'text-[var(--sea-ink-soft)]',
                    )}
                  >
                    #{rank + 1}
                  </span>
                  Item {s.idx + 1}
                </span>
              }
              caption={
                <span>
                  {s.q.map((v, i) => `${fmt(user[i], 2)}·${fmt(v, 2)}`).join(' + ')} ={' '}
                  <strong>{fmt(s.score, 3)}</strong>
                </span>
              }
            />
          ))}
        </div>
      </VizPanel>

      <Hint>
        Matrix factorization gives every user and item a short vector of <strong>latent
        factors</strong>. The predicted rating is just their <strong>dot product</strong>. The
        top-scoring items become the recommendations — here the top 3 are highlighted.
      </Hint>
    </div>
  )
}
