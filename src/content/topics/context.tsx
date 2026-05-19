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
  id: 'context',
  num: 6,
  lecture: 'Lecture 06',
  title: 'Context-Aware Recommendation',
  blurb:
    'Adding time, location and social setting: pre/post-filtering, contextual modelling, hierarchies and the sparsity trade-off.',
  minutes: 16,
  tags: ['context', 'pre-filtering', 'post-filtering', 'hierarchies', 'sparsity'],
  visualizers: ['context'],
  examWeight: 'high',
}

export function Content() {
  return (
    <div className="space-y-7">
      <Lead>
        The right recommendation depends on the situation: a workout playlist on a Monday morning,
        a relaxed one on Sunday evening. Context-aware recommenders add a{' '}
        <TX>context</TX> dimension to the usual user × item model.
      </Lead>

      <section className="space-y-3">
        <H2 id="definition">What is &ldquo;context&rdquo;?</H2>
        <P>
          Context is any information characterising the <TX>situation</TX> in which a
          recommendation is requested — not a property of the user or the item themselves.
        </P>
        <Bullets
          items={[
            <>
              <TX>Time</TX> — hour of day, weekday vs. weekend, season.
            </>,
            <>
              <TX>Location</TX> — at home, at the gym, travelling.
            </>,
            <>
              <TX>Social setting</TX> — alone, with a partner, with family, in a group.
            </>,
            <>
              <TX>Device / mood / weather</TX> — phone vs. TV, energetic vs. tired.
            </>,
          ]}
        />
        <P>
          The model becomes a <TX>3-dimensional</TX> User × Item × Context relation instead of the
          flat User × Item rating matrix.
        </P>
      </section>

      <section className="space-y-3">
        <H2 id="paradigms">Three ways to introduce context</H2>
        <DataTable
          head={['Approach', 'When context enters', 'Description']}
          rows={[
            [
              'Pre-filtering',
              'Before the model',
              'Select only the data matching the current context, then run a normal recommender on that slice. ("Builds a separate model for each context.")',
            ],
            [
              'Post-filtering',
              'After the model',
              'Run a normal recommender, then re-rank or filter the output for the context.',
            ],
            [
              'Contextual modelling',
              'Inside the model',
              'Context is a direct input to the prediction function — the model integrates it.',
            ],
          ]}
        />
        <Callout kind="exam" title="The matching question">
          A frequent exam item asks you to match descriptions: &ldquo;builds a separate model for
          each context&rdquo; → <TX>pre-filtering</TX>; &ldquo;integrates context into the
          model&rdquo; → <TX>contextual modelling</TX>; &ldquo;re-ranks recommendations for the
          context&rdquo; → <TX>post-filtering</TX>.
        </Callout>
        <Callout kind="note" title="Pre- vs. post-filtering">
          <P>
            <TX>Pre-filtering</TX> gives a model perfectly tailored to a context, but each context
            slice has little data → sparsity, and you maintain many models.
          </P>
          <P>
            <TX>Post-filtering</TX> keeps one well-trained model and a flexible re-ranking rule,
            but the base model is context-blind, so the adjustment is only a heuristic patch.
          </P>
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="hierarchies">Hierarchies &amp; granularity</H2>
        <P>
          Each context dimension can be modelled at different <TX>granularities</TX>, organised as
          a hierarchy. For <TX>time</TX>, from fine to coarse:
        </P>
        <Bullets
          items={[
            <>
              <TX>Hour of day</TX> — captures variation within a day (morning vs. night music).
            </>,
            <>
              <TX>Weekday</TX> — separates working days from the weekend.
            </>,
            <>
              <TX>Season</TX> — captures long-term cycles (festive, summer).
            </>,
          ]}
        />
        <Callout kind="key">
          Hierarchies <TX>control the sparsity</TX> of a context-aware system. If a fine-grained
          context has too few ratings, you climb the hierarchy to a coarser level that{' '}
          aggregates enough data to estimate reliably.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="tradeoff">The context / performance trade-off</H2>
        <P>
          Context helps — but each extra dimension <TX>multiplies</TX> the number of distinct
          contexts, splitting the same data into ever-smaller buckets.
        </P>
        <Formula caption="Total contexts = product of the sizes of every context dimension">
          #contexts = |D<sub>1</sub>| × |D<sub>2</sub>| × … × |D<sub>k</sub>|
        </Formula>
        <Callout kind="example" title="The 2024 resit numbers">
          Three dimensions with 12, 15 and 180 values give 12 × 15 × 180 ={' '}
          <TX>32&thinsp;400</TX> contexts. Spreading a fixed dataset over 32&thinsp;400 buckets
          leaves almost no ratings per bucket — pre-filtering becomes useless. Reduce it by{' '}
          <TX>coarsening</TX> the 180-value dimension up its hierarchy (e.g. 180 days → 4 seasons).
        </Callout>
        <P>
          So the trade-off: more contextual detail can improve relevance, but{' '}
          <TX>too many dimensions reduce the data per situation</TX>, the estimates become noisy,
          and overall performance drops.
        </P>
      </section>

      <MiniCheck q="Your music recommender adds time (24 hours), location (50 cities) and weather (8 states) as fine-grained context. What breaks, and how do you fix it without dropping context entirely?">
        <P>
          24 × 50 × 8 = <TX>9 600</TX> contexts. Each has far too few plays to train a reliable
          per-context model, so pre-filtering produces noisy recommendations.
        </P>
        <P>
          Fix it with <TX>hierarchies</TX>: coarsen each dimension — 24 hours → 4 day-parts, 50
          cities → a handful of regions, 8 weather states → 3. That collapses thousands of contexts
          into a few dozen well-populated ones, keeping useful context without the sparsity.
        </P>
      </MiniCheck>
    </div>
  )
}
