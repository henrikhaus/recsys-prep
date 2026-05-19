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
  id: 'exploration',
  num: 5,
  lecture: 'Lecture 05',
  title: 'Exploration & Exploitation',
  blurb:
    'Keeping models fresh: the explore/exploit trade-off, multi-armed bandits, MDPs and A/B testing.',
  minutes: 18,
  tags: ['bandits', 'epsilon-greedy', 'UCB', 'Thompson sampling', 'A/B test', 'MDP'],
  visualizers: ['bandit', 'abtest'],
  examWeight: 'high',
}

export function Content() {
  return (
    <div className="space-y-7">
      <Lead>
        A recommender that only ever shows its current &ldquo;best guess&rdquo; never learns
        anything new. Keeping models up to date forces a trade-off between{' '}
        <TX>exploiting</TX> known winners and <TX>exploring</TX> uncertain options.
      </Lead>

      <section className="space-y-3">
        <H2 id="why-update">Why must we keep updating the model?</H2>
        <Bullets
          items={[
            <>
              <TX>New items &amp; users</TX> arrive constantly and have no history.
            </>,
            <>
              <TX>Preference drift</TX> — tastes and trends change over time.
            </>,
            <>
              <TX>Feedback loops</TX> — the model only ever sees data about what it already
              recommended, so it can become blind to everything else.
            </>,
          ]}
        />
      </section>

      <section className="space-y-3">
        <H2 id="explore-exploit">Explore vs. exploit</H2>
        <Compare
          a={{
            title: 'Exploit',
            points: [
              'Recommend the item / model with the best known estimated reward.',
              'Maximises short-term reward.',
              'Risk: gets stuck on a local optimum, never discovers better options.',
            ],
          }}
          b={{
            title: 'Explore',
            points: [
              'Try items / models whose value is uncertain.',
              'Gathers information, may reveal better options.',
              'Risk: short-term cost — some recommendations will be poor.',
            ],
          }}
        />
        <Callout kind="pitfall">
          Pure exploitation does <em>not</em> guarantee the best long-term performance, and bandits
          do <em>not</em> eliminate exploration — they <TX>balance</TX> the two.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="bandits">Multi-armed bandits</H2>
        <P>
          Picture a row of slot machines (&ldquo;one-armed bandits&rdquo;). Each <TX>arm</TX> is an
          item or a candidate recommender; pulling it yields a noisy <TX>reward</TX> (a click, a
          play). You want to maximise total reward without knowing the true payout of each arm.
        </P>
        <H3>Strategies</H3>
        <DataTable
          head={['Strategy', 'How it decides', 'Character']}
          rows={[
            [
              'ε-greedy',
              'With prob. ε pick a random arm, otherwise the best-known arm.',
              'Simple; explores blindly and forever unless ε decays.',
            ],
            [
              'UCB',
              'Pick the arm with the highest upper confidence bound (estimate + uncertainty bonus).',
              'Optimism under uncertainty; explores arms it knows least about.',
            ],
            [
              'Thompson sampling',
              'Keep a posterior per arm; sample a value from each, pick the highest sample.',
              'Probabilistic; exploration scales with genuine uncertainty.',
            ],
          ]}
        />
        <Callout kind="exam" title="2025 MCQ — the true statement">
          &ldquo;Thompson sampling is a probabilistic approach that balances exploration and
          exploitation by sampling from the posterior distribution of expected rewards.&rdquo; —
          this was the only correct option.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="mdp">Markov Decision Processes</H2>
        <P>
          Bandits assume each choice is independent. An <TX>MDP</TX> models{' '}
          <TX>sequential</TX> decisions where actions change a <TX>state</TX>. It is defined by
          states, actions, a transition function, and rewards; the goal is a <TX>policy</TX> that
          maximises long-term cumulative reward.
        </P>
        <Callout kind="note">
          MDPs suit recommendation as a session / journey: the next recommendation depends on
          what the user did with the previous ones, not just an isolated click.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="abtest">A/B testing</H2>
        <P>
          The standard online way to resolve explore/exploit between two whole systems.
        </P>
        <Steps
          items={[
            <>Define a hypothesis and a primary metric (e.g. CTR, conversion).</>,
            <>
              Randomly assign incoming users to <TX>control (A)</TX> or <TX>treatment (B)</TX>.
            </>,
            <>Run long enough to collect a statistically sufficient sample.</>,
            <>
              Compare the metric; keep B only if the difference is{' '}
              <TX>statistically significant</TX>.
            </>,
          ]}
        />
        <H3>Pitfalls to mention</H3>
        <Bullets
          items={[
            <>
              <TX>Too small a sample / stopping early</TX> — random noise looks like a real effect.
            </>,
            <>
              <TX>Novelty effect</TX> — users react to <em>change</em>, not quality; let it settle.
            </>,
            <>
              <TX>Contamination / interference</TX> — groups must not influence each other.
            </>,
            <>
              <TX>Multiple testing</TX> — checking many metrics inflates false positives.
            </>,
          ]}
        />
        <Callout kind="key" title="A/A test">
          An <TX>A/A test</TX> shows <em>both</em> groups the same system. There should be no
          significant difference — if there is, the splitting / measurement pipeline is biased. It
          validates the experiment setup before you trust an A/B result.
        </Callout>
      </section>

      <MiniCheck q="Your ε-greedy recommender uses a fixed ε = 0.1 forever. What is wrong, and what would you change?">
        A fixed ε keeps wasting 10% of traffic on random recommendations <TX>even after</TX> the
        system has learned which arms are good — needless long-term cost. Use a{' '}
        <TX>decaying ε</TX> (explore heavily early, exploit more later), or switch to UCB / Thompson
        sampling, which automatically explore less as uncertainty shrinks.
      </MiniCheck>
    </div>
  )
}
