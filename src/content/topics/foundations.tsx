import type { TopicMeta } from '#/content/types'
import {
  Lead,
  H2,
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
  id: 'foundations',
  num: 1,
  lecture: 'Lecture 01',
  title: 'Foundations of Recommender Systems',
  blurb:
    'What a recommender system is, why we build them, the components they need, and how they differ from search.',
  minutes: 14,
  tags: ['definition', 'components', 'feedback', 'cold start', 'long tail'],
  visualizers: [],
  examWeight: 'core',
}

export function Content() {
  return (
    <div className="space-y-7">
      <Lead>
        A recommender system (RS) helps a user find relevant items inside a catalogue that is far
        too large to browse exhaustively. Almost every exam opens with a definition question — get
        this one airtight.
      </Lead>

      <section className="space-y-3">
        <H2 id="definition">What is a recommender system?</H2>
        <P>
          A <TX>personalized recommender system</TX> suggests a subset of a large collection of
          items to a given user such that <TX>different users get different recommendations</TX>.
          The output is tailored to an estimate of that user&rsquo;s preferences.
        </P>
        <P>
          A <TX>non-personalized</TX> recommender shows the same thing to everyone (e.g.{' '}
          &ldquo;most popular this week&rdquo;). It is still a recommender — it proactively pushes
          items — but it does not use a user model.
        </P>
        <Callout kind="exam" title="Memorise this phrasing">
          The 2025 exam asked literally: &ldquo;Define the term personalized recommender system.&rdquo;
          Model answer: <em>it suggests a subset of a large item collection to a given user so that
          different users receive different recommendations.</em>
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="purpose">Purpose — why build one?</H2>
        <Bullets
          items={[
            <>
              <TX>Information overload.</TX> Catalogues (songs, news, products) are too large for a
              user to evaluate manually.
            </>,
            <>
              <TX>Discovery.</TX> Surface relevant items the user would never have searched for.
            </>,
            <>
              <TX>Engagement &amp; revenue.</TX> Personalisation increases clicks, dwell time,
              conversion and retention for the provider.
            </>,
            <>
              <TX>The long tail.</TX> Help niche items get attention instead of only blockbusters.
            </>,
          ]}
        />
      </section>

      <section className="space-y-3">
        <H2 id="components">Necessary components</H2>
        <P>A recommender system needs three things, plus an algorithm that ties them together:</P>
        <Bullets
          items={[
            <>
              <TX>Users</TX> — the people receiving recommendations, optionally with profiles /
              attributes.
            </>,
            <>
              <TX>Items</TX> — the catalogue of things that can be recommended, optionally with
              content features.
            </>,
            <>
              <TX>Interactions / feedback</TX> — observed user–item signals (ratings, clicks,
              purchases). This is the raw material the model learns from.
            </>,
            <>
              <TX>A recommendation model</TX> — the algorithm that takes a user (and maybe a
              context) and produces a ranked list of items.
            </>,
          ]}
        />
        <P>
          They work together like this: the model learns patterns from the historical
          interactions between users and items, builds a representation of the requesting
          user&rsquo;s taste, scores the unseen items, and returns the top-scoring ones.
        </P>
      </section>

      <section className="space-y-3">
        <H2 id="vs-ir">Recommender systems vs. information retrieval</H2>
        <P>
          Both are <TX>information access systems</TX>, but they differ in who starts the
          interaction:
        </P>
        <Compare
          a={{
            title: 'Recommender system (push)',
            points: [
              'Proactively pushes items at the user.',
              'No explicit query — uses a user profile / history.',
              'Personalised: output depends on who you are.',
              'Goal: predict what you will like next.',
            ],
          }}
          b={{
            title: 'Search engine / IR (pull)',
            points: [
              'User pulls information with an explicit query.',
              'Returns documents matching the query.',
              'Often the same results for everyone.',
              'Goal: satisfy a stated information need.',
            ],
          }}
        />
        <Callout kind="exam">
          The exact 2025 answer: &ldquo;Recommender systems proactively <em>push</em> items to the
          user, whereas information retrieval systems take a <em>query</em> and return documents
          (pull).&rdquo;
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="feedback">Types of user feedback</H2>
        <P>
          The signal you collect shapes which algorithm you can use. Two big axes:
        </P>
        <DataTable
          head={['Type', 'Example', 'Notes']}
          rows={[
            ['Explicit', '1–5 star rating, thumbs up/down', 'Accurate but sparse — users rarely rate.'],
            ['Implicit', 'plays, clicks, dwell time, skips', 'Abundant but noisy — a click is not a "like".'],
            ['Interval / numeric', 'rate 1–5', 'Needs a semantic interpretation of the scale.'],
            ['Ordinal', 'strongly agree … strongly disagree', 'Ordered categories, unequal gaps.'],
            ['Binary', 'like / dislike (−1, 0, +1)', 'Two-valued preference.'],
            ['Unary', 'purchased / played (presence only)', 'Only positives observed; absence ≠ dislike.'],
          ]}
        />
        <Callout kind="note">
          A classic exam question: &ldquo;Would the feedback you collect affect the recommender
          method you choose?&rdquo; <TX>Yes.</TX> Numeric ratings → rating prediction (RMSE/MAE).
          Implicit/unary signals → ranking / top-N with positive-only learning.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="problem">Two ways to frame the task</H2>
        <Compare
          a={{
            title: 'Rating prediction',
            points: [
              'Predict the numeric score a user gives an item.',
              'Fills in the rating matrix.',
              'Evaluated with RMSE / MAE.',
            ],
          }}
          b={{
            title: 'Ranking / top-N',
            points: [
              'Produce an ordered list of N items.',
              'Order matters; absolute score does not.',
              'Evaluated with precision, recall, NDCG, MRR.',
            ],
          }}
        />
        <Formula caption="The recommendation task as scoring then sorting">
          recommend(u) = top-N<sub>i ∈ unseen(u)</sub> score(u, i)
        </Formula>
      </section>

      <section className="space-y-3">
        <H2 id="challenges">Core challenges</H2>
        <Bullets
          items={[
            <>
              <TX>Cold start</TX> — a new user or new item has no interactions, so the system
              cannot place them. Content-based methods cure <em>item</em> cold start but not{' '}
              <em>user</em> cold start.
            </>,
            <>
              <TX>Data sparsity</TX> — the user–item matrix is mostly empty; few overlapping
              ratings make similarity estimates unreliable.
            </>,
            <>
              <TX>Long tail</TX> — a few items get most of the ratings, the vast majority get
              almost none (see the Evaluation &amp; Ethics topics).
            </>,
            <>
              <TX>Gray sheep</TX> — users whose taste does not consistently agree or disagree with
              any group; collaborative filtering serves them poorly.
            </>,
            <>
              <TX>Scalability</TX> — millions of users × items; the model must score fast.
            </>,
          ]}
        />
      </section>

      <MiniCheck q="A streaming service only logs which songs were played (no ratings, no skips). Which task framing and metric family fit?">
        Plays are <TX>unary / implicit positive-only</TX> feedback. You cannot do rating prediction
        (no scores to predict), so frame it as <TX>ranking / top-N</TX> and evaluate with ranking
        metrics (precision@k, recall@k, MRR, NDCG). Absence of a play is not a confirmed dislike.
      </MiniCheck>
    </div>
  )
}
