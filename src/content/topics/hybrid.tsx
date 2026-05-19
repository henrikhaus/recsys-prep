import type { TopicMeta } from '#/content/types'
import {
  Lead,
  H2,
  P,
  TX,
  Callout,
  Bullets,
  Formula,
  MiniCheck,
  DataTable,
} from '#/components/teach'

export const meta: TopicMeta = {
  id: 'hybrid',
  num: 9,
  lecture: 'Lecture 09',
  title: 'Hybrid & Multi-Objective Recommendation',
  blurb:
    'Combining several recommenders, fallback strategies, and optimising for more than one objective.',
  minutes: 15,
  tags: ['hybrid', 'ensemble', 'fallback', 'multi-objective', 'cold start'],
  visualizers: [],
  examWeight: 'high',
}

export function Content() {
  return (
    <div className="space-y-7">
      <Lead>
        No single method is best at everything. Hybrid systems combine recommenders to{' '}
        <TX>keep each one&rsquo;s strengths and cancel its weaknesses</TX> — most importantly,
        covering each other&rsquo;s cold-start gaps.
      </Lead>

      <section className="space-y-3">
        <H2 id="why">Why hybridise?</H2>
        <Bullets
          items={[
            <>
              <TX>Complementary strengths</TX> — CF captures community taste; CBF handles new
              items; popularity covers new users.
            </>,
            <>
              <TX>Cold-start coverage</TX> — when CF/CBF cannot answer, a fallback still can.
            </>,
            <>
              <TX>Better accuracy</TX> — a blend usually beats any single component.
            </>,
          ]}
        />
        <Callout kind="pitfall">
          A common false MCQ claim: &ldquo;evaluating hybrid recommender systems is usually
          easier.&rdquo; It is <em>harder</em> — more moving parts and interactions to assess.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="designs">Hybridisation designs</H2>
        <DataTable
          head={['Design', 'How it combines methods']}
          rows={[
            ['Weighted', 'Take a weighted average of every method’s score.'],
            ['Switching', 'Pick one method per situation (e.g. CBF for cold users, CF otherwise).'],
            ['Mixed', 'Show recommendations from several methods side by side.'],
            ['Feature combination', 'Feed one method’s output as features into another.'],
            ['Cascade', 'One method ranks, the next breaks ties / refines.'],
            ['Ensemble', 'Combine the outputs of several algorithms into one output.'],
          ]}
        />
      </section>

      <section className="space-y-3">
        <H2 id="combining">Combining scores in practice</H2>
        <P>
          Given several methods that each estimate a score for the same (user, item) pair:
        </P>
        <Formula caption="Weighted average — weights reflect trust in each method">
          score = w<sub>A</sub>·s<sub>A</sub> + w<sub>B</sub>·s<sub>B</sub> + w<sub>C</sub>·s<sub>C</sub>,&nbsp;&nbsp; Σw = 1
        </Formula>
        <Callout kind="example" title="Worked combinations">
          <P>
            <TX>2024 — three methods</TX> giving 0.8, 0.7, 0.4. An equal-weight average is
            (0.8 + 0.7 + 0.4) / 3 ≈ <TX>0.63</TX>. If method A is most reliable, weight it higher.
          </P>
          <P>
            <TX>2025 — five methods with gaps.</TX> When a method returns N/A it cannot vote — drop
            it for that item rather than treating N/A as 0. Then either take a weighted average of
            the methods that did respond, or use majority <TX>voting</TX> on which item each method
            prefers.
          </P>
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="fallback">Fallback recommenders</H2>
        <P>
          A <TX>fallback</TX> (or baseline) is a simple, barely-personalised recommender that
          guarantees an answer when the sophisticated models fail — most often for a brand-new
          user with no history. It is itself a (switching) form of hybridisation.
        </P>
        <Bullets
          items={[
            <>
              <TX>Most-popular</TX> — recommend globally popular items (optionally weighting
              recent interactions higher).
            </>,
            <>
              <TX>Most-recent / trending</TX> — newest or fastest-rising items.
            </>,
            <>
              <TX>Random</TX> — last resort; maximal coverage, no relevance.
            </>,
            <>
              <TX>Content-based</TX> — works once the user has even one liked item.
            </>,
          ]}
        />
      </section>

      <section className="space-y-3">
        <H2 id="multi-objective">Multi-objective recommendation</H2>
        <P>
          Real systems optimise several objectives at once — accuracy, diversity, revenue,
          fairness, provider exposure. They can be combined at different levels:
        </P>
        <Bullets
          items={[
            <>
              <TX>User-segmented, item-level</TX> — different objective weights per user segment,
              applied when scoring items.
            </>,
            <>
              <TX>User-level, item-level</TX> — objectives balanced individually for each user
              over the item scores.
            </>,
            <>
              <TX>Model-level</TX> — the objectives are baked into the model&rsquo;s training loss.
            </>,
          ]}
        />
        <Callout kind="note">
          Multi-objective optimisation is about <TX>trade-offs</TX>: gaining diversity usually
          costs some accuracy. There is rarely one solution that is best on every objective — you
          pick a point on the trade-off curve.
        </Callout>
      </section>

      <MiniCheck q="A new user opens your music app. CF has no neighbours for them and CBF has no profile. What hybrid design saves the experience?">
        Use a <TX>switching</TX> hybrid with a <TX>fallback recommender</TX>: detect the cold-start
        condition and serve a <TX>most-popular</TX> (recency-weighted) baseline. As soon as the
        user likes or plays a few tracks, switch to content-based, and once enough interactions
        accumulate, hand over to collaborative filtering.
      </MiniCheck>
    </div>
  )
}
