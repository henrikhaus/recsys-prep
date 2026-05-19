import {
  cosine,
  dot,
  rmse,
  mae,
  arhr,
  precisionAtK,
  kendallTau,
  round,
  fmt,
} from '#/lib/math'

export interface DrillInstance {
  kind: string
  title: string
  question: string
  given: { label: string; value: string }[]
  answer: number
  tolerance: number
  unit?: string
  solution: string[]
}

export interface DrillKind {
  id: string
  title: string
  blurb: string
  topicId: string
  gen: () => DrillInstance
}

const ri = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1))
const rf = (lo: number, hi: number, dp = 2) => round(lo + Math.random() * (hi - lo), dp)
const vec = (n: number, lo: number, hi: number) =>
  Array.from({ length: n }, () => ri(lo, hi))

// 1. TF-IDF -----------------------------------------------------------------
function genTfidf(): DrillInstance {
  const N = ri(60, 240)
  const df = ri(4, 40)
  const tf = ri(2, 12)
  const idf = Math.log10(N / df)
  const answer = round(tf * idf, 3)
  return {
    kind: 'tfidf',
    title: 'TF-IDF weight',
    question:
      'Compute the TF-IDF weight of the term in this article. Use raw-count TF and log base 10 for IDF.',
    given: [
      { label: 'Documents in collection (N)', value: String(N) },
      { label: 'Documents containing the term (df)', value: String(df) },
      { label: 'Term count in this article (TF)', value: String(tf) },
    ],
    answer,
    tolerance: 0.05,
    solution: [
      `IDF = log₁₀(N / df) = log₁₀(${N} / ${df}) = log₁₀(${fmt(N / df, 3)}) = ${fmt(idf, 3)}`,
      `TF-IDF = TF × IDF = ${tf} × ${fmt(idf, 3)} = ${fmt(answer, 3)}`,
    ],
  }
}

// 2. Cosine similarity ------------------------------------------------------
function genCosine(): DrillInstance {
  const a = vec(4, 0, 5)
  const b = vec(4, 0, 5)
  if (a.every((x) => x === 0)) a[0] = 3
  if (b.every((x) => x === 0)) b[0] = 4
  const answer = round(cosine(a, b), 3)
  const d = dot(a, b)
  const na = Math.sqrt(dot(a, a))
  const nb = Math.sqrt(dot(b, b))
  return {
    kind: 'cosine',
    title: 'Cosine similarity',
    question: 'Compute the cosine similarity between vectors a and b.',
    given: [
      { label: 'Vector a', value: `[${a.join(', ')}]` },
      { label: 'Vector b', value: `[${b.join(', ')}]` },
    ],
    answer,
    tolerance: 0.02,
    solution: [
      `Dot product a·b = ${a.map((x, i) => `${x}×${b[i]}`).join(' + ')} = ${d}`,
      `‖a‖ = √(${a.map((x) => x * x).join('+')}) = ${fmt(na, 3)}`,
      `‖b‖ = √(${b.map((x) => x * x).join('+')}) = ${fmt(nb, 3)}`,
      `cosine = ${d} / (${fmt(na, 3)} × ${fmt(nb, 3)}) = ${fmt(answer, 3)}`,
    ],
  }
}

// 3. Matrix factorization dot product --------------------------------------
function genMf(): DrillInstance {
  const p = Array.from({ length: 3 }, () => rf(0.1, 0.95, 2))
  const q = Array.from({ length: 3 }, () => rf(0.1, 0.95, 2))
  const answer = round(dot(p, q), 3)
  return {
    kind: 'mf',
    title: 'Matrix factorization score',
    question:
      'Matrix factorization predicts a rating as the dot product of the user and item factor vectors. Compute it.',
    given: [
      { label: 'User factors pᵤ', value: `[${p.join(', ')}]` },
      { label: 'Item factors qᵢ', value: `[${q.join(', ')}]` },
    ],
    answer,
    tolerance: 0.01,
    solution: [
      `r̂ = pᵤ · qᵢ = ${p.map((x, i) => `${x}×${q[i]}`).join(' + ')}`,
      `r̂ = ${p.map((x, i) => fmt(x * q[i], 4)).join(' + ')} = ${fmt(answer, 3)}`,
    ],
  }
}

// 4. RMSE -------------------------------------------------------------------
function genRmse(): DrillInstance {
  const n = 5
  const pred = Array.from({ length: n }, () => rf(1, 5, 1))
  const act = Array.from({ length: n }, () => ri(1, 5))
  const errs = pred.map((p, i) => p - act[i])
  const answer = round(rmse(errs), 3)
  return {
    kind: 'rmse',
    title: 'Root mean squared error',
    question: 'Compute the RMSE of these 5 rating predictions.',
    given: pred.map((p, i) => ({
      label: `Prediction ${i + 1}`,
      value: `predicted ${p}, actual ${act[i]}`,
    })),
    answer,
    tolerance: 0.03,
    solution: [
      `Errors e = ${errs.map((e) => fmt(e, 1)).join(', ')}`,
      `Squared = ${errs.map((e) => fmt(e * e, 2)).join(', ')}`,
      `Mean of squares = ${fmt(errs.reduce((s, e) => s + e * e, 0) / n, 3)}`,
      `RMSE = √mean = ${fmt(answer, 3)}`,
    ],
  }
}

