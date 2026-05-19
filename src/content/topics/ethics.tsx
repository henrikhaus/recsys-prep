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
  id: 'ethics',
  num: 7,
  lecture: 'Lecture 07',
  title: 'Ethics & Recommender Systems',
  blurb:
    'Bias, popularity bias, filter bubbles, fairness, privacy and misinformation — and how to mitigate them.',
  minutes: 16,
  tags: ['bias', 'popularity bias', 'filter bubble', 'fairness', 'privacy'],
  visualizers: [],
  examWeight: 'high',
}

export function Content() {
  return (
    <div className="space-y-7">
      <Lead>
        Recommender systems shape what millions of people see. Exam questions here are open-ended
        and graded on breadth — define a problem, give a concrete example, and propose a
        mitigation.
      </Lead>

      <section className="space-y-3">
        <H2 id="bias">Bias</H2>
        <P>
          <TX>Bias</TX> is a systematic skew in what a recommender suggests. Two main forms:
        </P>
        <Bullets
          items={[
            <>
              <TX>Item-side bias</TX> — the system favours certain items, recommending them more
              than their quality warrants (e.g. <TX>popularity bias</TX>).
            </>,
            <>
              <TX>User-side bias</TX> — the user model works better for some groups (e.g. men aged
              18–25) than others, so those groups get worse recommendations.
            </>,
          ]}
        />
      </section>

      <section className="space-y-3">
        <H2 id="popularity">Popularity bias &amp; the feedback loop</H2>
        <P>
          A few items get most of the attention; the long tail gets almost none. Recommenders{' '}
          <TX>exacerbate</TX> this: facing cold start they fall back to popular items, popular
          items are shown more, get more interactions, and look even more popular next round.
        </P>
        <Formula caption="A self-reinforcing loop">
          recommend popular → more exposure → more clicks → looks more popular → recommend again
        </Formula>
        <Callout kind="note" title="Why diversity is not just 'be random'">
          A purely random recommender maximises diversity and coverage — every item has a chance —
          but it <TX>throws away all the preference information</TX> in the rating matrix, so most
          recommendations are irrelevant. The goal is diversity <em>with</em> relevance.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="bubbles">Filter bubbles &amp; echo chambers</H2>
        <P>
          Personalisation narrows the information a user sees to what confirms their existing
          views. Over time the user is enclosed in a <TX>filter bubble</TX> — reduced diversity,
          reinforced beliefs, and, with news, polarisation.
        </P>
      </section>

      <section className="space-y-3">
        <H2 id="news">Ethics of a news recommender</H2>
        <DataTable
          head={['Concern', 'What can go wrong']}
          rows={[
            ['Privacy', 'Reading history is sensitive — political, health, personal interests.'],
            ['Misinformation', 'Engagement-optimised ranking can amplify false or sensational stories.'],
            ['Filter bubbles', 'Users only see one side; civic discourse fragments.'],
            ['Polarisation', 'Outrage drives clicks, so extreme content is over-recommended.'],
            ['Bias', 'Some outlets or viewpoints are systematically under-exposed.'],
          ]}
        />
      </section>

      <section className="space-y-3">
        <H2 id="mitigation">Mitigation strategies</H2>
        <Bullets
          items={[
            <>
              <TX>Debiasing algorithms</TX> — explicitly correct for popularity / exposure bias.
            </>,
            <>
              <TX>Debiased / re-weighted training data</TX> — counter missing-not-at-random
              effects (links to counterfactual evaluation).
            </>,
            <>
              <TX>Diversity &amp; serendipity objectives</TX> — optimise beyond pure accuracy.
            </>,
            <>
              <TX>Transparency &amp; explanations</TX> — tell users why an item was shown.
            </>,
            <>
              <TX>User control</TX> — let people reset, tune or opt out of personalisation.
            </>,
            <>
              <TX>Regulation &amp; auditing</TX> — societal limits on harmful personalisation.
            </>,
          ]}
        />
      </section>

      <MiniCheck q="A video platform's recommender keeps surfacing increasingly extreme content. Name the mechanism and one mitigation.">
        <P>
          The mechanism is an <TX>engagement-driven feedback loop</TX>: outrage and extreme content
          maximise watch time, so the optimiser learns to recommend more of it, pulling users
          toward a polarised filter bubble.
        </P>
        <P>
          Mitigations: add an explicit <TX>diversity objective</TX> so lists are not single-minded;
          cap how far the system can drift from a user&rsquo;s baseline interests; give the user
          visible <TX>controls</TX> and explanations; and optimise a longer-term satisfaction
          signal instead of raw short-term watch time.
        </P>
      </MiniCheck>
    </div>
  )
}
