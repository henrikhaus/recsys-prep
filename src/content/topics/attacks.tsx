import type { TopicMeta } from '#/content/types'
import {
  Lead,
  H2,
  P,
  TX,
  Callout,
  Bullets,
  Compare,
  MiniCheck,
  DataTable,
} from '#/components/teach'

export const meta: TopicMeta = {
  id: 'attacks',
  num: 12,
  lecture: 'Lecture 12',
  title: 'Attacks on Recommender Systems',
  blurb:
    'Profile-injection (shilling) attacks: push vs. nuke, attack profiles, and why item-based CF resists them.',
  minutes: 14,
  tags: ['shilling', 'push attack', 'nuke attack', 'profile injection', 'defence'],
  visualizers: [],
  examWeight: 'high',
}

export function Content() {
  return (
    <div className="space-y-7">
      <Lead>
        Because collaborative filtering trusts user ratings, an adversary can inject{' '}
        <TX>fake profiles</TX> to manipulate what real users are recommended. These are{' '}
        <TX>profile-injection</TX> or <TX>shilling</TX> attacks.
      </Lead>

      <section className="space-y-3">
        <H2 id="goals">Push vs. nuke</H2>
        <Compare
          a={{
            title: 'Push attack',
            points: [
              'Goal: amplify a target item’s popularity / rating.',
              'Make the system recommend it more often.',
              'Motive: promote your own product.',
            ],
          }}
          b={{
            title: 'Nuke attack',
            points: [
              'Goal: demote a target item.',
              'Make the system recommend it less / rate it lower.',
              'Motive: damage a competitor.',
            ],
          }}
        />
        <Callout kind="exam">
          &ldquo;An adversary attacks with a push attack — what is her intention?&rdquo; →{' '}
          <TX>to amplify a certain item&rsquo;s popularity</TX> so it gets recommended more.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="profile">Anatomy of an attack profile</H2>
        <P>A fake profile is constructed from four parts:</P>
        <Bullets
          items={[
            <>
              <TX>Target item</TX> — given the maximum (push) or minimum (nuke) rating.
            </>,
            <>
              <TX>Selected items</TX> — chosen strategically to make the profile influential.
            </>,
            <>
              <TX>Filler items</TX> — randomly rated items that make the profile look like a real
              user.
            </>,
            <>
              <TX>Unrated items</TX> — left empty, like any genuine sparse profile.
            </>,
          ]}
        />
      </section>

      <section className="space-y-3">
        <H2 id="types">Attack types</H2>
        <DataTable
          head={['Attack', 'Strategy']}
          rows={[
            ['Random attack', 'Filler items rated around the overall system mean.'],
            ['Average attack', 'Filler items rated near each item’s own average — more convincing.'],
            ['Bandwagon attack', 'Rate popular blockbuster items highly so the fake profile joins many neighbourhoods.'],
            ['Segment attack', 'Target a specific user segment by rating items that segment loves.'],
            ['Reverse bandwagon', 'A nuke variant — associate the target with widely disliked items.'],
          ]}
        />
      </section>

      <section className="space-y-3">
        <H2 id="defence">Defences</H2>
        <Bullets
          items={[
            <>
              <TX>Prevent automation</TX> — CAPTCHAs and rate limits make mass fake-account
              creation costly.
            </>,
            <>
              <TX>Detect fake profiles</TX> — anomaly detection: injected profiles have unusual
              rating patterns and correlations.
            </>,
            <>
              <TX>Robust algorithms</TX> — algorithms less sensitive to a handful of injected
              profiles.
            </>,
            <>
              <TX>Prefer item-based CF</TX> — see below.
            </>,
          ]}
        />
        <Callout kind="key" title="Why item-based CF resists push attacks">
          Item-based CF predicts a rating from the <TX>target user&rsquo;s own ratings</TX> of
          similar items. The target user is a genuine, authentic user — an attacker cannot inject
          ratings into a real person&rsquo;s account. User-based CF, by contrast, relies on the
          neighbourhood, which fake profiles can join. So item-based CF is generally{' '}
          <TX>harder to attack</TX> for pushing items.
        </Callout>
        <Callout kind="pitfall">
          False exam statement: &ldquo;the effectiveness of an attack is independent of the
          recommendation algorithm.&rdquo; It is <TX>not</TX> — it depends heavily on the
          algorithm. That is exactly why choosing item-based CF is itself a defence.
        </Callout>
      </section>

      <MiniCheck q="A small online shop notices one obscure product suddenly tops every recommendation list. Diagnose and defend.">
        <P>
          This is a likely <TX>push attack</TX>: fake profiles were injected that rate the obscure
          target item maximally plus filler items, joining many neighbourhoods so user-based CF
          recommends it widely.
        </P>
        <P>
          Defences: detect the injected profiles via <TX>anomaly detection</TX> (clustered, near-
          identical rating patterns appearing in a short window), add <TX>CAPTCHA / rate limits</TX>{' '}
          on account creation, and switch the push-sensitive path to <TX>item-based CF</TX>, which
          leans on the genuine user&rsquo;s own ratings.
        </P>
      </MiniCheck>
    </div>
  )
}