// 5. MAE --------------------------------------------------------------------
function genMae(): DrillInstance {
  const n = 5
  const pred = Array.from({ length: n }, () => rf(1, 5, 1))
  const act = Array.from({ length: n }, () => ri(1, 5))
  const errs = pred.map((p, i) => p - act[i])
  const answer = round(mae(errs), 3)
  return {
    kind: 'mae',
    title: 'Mean absolute error',
    question: 'Compute the MAE of these 5 rating predictions.',
    given: pred.map((p, i) => ({
      label: `Prediction ${i + 1}`,
      value: `predicted ${p}, actual ${act[i]}`,
    })),
    answer,
    tolerance: 0.03,
    solution: [
      `Absolute errors |e| = ${errs.map((e) => fmt(Math.abs(e), 1)).join(', ')}`,
      `Sum = ${fmt(errs.reduce((s, e) => s + Math.abs(e), 0), 2)}`,
      `MAE = sum / ${n} = ${fmt(answer, 3)}`,
    ],
  }
}

// 6. ARHR -------------------------------------------------------------------
function genArhr(): DrillInstance {
  const len = 6
  const rel = Array.from({ length: len }, () => (Math.random() < 0.4 ? 1 : 0))
  if (rel.every((x) => x === 0)) rel[ri(0, len - 1)] = 1
  const hits = rel.map((r, i) => (r ? i + 1 : 0)).filter(Boolean)
  const answer = round(arhr(rel), 3)
  return {
    kind: 'arhr',
    title: 'Average reciprocal hit rate',
    question:
      'A recommended list is shown. Relevant items sit at the ranks below. Compute the ARHR (sum of 1/rank over every hit).',
    given: [
      { label: 'List length', value: String(len) },
      { label: 'Relevant items at ranks', value: hits.join(', ') },
    ],
    answer,
    tolerance: 0.01,
    solution: [
      `ARHR = ${hits.map((h) => `1/${h}`).join(' + ')}`,
      `ARHR = ${hits.map((h) => fmt(1 / h, 4)).join(' + ')} = ${fmt(answer, 3)}`,
    ],
  }
}

// 7. Precision@k ------------------------------------------------------------
function genPrecision(): DrillInstance {
  const len = 8
  const rel = Array.from({ length: len }, () => (Math.random() < 0.45 ? 1 : 0))
  const k = ri(3, 6)
  const answer = round(precisionAtK(rel, k), 3)
  const hitsInK = rel.slice(0, k).reduce((s, x) => s + x, 0)
  return {
    kind: 'precision',
    title: 'Precision@k',
    question: `Compute Precision@${k} for this recommended list (1 = relevant, 0 = not).`,
    given: [
      { label: 'Recommended list', value: `[${rel.join(', ')}]` },
      { label: 'Cutoff k', value: String(k) },
    ],
    answer,
    tolerance: 0.01,
    solution: [
      `Top-${k} = [${rel.slice(0, k).join(', ')}]`,
      `Relevant in top-${k} = ${hitsInK}`,
      `Precision@${k} = ${hitsInK} / ${k} = ${fmt(answer, 3)}`,
    ],
  }
}

// 8. Kendall's tau ----------------------------------------------------------
function genKendall(): DrillInstance {
  const n = 5
  const order = [1, 2, 3, 4, 5]
  for (let i = order.length - 1; i > 0; i--) {
    const j = ri(0, i)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  let c = 0
  let d = 0
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) (order[j] > order[i] ? c++ : d++)
  const answer = round(kendallTau(order), 3)
  return {
    kind: 'kendall',
    title: "Kendall's τ",
    question:
      "The predicted ranking is listed below as each item's true rank. Compute Kendall's τ.",
    given: [
      { label: 'Predicted order (true ranks)', value: `[${order.join(', ')}]` },
      { label: 'Pairs total', value: String((n * (n - 1)) / 2) },
    ],
    answer,
    tolerance: 0.01,
    solution: [
      `Concordant pairs (later item has larger true rank) = ${c}`,
      `Discordant pairs = ${d}`,
      `τ = (C − D) / (n(n−1)/2) = (${c} − ${d}) / ${(n * (n - 1)) / 2} = ${fmt(answer, 3)}`,
    ],
  }
}

export const DRILL_KINDS: DrillKind[] = [
  { id: 'tfidf', title: 'TF-IDF weight', blurb: 'IDF and TF-IDF from collection counts.', topicId: 'content-based', gen: genTfidf },
  { id: 'cosine', title: 'Cosine similarity', blurb: 'Dot product, norms, cosine of two vectors.', topicId: 'collaborative', gen: genCosine },
  { id: 'mf', title: 'Matrix factorization', blurb: 'Predicted rating as a factor dot product.', topicId: 'collaborative', gen: genMf },
  { id: 'rmse', title: 'RMSE', blurb: 'Root mean squared error of predictions.', topicId: 'evaluation', gen: genRmse },
  { id: 'mae', title: 'MAE', blurb: 'Mean absolute error of predictions.', topicId: 'evaluation', gen: genMae },
  { id: 'arhr', title: 'ARHR', blurb: 'Average reciprocal hit rate of a ranking.', topicId: 'evaluation', gen: genArhr },
  { id: 'precision', title: 'Precision@k', blurb: 'Precision at a cutoff k.', topicId: 'evaluation', gen: genPrecision },
  { id: 'kendall', title: "Kendall's τ", blurb: 'Rank correlation from concordant pairs.', topicId: 'evaluation', gen: genKendall },
]

export const getDrillKind = (id: string) => DRILL_KINDS.find((d) => d.id === id)

export const randomDrill = (): DrillInstance =>
  DRILL_KINDS[Math.floor(Math.random() * DRILL_KINDS.length)].gen()
