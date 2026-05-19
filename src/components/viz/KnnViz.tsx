import { useMemo, useState } from 'react'
import { cosine, pearson, fmt } from '#/lib/math'
import { VizPanel, Segmented, Slider, ResultRow, Bar, Hint } from './kit'
import { cn } from '#/lib/utils'

const USERS = ['Alice', 'Bob', 'Carol', 'Dan', 'Eve']
const ITEMS = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']

const INITIAL = [
  [5, 3, 4, 1, 2],
  [4, 2, 5, 1, 1],
  [1, 5, 2, 4, 5],
  [2, 4, 1, 5, 4],
  [5, 2, 4, 2, 3],
]

export function KnnViz() {
  const [matrix, setMatrix] = useState<number[][]>(INITIAL)
  const [mode, setMode] = useState<'user' | 'item'>('user')
  const [metric, setMetric] = useState<'cosine' | 'pearson'>('cosine')
  const [tRow, setTRow] = useState(2)
  const [tCol, setTCol] = useState(2)
  const [k, setK] = useState(2)

  const setCell = (r: number, c: number, v: number) => {
    const next = matrix.map((row) => [...row])
    next[r][c] = Math.max(1, Math.min(5, v))
    setMatrix(next)
  }

  const sim = metric === 'cosine' ? cosine : pearson

  const neighbours = useMemo(() => {
    if (mode === 'user') {
      // similarity of target user to every other user, over items != tCol
      const cols = ITEMS.map((_, c) => c).filter((c) => c !== tCol)
      const target = cols.map((c) => matrix[tRow][c])
      return USERS.map((name, u) => ({
        name,
        idx: u,
        score: u === tRow ? Number.NaN : sim(target, cols.map((c) => matrix[u][c])),
        rating: matrix[u][tCol],
      })).filter((n) => n.idx !== tRow)
    }
    // item-based: similarity of target item to other items, over users != tRow
    const rows = USERS.map((_, r) => r).filter((r) => r !== tRow)
    const target = rows.map((r) => matrix[r][tCol])
    return ITEMS.map((name, it) => ({
      name,
      idx: it,
      score: it === tCol ? Number.NaN : sim(target, rows.map((r) => matrix[r][it])),
      rating: matrix[tRow][it],
    })).filter((n) => n.idx !== tCol)
  }, [matrix, mode, metric, tRow, tCol, sim])

  const ranked = [...neighbours].sort((a, b) => b.score - a.score)
  const topK = ranked.slice(0, k)
  const wsum = topK.reduce((s, n) => s + Math.abs(n.score), 0)
  const pred = wsum === 0 ? 0 : topK.reduce((s, n) => s + n.score * n.rating, 0) / wsum
  const actual = matrix[tRow][tCol]
  const maxAbs = Math.max(0.001, ...ranked.map((n) => Math.abs(n.score)))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: 'user', label: 'User-based' },
            { value: 'item', label: 'Item-based' },
          ]}
        />
        <Segmented
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'cosine', label: 'Cosine' },
            { value: 'pearson', label: 'Pearson' },
          ]}
        />
      </div>

      <VizPanel title="Rating matrix — pick the cell to predict (highlighted)">
        <div className="overflow-x-auto">
          <table className="border-collapse text-sm">
            <thead>
              <tr>
                <th className="p-1" />
                {ITEMS.map((it, c) => (
                  <th
                    key={c}
                    className={cn(
                      'px-2 py-1 text-xs font-bold',
                      c === tCol ? 'text-[var(--lagoon-deep)]' : 'text-[var(--sea-ink-soft)]',
                    )}
                  >
                    {it}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {USERS.map((u, r) => (
                <tr key={r}>
                  <td
                    className={cn(
                      'pr-2 text-xs font-bold',
                      r === tRow ? 'text-[var(--lagoon-deep)]' : 'text-[var(--sea-ink-soft)]',
                    )}
                  >
                    {u}
                  </td>
                  {ITEMS.map((_, c) => {
                    const isTarget = r === tRow && c === tCol
                    return (
                      <td key={c} className="p-0.5">
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={matrix[r][c]}
                          onChange={(e) => setCell(r, c, parseInt(e.target.value, 10) || 1)}
                          onFocus={() => {
                            setTRow(r)
                            setTCol(c)
                          }}
                          className={cn(
                            'h-9 w-12 rounded-md border text-center text-sm font-semibold tabular-nums focus:outline-none',
                            isTarget
                              ? 'border-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.2)] text-[var(--lagoon-deep)] ring-2 ring-[var(--lagoon-deep)]'
                              : 'border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink)]',
                          )}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-[var(--sea-ink-soft)]">
          Predicting <strong className="text-[var(--lagoon-deep)]">{USERS[tRow]}</strong> &rsquo;s
          rating for <strong className="text-[var(--lagoon-deep)]">{ITEMS[tCol]}</strong>. Click any
          cell to retarget; edit values to experiment.
        </p>
      </VizPanel>

      <Slider label="k — neighbourhood size" value={k} onChange={setK} min={1} max={4} />

      <VizPanel
        title={`Similarity of every ${mode === 'user' ? 'other user' : 'other item'} — top ${k} used`}
      >
        <div className="space-y-2.5">
          {ranked.map((n) => {
            const inTop = topK.some((t) => t.idx === n.idx)
            return (
              <Bar
                key={n.idx}
                value={Math.abs(n.score)}
                max={maxAbs}
                tone={inTop ? 'lagoon' : 'muted'}
                label={
                  <span>
                    {n.name}{' '}
                    {inTop ? (
                      <span className="ml-1 rounded bg-[var(--accent-fill)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent-on)]">
                        neighbour
                      </span>
                    ) : null}
                  </span>
                }
                caption={`sim ${fmt(n.score, 2)} · rating ${n.rating}`}
              />
            )
          })}
        </div>
      </VizPanel>

      <ResultRow
        label="Weighted prediction  Σ(sim·r) ÷ Σ|sim|"
        value={fmt(pred, 2)}
        strong
        hint={`actual = ${actual}`}
      />

      <Hint>
        {mode === 'user' ? (
          <>
            User-based CF finds the <strong>k users most similar to {USERS[tRow]}</strong> and
            predicts from their ratings of {ITEMS[tCol]}. Try item-based: it instead asks which
            items {USERS[tRow]} already rated are most like {ITEMS[tCol]}.
          </>
        ) : (
          <>
            Item-based CF finds the <strong>k items most similar to {ITEMS[tCol]}</strong> and
            predicts from {USERS[tRow]}&rsquo;s own ratings of them — which is why item-based CF is
            harder to attack: it leans on the genuine user&rsquo;s ratings.
          </>
        )}
      </Hint>
    </div>
  )
}
