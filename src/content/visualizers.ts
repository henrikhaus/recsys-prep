import type { ComponentType } from 'react'
import { CosineViz } from '#/components/viz/CosineViz'
import { KnnViz } from '#/components/viz/KnnViz'
import { MfViz } from '#/components/viz/MfViz'
import { TfIdfViz } from '#/components/viz/TfIdfViz'
import { MetricsViz } from '#/components/viz/MetricsViz'
import { BanditViz } from '#/components/viz/BanditViz'
import { AbTestViz } from '#/components/viz/AbTestViz'
import { ContextViz } from '#/components/viz/ContextViz'

export interface VizMeta {
  id: string
  title: string
  blurb: string
  topicId: string
  group: string
  Component: ComponentType
}

export const VISUALIZERS: VizMeta[] = [
  {
    id: 'cosine',
    title: 'Cosine & Pearson similarity',
    blurb:
      'Edit two vectors and watch the dot product, norms and similarity update — see why cosine ignores magnitude.',
    topicId: 'collaborative',
    group: 'Similarity & CF',
    Component: CosineViz,
  },
  {
    id: 'knn',
    title: 'kNN neighbourhood explorer',
    blurb:
      'A live rating matrix: pick a cell, choose user- vs item-based, and follow the weighted neighbourhood prediction.',
    topicId: 'collaborative',
    group: 'Similarity & CF',
    Component: KnnViz,
  },
  {
    id: 'mf',
    title: 'Matrix factorization scorer',
    blurb:
      'Latent user & item factors. Tune the vectors and watch the dot-product scores re-rank the recommendations.',
    topicId: 'collaborative',
    group: 'Similarity & CF',
    Component: MfViz,
  },
  {
    id: 'tfidf',
    title: 'TF-IDF calculator',
    blurb:
      'Type real documents, pick a term, and see TF, document frequency, IDF and the final TF-IDF weight.',
    topicId: 'content-based',
    group: 'Content & context',
    Component: TfIdfViz,
  },
  {
    id: 'metrics',
    title: 'Evaluation metrics lab',
    blurb:
      'Ranking metrics, RMSE/MAE and Kendall’s τ — all interactive, with the calculations laid bare.',
    topicId: 'evaluation',
    group: 'Evaluation',
    Component: MetricsViz,
  },
  {
    id: 'bandit',
    title: 'Multi-armed bandit simulator',
    blurb:
      'Race ε-greedy, UCB and Thompson sampling against hidden win-rates and watch cumulative regret.',
    topicId: 'exploration',
    group: 'Evaluation',
    Component: BanditViz,
  },
  {
    id: 'abtest',
    title: 'A/B & A/A test simulator',
    blurb:
      'Simulate an online experiment: see how sample size drives statistical significance — and false positives.',
    topicId: 'exploration',
    group: 'Evaluation',
    Component: AbTestViz,
  },
  {
    id: 'context',
    title: 'Context sparsity explorer',
    blurb:
      'Add context dimensions and watch the data-per-context collapse — then coarsen hierarchies to fix it.',
    topicId: 'context',
    group: 'Content & context',
    Component: ContextViz,
  },
]

export const getViz = (id: string): VizMeta | undefined =>
  VISUALIZERS.find((v) => v.id === id)
