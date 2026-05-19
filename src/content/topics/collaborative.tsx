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
  Steps,
  MiniCheck,
  DataTable,
} from '#/components/teach'

export const meta: TopicMeta = {
  id: 'collaborative',
  num: 3,
  lecture: 'Lecture 03',
  title: 'Collaborative Filtering',
  blurb:
    'The wisdom of the crowd: neighbourhood methods, similarity functions, and matrix factorization.',
  minutes: 20,
  tags: ['rating matrix', 'kNN', 'cosine', 'Pearson', 'matrix factorization', 'latent factors'],
  visualizers: ['knn', 'cosine', 'mf'],
  examWeight: 'core',
}

export function Content() {
  return (
    <div className="space-y-7">
      <Lead>
        Collaborative filtering (CF) ignores item content entirely. It recommends to you what
        people <TX>similar to you</TX> liked. It is the single most exam-heavy topic — expect both
        a &ldquo;describe the process&rdquo; question and a similarity / matrix-factorization
        calculation.
      </Lead>

      <section className="space-y-3">
        <H2 id="idea">Core idea &amp; the rating matrix</H2>
        <P>
          All preferences live in one structure: the <TX>rating matrix</TX> Y with M users (rows) ×
          N items (columns). Cell Y[u, i] is the rating user u gave item i, or empty if unobserved.
        </P>
        <P>
          The matrix is <TX>extremely sparse</TX> — most cells are empty. CF&rsquo;s job is to fill
          in the blanks. Crucially, CF needs <em>only</em> this matrix; it works in any domain as
          long as a rating matrix exists.
        </P>
        <Callout kind="key">
          CF can be understood as a <TX>matrix completion</TX> or <TX>graph completion / link
          prediction</TX> problem: users and items are two sets of nodes, observed ratings are
          edges, and we predict the most likely missing edges.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="memory-vs-model">Memory-based vs. model-based</H2>
        <Compare
          a={{
            title: 'Memory-based (neighbourhood)',
            points: [
              'Uses the rating matrix directly at prediction time.',
              'Finds similar users or items (kNN).',
              'Easy to explain ("users who bought A also bought B").',
              'Can be slow / memory-heavy at scale.',
            ],
          }}
          b={{
            title: 'Model-based',
            points: [
              'Learns a compact model offline (e.g. matrix factorization).',
              'Latent factors capture taste.',
              'Fast predictions, handles sparsity better.',
              'Harder to explain a single recommendation.',
            ],
          }}
        />
      </section>

      <section className="space-y-3">
        <H2 id="user-based">User-based neighbourhood CF</H2>
        <P>The nearest-neighbour process, step by step:</P>
        <Steps
          items={[
            <>The request arrives with a target user u.</>,
            <>
              Compute the <TX>similarity</TX> between u and every other user, using their rating
              vectors (cosine or Pearson).
            </>,
            <>
              Select the <TX>k most similar users</TX> — the peer group / neighbourhood.
            </>,
            <>
              For each item u has not rated, predict the rating as a{' '}
              <TX>similarity-weighted average</TX> of the neighbours&rsquo; ratings for that item.
            </>,
            <>Sort unrated items by predicted score; return the top-N.</>,
          ]}
        />
        <Formula caption="Prediction = weighted average of neighbour ratings (often mean-centred)">
          r̂(u, i) = r̄<sub>u</sub> + ( Σ<sub>v∈N</sub> sim(u,v)·(r<sub>v,i</sub> − r̄<sub>v</sub>) ) / Σ<sub>v∈N</sub> |sim(u,v)|
        </Formula>
      </section>

      <section className="space-y-3">
        <H2 id="item-based">Item-based neighbourhood CF</H2>
        <P>
          Same idea, transposed. Build an item–item similarity matrix; to predict r̂(u, i), look at
          the items <em>u has already rated</em> that are most similar to i, and take a
          similarity-weighted average of u&rsquo;s own ratings.
        </P>
        <Compare
          a={{
            title: 'Choose user-based when…',
            points: [
              'Items change far faster than users (news).',
              'You want "users like you enjoyed…".',
            ],
          }}
          b={{
            title: 'Choose item-based when…',
            points: [
              'Items are stable; users come and go (e-commerce).',
              'Item–item similarities can be precomputed → fast, scalable.',
              'Harder to attack — it uses the genuine target user’s own ratings.',
            ],
          }}
        />
        <Callout kind="exam">
          &ldquo;Users who bought A also bought B&rdquo; is the textbook description of{' '}
          <TX>item-based</TX> CF and why it is explainable.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="similarity">Similarity functions</H2>
        <DataTable
          head={['Function', 'Formula sketch', 'Use it when']}
          rows={[
            ['Cosine', 'a·b / (‖a‖‖b‖)', 'Vectors of ratings/features; ignores magnitude.'],
            ['Pearson', 'cosine of mean-centred vectors', 'Corrects for users with harsh / generous scales.'],
            ['Jaccard', '|A∩B| / |A∪B|', 'Binary / implicit data (sets of interactions).'],
            ['Euclidean', '√Σ(aᵢ−bᵢ)²', 'A distance — smaller = more similar.'],
          ]}
        />
        <Callout kind="example" title="Cosine similarity — the 2024 binary matrix">
          <P>
            Estimate whether David likes cucumber. Compare users on the three columns David <em>has</em>{' '}
            rated. David = [0, 1, 0].
          </P>
          <P>cos(David, Alice=[0,1,0]) = 1 / (1·1) = <TX>1.00</TX></P>
          <P>cos(David, Bob=[1,0,0]) = 0 / (1·1) = <TX>0.00</TX></P>
          <P>cos(David, Charlie=[1,1,1]) = 1 / (1·√3) ≈ <TX>0.58</TX></P>
          <P>
            Highest-scoring neighbour is <TX>Alice</TX>. Alice rated cucumber positively → predict
            David also likes cucumber.
          </P>
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="mf">Matrix factorization</H2>
        <P>
          The leading model-based method. Decompose the M×N rating matrix into two thin matrices:
          a user-factor matrix (M × f) and an item-factor matrix (N × f). Each user and item
          becomes a vector of <TX>f latent factors</TX> — learned dimensions of taste.
        </P>
        <Formula caption="Predicted rating = dot product of the user and item factor vectors">
          r̂(u, i) = p<sub>u</sub> · q<sub>i</sub>
        </Formula>
        <Callout kind="example" title="MF scoring — the 2025 exam">
          User 1 = [0.90, 0.30, 0.20]. Score each item by the dot product, e.g. Item 1 =
          0.90·0.90 + 0.30·0.30 + 0.20·0.25 = <TX>0.950</TX>. Rank all items by score; the top
          three were Item 1 (0.950), Item 2 (0.855), Item 3 (0.770).
        </Callout>
        <H3>Why factorization helps</H3>
        <Bullets
          items={[
            <>Compresses a huge sparse matrix into small dense factor matrices.</>,
            <>Latent factors generalise — they handle sparsity better than raw neighbours.</>,
            <>Fast predictions: one dot product per (user, item) pair.</>,
          ]}
        />
      </section>

      <section className="space-y-3">
        <H2 id="limits">Shortcomings — when CF cannot be applied</H2>
        <Bullets
          items={[
            <>
              <TX>Cold start</TX> — a new user/item has no ratings, so no neighbours and no
              learned factors. Both kNN and MF struggle with new items.
            </>,
            <>
              <TX>Sparsity</TX> — too few co-ratings makes similarities unreliable.
            </>,
            <>
              <TX>Gray sheep</TX> — users with idiosyncratic taste have no good neighbourhood.
            </>,
            <>
              <TX>Popularity bias</TX> — popular items dominate neighbourhoods and recommendations.
            </>,
            <>
              <TX>No rating matrix</TX> — a brand-new platform with no interaction data cannot do
              CF at all. Fall back to content-based or popularity recommenders.
            </>,
          ]}
        />
        <Callout kind="pitfall">
          A common false MCQ statement: &ldquo;Matrix factorization allows faster recommendations
          than nearest-neighbour&rdquo; — actually <em>true</em> in many settings. The genuinely
          false claim in past exams was that <em>splitting the test set by holding out whole users
          and items works</em> — it does not, because the model never learns factors for them.
        </Callout>
      </section>

      <MiniCheck q="You want to evaluate an MF recommender. You hold out a set of whole users and whole items into the test set. Why does this fail?">
        Matrix factorization only learns a latent vector for users and items{' '}
        <TX>seen during training</TX>. If a user or item appears only in the test set, the model
        never learned its factor vector, so r̂ = p·q is undefined. Hold out individual{' '}
        <em>ratings</em> instead, keeping every user and item present in training.
      </MiniCheck>
    </div>
  )
}
