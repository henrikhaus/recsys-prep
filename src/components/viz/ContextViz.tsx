import { useState } from 'react'
import { VizPanel, Slider, ResultRow, Hint } from './kit'
import { Button } from '#/components/ui'
import { cn } from '#/lib/utils'

interface Dim {
  name: string
  card: number
  coarse: number
  on: boolean
}

const INITIAL: Dim[] = [
  { name: 'Time of day', card: 24, coarse: 4, on: true },
  { name: 'Location', card: 50, coarse: 5, on: true },
  { name: 'Weather', card: 8, coarse: 3, on: true },
]

const THRESHOLD = 20 // ratings per context considered "enough"

export function ContextViz() {
  const [dataset, setDataset] = useState(100000)
  const [dims, setDims] = useState<Dim[]>(INITIAL)

  const active = dims.filter((d) => d.on)
  const contexts = active.reduce((p, d) => p * d.card, 1)
  const perContext = contexts ? dataset / contexts : dataset
  const sparse = perContext < THRESHOLD

  return (
    <div className="space-y-4">
      <Slider
        label="Dataset — total ratings available"
        value={dataset}
        onChange={(v) => setDataset(Math.round(v))}
        min={1000}
        max={1000000}
        step={1000}
        display={dataset.toLocaleString()}
      />

      <VizPanel title="Context dimensions">
        <div className="space-y-3">
          {dims.map((d, i) => (
            <div
              key={i}
              className={cn(
                'rounded-lg border p-3',
                d.on ? 'border-[var(--line)] bg-white' : 'border-dashed border-[var(--line)] opacity-55',
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={d.on}
                  onChange={() => {
                    const n = [...dims]
                    n[i] = { ...n[i], on: !n[i].on }
                    setDims(n)
                  }}
                  className="h-4 w-4 accent-[var(--lagoon-deep)]"
                />
                <span className="text-sm font-bold text-[var(--sea-ink)]">{d.name}</span>
                <span className="ml-auto text-sm font-semibold text-[var(--lagoon-deep)] tabular-nums">
                  {d.card} values
                </span>
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => {
                    const n = [...dims]
                    n[i] = { ...n[i], card: d.coarse }
                    setDims(n)
                  }}
                  disabled={!d.on || d.card <= d.coarse}
                >
                  Coarsen ⤵ {d.coarse}
                </Button>
              </div>
              <Slider
                label="cardinality"
                value={d.card}
                onChange={(v) => {
                  const n = [...dims]
                  n[i] = { ...n[i], card: Math.round(v) }
                  setDims(n)
                }}
                min={1}
                max={200}
              />
            </div>
          ))}
        </div>
      </VizPanel>

      <div className="grid gap-2 sm:grid-cols-2">
        <ResultRow
          label="Distinct contexts"
          value={contexts.toLocaleString()}
          hint={active.map((d) => d.card).join(' × ') || '1'}
        />
        <ResultRow
          label="Avg. ratings per context"
          value={perContext < 1 ? perContext.toFixed(2) : Math.round(perContext).toLocaleString()}
          strong
        />
      </div>

      <div
        className="rounded-xl border px-4 py-3 text-sm font-semibold"
        style={{
          borderColor: sparse ? 'rgba(214,69,89,0.4)' : 'rgba(47,106,74,0.4)',
          background: sparse ? 'rgba(214,69,89,0.08)' : 'rgba(47,106,74,0.1)',
          color: 'var(--sea-ink)',
        }}
      >
        {sparse
          ? `⚠ Too sparse — only ~${perContext < 1 ? perContext.toFixed(2) : Math.round(perContext)} ratings per context. Pre-filtering would train each model on almost no data. Coarsen a dimension up its hierarchy.`
          : `✓ Healthy — ~${Math.round(perContext)} ratings per context. Each context slice has enough data to learn from.`}
      </div>

      <Hint>
        Every context dimension <strong>multiplies</strong> the number of buckets your fixed
        dataset is split across. Turn dimensions off, or use <strong>Coarsen</strong> to climb the
        hierarchy (24 hours → 4 day-parts) — that is exactly how hierarchies control sparsity in
        context-aware recommenders.
      </Hint>
    </div>
  )
}
