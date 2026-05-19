import { useMemo, useState } from 'react'
import { fmt } from '#/lib/math'
import { VizPanel, Segmented, Bar, Hint } from './kit'

const DEFAULT_DOCS = [
  'the cloud computing platform scales the whole system',
  'machine learning models predict the user rating',
  'the office printer needs the cloud backup service',
  'users rate items and the recommender ranks the items',
]

const tokenize = (s: string): string[] =>
  s.toLowerCase().match(/[a-z]+/g) ?? []

export function TfIdfViz() {
  const [docs, setDocs] = useState<string[]>(DEFAULT_DOCS)
  const [term, setTerm] = useState('cloud')
  const [base, setBase] = useState<'2' | '10' | 'e'>('10')
  const [tfMode, setTfMode] = useState<'raw' | 'rel'>('raw')

  const logFn = (x: number) =>
    base === '2' ? Math.log2(x) : base === '10' ? Math.log10(x) : Math.log(x)

  const data = useMemo(() => {
    const t = term.trim().toLowerCase()
    const tokenLists = docs.map(tokenize)
    const N = docs.length
    const df = tokenLists.filter((toks) => toks.includes(t)).length
    const idf = df === 0 ? 0 : logFn(N / df)
    const rows = tokenLists.map((toks) => {
      const count = toks.filter((w) => w === t).length
      const tf = tfMode === 'raw' ? count : toks.length ? count / toks.length : 0
      return { count, len: toks.length, tf, tfidf: tf * idf }
    })
    return { N, df, idf, rows }
  }, [docs, term, base, tfMode])

  const maxTfidf = Math.max(0.001, ...data.rows.map((r) => Math.abs(r.tfidf)))

  return (
    <div className="space-y-4">
      <VizPanel title="Documents — edit freely">
        <div className="grid gap-2 sm:grid-cols-2">
          {docs.map((d, i) => (
            <textarea
              key={i}
              value={d}
              rows={2}
              onChange={(e) => {
                const n = [...docs]
                n[i] = e.target.value
                setDocs(n)
              }}
              className="w-full resize-none rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-2.5 py-2 text-sm text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none"
            />
          ))}
        </div>
      </VizPanel>

      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <div className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">Term</div>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-40 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:outline-none"
          />
        </label>
        <div>
          <div className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">log base</div>
          <Segmented
            value={base}
            onChange={setBase}
            options={[
              { value: '2', label: 'log₂' },
              { value: '10', label: 'log₁₀' },
              { value: 'e', label: 'ln' },
            ]}
          />
        </div>
        <div>
          <div className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">TF</div>
          <Segmented
            value={tfMode}
            onChange={setTfMode}
            options={[
              { value: 'raw', label: 'raw count' },
              { value: 'rel', label: 'relative' },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg bg-[rgba(23,58,64,0.04)] px-3 py-2 text-sm">
          <span className="text-[var(--sea-ink-soft)]">N (documents)</span>{' '}
          <strong className="float-right tabular-nums text-[var(--sea-ink)]">{data.N}</strong>
        </div>
        <div className="rounded-lg bg-[rgba(23,58,64,0.04)] px-3 py-2 text-sm">
          <span className="text-[var(--sea-ink-soft)]">df (docs with term)</span>{' '}
          <strong className="float-right tabular-nums text-[var(--sea-ink)]">{data.df}</strong>
        </div>
        <div className="rounded-lg bg-[rgba(79,184,178,0.16)] px-3 py-2 text-sm">
          <span className="text-[var(--sea-ink-soft)]">
            IDF = log({data.N}/{data.df || '0'})
          </span>{' '}
          <strong className="float-right tabular-nums text-[var(--lagoon-deep)]">
            {fmt(data.idf, 3)}
          </strong>
        </div>
      </div>

      <VizPanel title={`TF-IDF of "${term.trim() || '—'}" per document`}>
        <div className="space-y-3">
          {data.rows.map((r, i) => (
            <Bar
              key={i}
              value={Math.abs(r.tfidf)}
              max={maxTfidf}
              tone="lagoon"
              label={`Document ${i + 1}`}
              caption={
                <span>
                  tf {fmt(r.tf, 3)} × idf {fmt(data.idf, 3)} ={' '}
                  <strong>{fmt(r.tfidf, 3)}</strong>
                </span>
              }
            />
          ))}
        </div>
      </VizPanel>

      <Hint>
        A term in <strong>every</strong> document has idf ≈ 0 — it cannot discriminate (try
        &ldquo;the&rdquo;). A <strong>rare</strong> term gets a high idf, so where it does appear it
        dominates the TF-IDF weight. The course accepts any log base if you state it.
      </Hint>
    </div>
  )
}
