import type { TopicMeta } from '#/content/types'
import { Lead, H2, P, TX, Callout, Bullets, MiniCheck } from '#/components/teach'

export const meta: TopicMeta = {
  id: 'young-users',
  num: 8,
  lecture: 'Lecture 08',
  title: 'Recommender Systems & Young Users',
  blurb:
    'Why children are not "little adults": appropriateness, multi-stakeholder needs, and evaluation challenges.',
  minutes: 11,
  tags: ['children', 'appropriateness', 'multi-stakeholder', 'safety', 'privacy'],
  visualizers: [],
  examWeight: 'medium',
}

export function Content() {
  return (
    <div className="space-y-7">
      <Lead>
        Guest lecture by Sole Pera. The headline message: children are{' '}
        <TX>not little adults</TX>. A recommender tuned for adult engagement can be wrong, unsafe
        or unusable for young users.
      </Lead>

      <section className="space-y-3">
        <H2 id="different">Why young users are different</H2>
        <Bullets
          items={[
            <>
              <TX>Developmental stage</TX> — reading level, vocabulary and interests change fast
              with age; a 6-year-old and a 14-year-old need different things.
            </>,
            <>
              <TX>Vocabulary mismatch</TX> — children phrase queries and express preferences
              differently, so adult-trained models misread them.
            </>,
            <>
              <TX>Noisy feedback</TX> — clicks and ratings from children are less reliable signals
              of genuine preference.
            </>,
            <>
              <TX>Appropriateness matters more than engagement</TX> — the &ldquo;best&rdquo; item
              is the safe, age-suitable, educational one, not the most clicked.
            </>,
          ]}
        />
      </section>

      <section className="space-y-3">
        <H2 id="stakeholders">A multi-stakeholder problem</H2>
        <P>
          For an adult, the user and the decision-maker are the same person. For a child they are
          not — several parties have a say:
        </P>
        <Bullets
          items={[
            <>
              <TX>The child</TX> — wants fun, engaging content.
            </>,
            <>
              <TX>Parents / guardians</TX> — want safety and appropriateness.
            </>,
            <>
              <TX>Teachers</TX> — want educational value.
            </>,
            <>
              <TX>The provider &amp; society</TX> — want healthy, non-exploitative design.
            </>,
          ]}
        />
        <P>
          These goals conflict, so child-facing recommendation is inherently a{' '}
          <TX>multi-objective, multi-stakeholder</TX> design problem.
        </P>
      </section>

      <section className="space-y-3">
        <H2 id="challenges">Key challenges</H2>
        <Bullets
          items={[
            <>
              <TX>Safety &amp; appropriateness</TX> — filter harmful, scary or age-inappropriate
              content.
            </>,
            <>
              <TX>Privacy</TX> — children&rsquo;s data is extra-sensitive and legally protected;
              minimise collection.
            </>,
            <>
              <TX>Evaluation is hard</TX> — you cannot run the same studies as with adults;
              feedback is noisy and ethical constraints are tighter.
            </>,
            <>
              <TX>Fairness across ages</TX> — do not let the system serve one age band well and
              others poorly.
            </>,
          ]}
        />
        <Callout kind="exam">
          If a scenario question involves a younger audience, explicitly raise{' '}
          <TX>appropriateness</TX>, <TX>safety filtering</TX>, <TX>readability / age matching</TX>,{' '}
          <TX>parental controls</TX> and <TX>extra privacy care</TX> — these score the marks.
        </Callout>
      </section>

      <MiniCheck q="A kids' video app reuses an adult engagement-optimised recommender. Give two concrete things that can go wrong.">
        <P>
          (1) <TX>Inappropriate content</TX> — optimising watch time can surface scary,
          sensational or age-unsuitable videos because they hold attention.
        </P>
        <P>
          (2) <TX>Vocabulary / developmental mismatch</TX> — content tuned to adult interests and
          reading levels confuses or bores a young child, and their noisy clicks get misread as
          genuine preference, reinforcing the wrong recommendations.
        </P>
      </MiniCheck>
    </div>
  )
}
