import type { TopicMeta } from '#/content/types'
import {
  Lead,
  H2,
  H3,
  P,
  TX,
  Callout,
  Bullets,
  Compare,
  Formula,
  MiniCheck,
  DataTable,
} from '#/components/teach'

export const meta: TopicMeta = {
  id: 'evaluation',
  num: 4,
  lecture: 'Lecture 04',
  title: 'Evaluating Recommender Systems',
  blurb:
    'Offline, online and user studies; data splitting; rating vs. ranking metrics; and beyond-accuracy goals.',
  minutes: 22,
  tags: ['offline', 'A/B', 'RMSE', 'MAE', 'NDCG', 'precision', 'beyond accuracy'],
  visualizers: ['metrics', 'abtest'],
  examWeight: 'core',
}

export function Content() {
  return (
    <div className="space-y-7">
      <Lead>
        Evaluation is reliably worth 16–20 points. You must (1) name the three strategies with
        pros/cons, (2) know how to split data, (3) distinguish rating vs. ranking metrics, and (4)
        list beyond-accuracy goals.
      </Lead>

      <section className="space-y-3">
        <H2 id="strategies">Three evaluation strategies</H2>
        <DataTable
          head={['Strategy', 'How it works', 'Pros', 'Cons']}
          rows={[
            [
              'Offline',
              'Replay recorded interactions, measure metrics on held-out data.',
              'Cheap, fast, repeatable, no users at risk.',
              'Only measures the past; no real user reaction; missing-not-at-random bias.',
            ],
            [
              'Online experiment (A/B test)',
              'Split live traffic between system A and B, compare real KPIs.',
              'Measures true user behaviour and business metrics.',
              'Slow, costly, exposes real users to a possibly worse system.',
            ],
            [
              'User study',
              'Recruit participants, observe / interview them using the system.',
              'Rich qualitative insight; can ask why.',
              'Small sample, expensive, lab setting ≠ real life, observer bias.',
            ],
          ]}
        />
        <Callout kind="exam">
          A good workflow answer: prototype and shortlist models <TX>offline</TX>, then confirm the
          winner with an <TX>online A/B test</TX>, and use a <TX>user study</TX> when you need to
          understand <em>why</em> something works.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="splitting">Splitting the data for offline evaluation</H2>
        <DataTable
          head={['Method', 'Idea', 'Trade-off']}
          rows={[
            [
              'Random / holdout split',
              'Randomly assign ratings to train / validation / test by proportion.',
              'Simple; but ignores time — can leak the future into training.',
            ],
            [
              'Cross-validation',
              'Partition into k folds; each fold is the test set once, rest train.',
              'Uses all data, gives a variance estimate; k× the compute.',
            ],
            [
              'Sliding window',
              'Order data by time; train on a window, test on the next slice, shift forward.',
              'Respects chronology — the realistic choice for time-stamped data.',
            ],
          ]}
        />
        <Callout kind="pitfall" title="Never train on the future">
          With time-stamped interactions a random split puts future events in the training set —
          the model &ldquo;cheats&rdquo;. Use a <TX>temporal / sliding-window</TX> split so the test
          set is always strictly later than training.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="rating-vs-ranking">Rating prediction vs. ranking metrics</H2>
        <Compare
          a={{
            title: 'Rating prediction',
            points: [
              'Predict the numeric score; fill the matrix.',
              'Order of items is irrelevant.',
              'Metrics: RMSE, MAE.',
              'Fits explicit numeric feedback.',
            ],
          }}
          b={{
            title: 'Ranking / top-N',
            points: [
              'Produce an ordered list; only the order matters.',
              'A relevant item at rank 1 ≫ at rank 20.',
              'Metrics: precision@k, recall@k, NDCG, MRR/ARHR, Kendall, Spearman.',
              'Fits implicit feedback and what users actually see.',
            ],
          }}
        />
        <Callout kind="note">
          With numeric preferences both can be measured, but ranking metrics (e.g. MRR) better
          reflect <em>what the user experiences</em> — a low MAE only means scores are close, not
          that relevant items reached the top.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="error-metrics">Rating-prediction metrics</H2>
        <Formula caption="Mean absolute error — average size of the error">
          MAE = ( Σ |e<sub>uj</sub>| ) / |E|
        </Formula>
        <Formula caption="Root mean squared error — squares before averaging">
          RMSE = √( ( Σ e<sub>uj</sub>² ) / |E| )
        </Formula>
        <P>
          <TX>RMSE ≥ MAE always.</TX> RMSE squares the errors, so it{' '}
          <TX>disproportionately penalises large mistakes</TX>. MAE treats every error linearly.
        </P>
        <Callout kind="example" title="The 2023 exam numbers">
          Over 11 prediction errors, MAE = 12.7 / 11 ≈ <TX>1.155</TX> and RMSE ≈ <TX>1.222</TX>.
          RMSE &gt; MAE because a few larger errors are amplified by the square.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="ranking-metrics">Ranking metrics</H2>
        <Bullets
          items={[
            <>
              <TX>Precision@k</TX> — fraction of the top-k that is relevant.
            </>,
            <>
              <TX>Recall@k</TX> — fraction of all relevant items that made the top-k.
            </>,
            <>
              <TX>NDCG</TX> — discounted cumulative gain, normalised by the ideal ranking; rewards
              relevant items near the top with a logarithmic discount.
            </>,
            <>
              <TX>MRR</TX> — mean of 1/rank of the first relevant hit.
            </>,
            <>
              <TX>ARHR</TX> (average reciprocal hit rate) — sum of 1/rank over <em>every</em> hit.
            </>,
            <>
              <TX>Kendall&rsquo;s τ / Spearman</TX> — rank-correlation between the recommended order
              and the ground-truth order.
            </>,
          ]}
        />
        <Formula caption="Kendall's τ — concordant minus discordant pairs">
          τ = ( #concordant − #discordant ) / ( n(n−1) / 2 )
        </Formula>
        <Callout kind="example" title="ARHR — the 2022 Reddit scenario">
          Ingrid engaged with items at ranks 4, 2 and 1. ARHR = 1/4 + 1/2 + 1/1 = <TX>1.75</TX>.
          The Kendall coefficient for the same scenario worked out to τ = 1/10 = <TX>0.1</TX>.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="beyond">Beyond-accuracy goals</H2>
        <P>
          Accuracy is not enough. Long-term success needs &ldquo;beyond-accuracy&rdquo; objectives:
        </P>
        <DataTable
          head={['Goal', 'Meaning']}
          rows={[
            ['Coverage', 'What fraction of the catalogue can ever be recommended.'],
            ['Novelty', 'Recommends items the user did not already know.'],
            ['Serendipity', 'Recommendations that are both surprising and relevant.'],
            ['Diversity', 'The items within one list are unlike each other.'],
            ['Fairness', 'No group of users or item providers is systematically disadvantaged.'],
            ['Scalability', 'Acceptable response time at production scale.'],
          ]}
        />
        <Callout kind="exam">
          For a question asking for &ldquo;five objectives to monitor continuously&rdquo;, pick
          measurable ones: click-through rate (engagement), dwell time (satisfaction), coverage,
          conversion rate (revenue), response time (scalability).
        </Callout>
      </section>

      <MiniCheck q="A model has MAE = 0.2 (scale 0–5) but MRR = 0.2. Is it a good recommender? Which metric matters more?">
        <P>
          The low MAE says predicted scores are numerically close to true ratings. But MRR = 0.2
          means the first relevant item appears, on average, around rank 5 — the user has to scroll
          past four irrelevant items.
        </P>
        <P>
          For the user experience, <TX>MRR matters more</TX>: recommendation is about putting
          relevant items at the <em>top</em>, not about precise score estimates. The system is
          accurate at rating prediction but poor at ranking.
        </P>
      </MiniCheck>
    </div>
  )
}
