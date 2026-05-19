// Shared math helpers used across visualizers, drills and worked examples.

export type Vec = number[]

export const round = (x: number, dp = 3): number => {
  const f = 10 ** dp
  return Math.round((x + Number.EPSILON) * f) / f
}

export const sum = (a: Vec): number => a.reduce((s, x) => s + x, 0)

export const mean = (a: Vec): number => (a.length ? sum(a) / a.length : 0)

export const dot = (a: Vec, b: Vec): number =>
  a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0)

export const norm = (a: Vec): number => Math.sqrt(dot(a, a))

export const cosine = (a: Vec, b: Vec): number => {
  const d = norm(a) * norm(b)
  return d === 0 ? 0 : dot(a, b) / d
}

export const euclidean = (a: Vec, b: Vec): number =>
  Math.sqrt(a.reduce((s, x, i) => s + (x - (b[i] ?? 0)) ** 2, 0))

// Pearson correlation over the indices where both vectors have a value.
export const pearson = (a: Vec, b: Vec): number => {
  const ma = mean(a)
  const mb = mean(b)
  let num = 0
  let da = 0
  let db = 0
  for (let i = 0; i < a.length; i++) {
    const xa = a[i] - ma
    const xb = (b[i] ?? 0) - mb
    num += xa * xb
    da += xa * xa
    db += xb * xb
  }
  const den = Math.sqrt(da * db)
  return den === 0 ? 0 : num / den
}

// --- rating-prediction error metrics --------------------------------------
export const mae = (errors: Vec): number =>
  errors.length ? mean(errors.map(Math.abs)) : 0

export const rmse = (errors: Vec): number =>
  errors.length ? Math.sqrt(mean(errors.map((e) => e * e))) : 0

// --- ranking metrics -------------------------------------------------------
// relevance: array aligned with the ranked list, 1 = relevant, 0 = not.
export const precisionAtK = (rel: number[], k: number): number => {
  const slice = rel.slice(0, k)
  return slice.length ? sum(slice) / slice.length : 0
}

export const recallAtK = (rel: number[], k: number, totalRelevant: number): number =>
  totalRelevant ? sum(rel.slice(0, k)) / totalRelevant : 0

export const dcg = (rel: number[]): number =>
  rel.reduce((s, r, i) => s + r / Math.log2(i + 2), 0)

export const ndcg = (rel: number[]): number => {
  const ideal = [...rel].sort((x, y) => y - x)
  const idcg = dcg(ideal)
  return idcg === 0 ? 0 : dcg(rel) / idcg
}

// Mean reciprocal rank for a single ranked list (1-indexed first hit).
export const reciprocalRank = (rel: number[]): number => {
  const i = rel.findIndex((r) => r > 0)
  return i === -1 ? 0 : 1 / (i + 1)
}

// Average reciprocal hit rate: sum of 1/position over every hit.
export const arhr = (rel: number[]): number =>
  rel.reduce((s, r, i) => s + (r > 0 ? 1 / (i + 1) : 0), 0)

// Kendall rank correlation between a predicted order and a ground-truth order.
// Inputs are the ground-truth rank of each item, listed in predicted order.
export const kendallTau = (groundTruthRanks: number[]): number => {
  const n = groundTruthRanks.length
  if (n < 2) return 0
  let concordant = 0
  let discordant = 0
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = groundTruthRanks[j] - groundTruthRanks[i]
      if (d > 0) concordant++
      else if (d < 0) discordant++
    }
  }
  return (concordant - discordant) / ((n * (n - 1)) / 2)
}

// --- TF-IDF ----------------------------------------------------------------
// idf with the textbook base-2 log: log2(N / n_t)
export const idf = (totalDocs: number, docsWithTerm: number): number =>
  docsWithTerm === 0 ? 0 : Math.log2(totalDocs / docsWithTerm)

export const tfidf = (tf: number, totalDocs: number, docsWithTerm: number): number =>
  tf * idf(totalDocs, docsWithTerm)

export const fmt = (x: number, dp = 3): string => {
  if (!Number.isFinite(x)) return '—'
  return round(x, dp).toFixed(dp)
}
