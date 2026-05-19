import { useState } from 'react'
import { dot, norm, cosine, pearson, mean, fmt } from '#/lib/math'
import { VizPanel, NumInput, Segmented, ResultRow, Bar, Hint } from './kit'

const DIM = 4

export function CosineViz() {
  const [a, setA] = useState<number[]>([5, 3, 0, 1])
  const [b, setB] = useState<number[]>([4, 0, 2, 1])
  const [metric, setMetric] = useState<'cosine' | 'pearson'>('cosine')

  const setCell = (vec: 'a' | 'b', i: number, v: number) => {
    const next = [...(vec === 'a' ? a : b)]
    next[i] = v
    ;(vec === 'a' ? setA : setB)(next)
  }

  const centred = metric === 'pearson'
  const ac = centred ? a.map((x) => x - mean(a)) : a
  const bc = centred ? b.map((x) => x - mean(b)) : b
  const products = ac.map((x, i) => x * bc[i])
  const sim = metric === 'cosine' ? cosine(a, b) : pearson(a, b)
  const maxProd = Math.max(1, ...products.map((p) => Math.abs(p)))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'cosine', label: 'Cosine similarity' },
            { value: 'pearson', label: 'Pearson correlation' },
          ]}
        />
        <span className="text-sm text-[var(--sea-ink-soft)]">
          Edit the two vectors and watch the similarity update.
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <VizPanel title="Vector A">
          <div className="grid grid-cols-4 gap-2">
            {a.map((v, i) => (
              <NumInput key={i} value={v} onChange={(x) => setCell('a', i, x)} step={1} />
            ))}
          </div>
        </VizPanel>
        <VizPanel title="Vector B">
          <div className="grid grid-cols-4 gap-2">
            {b.map((v, i) => (
              <NumInput key={i} value={v} onChange={(x) => setCell('b', i, x)} step={1} />
            ))}
          </div>
        </VizPanel>
      </div>

      <VizPanel title={centred ? 'Mean-centred element products' : 'Element-wise products'}>
        <div className="space-y-2">
          {products.map((p, i) => (
            <Bar
              key={i}
              value={Math.abs(p)}
              max={maxProd}
              tone={p < 0 ? 'rose' : 'lagoon'}
              label={
                <span className="tabular-nums">
                  {fmt(ac[i], 2)} × {fmt(bc[i], 2)}
                </span>
              }
              caption={`= ${fmt(p, 2)}`}
            />
          ))}
        </div>
      </VizPanel>

      <div className="grid gap-2 sm:grid-cols-2">
        <ResultRow label="Dot product  a · b" value={fmt(dot(ac, bc), 3)} />
        <ResultRow
          label={centred ? '‖a − ā‖ · ‖b − b̄‖' : '‖a‖ · ‖b‖'}
          value={fmt(norm(ac) * norm(bc), 3)}
        />
      </div>

      <ResultRow
        strong
        label={metric === 'cosine' ? 'Cosine similarity' : 'Pearson correlation'}
        value={fmt(sim, 3)}
        hint={
          metric === 'cosine'
            ? 'dot ÷ (‖a‖·‖b‖)'
            : 'dot of centred ÷ (‖ā‖·‖b̄‖)'
        }
      />

      <VizPanel title={`Similarity meter  (${metric === 'cosine' ? '0 … 1' : '−1 … 1'})`}>
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-[rgba(23,58,64,0.08)]">
          <div
            className="absolute top-0 h-full w-1 -translate-x-1/2 rounded bg-[var(--sea-ink)]"
            style={{
              left: `${
                metric === 'cosine'
                  ? Math.max(0, Math.min(1, sim)) * 100
                  : ((sim + 1) / 2) * 100
              }%`,
            }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-[var(--sea-ink-soft)]">
          <span>{metric === 'cosine' ? '0 — orthogonal' : '−1 — opposite'}</span>
          <span>1 — identical direction</span>
        </div>
      </VizPanel>

      <Hint>
        {metric === 'cosine' ? (
          <>
            Cosine ignores vector <strong>length</strong> — only direction matters. Two users with
            ratings [5,5,5] and [1,1,1] are cosine-identical (sim = 1). Use Pearson when you must
            correct for a user&rsquo;s generous or harsh rating scale.
          </>
        ) : (
          <>
            Pearson is the cosine of the <strong>mean-centred</strong> vectors. By subtracting each
            vector&rsquo;s mean it removes a user&rsquo;s baseline bias — a harsh rater and a
            generous rater with the same <em>pattern</em> become highly correlated.
          </>
        )}
      </Hint>
    </div>
  )
}
