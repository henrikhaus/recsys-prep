import type { TopicMeta } from '#/content/types'
import { Lead, H2, P, TX, Callout, Bullets, Compare, MiniCheck } from '#/components/teach'

export const meta: TopicMeta = {
  id: 'genai',
  num: 10,
  lecture: 'Lecture 10',
  title: 'Generative AI for Recommender Systems',
  blurb:
    'How large language models are used as recommenders, representation generators, and explanation engines — and where they fail.',
  minutes: 13,
  tags: ['LLM', 'conversational', 'embeddings', 'hallucination', 'cold start'],
  visualizers: [],
  examWeight: 'medium',
}

export function Content() {
  return (
    <div className="space-y-7">
      <Lead>
        Large language models bring broad world knowledge and a natural-language interface to
        recommendation. This is a newer lecture — expect conceptual questions on{' '}
        <TX>how</TX> they help and <TX>where</TX> they fail.
      </Lead>

      <section className="space-y-3">
        <H2 id="uses">Ways to use generative AI</H2>
        <Bullets
          items={[
            <>
              <TX>LLM as the recommender</TX> — prompt the model with the user&rsquo;s history and
              ask it to suggest items, zero- or few-shot, no training needed.
            </>,
            <>
              <TX>Conversational recommendation</TX> — a dialogue: the user refines preferences in
              natural language and the system responds.
            </>,
            <>
              <TX>Representation generation</TX> — produce rich embeddings of items and users from
              text, feeding a classic recommender (links to content-based filtering).
            </>,
            <>
              <TX>Data augmentation</TX> — synthesise plausible interactions or profiles to relieve
              sparsity and cold start.
            </>,
            <>
              <TX>Explanation generation</TX> — turn a recommendation into a fluent,
              human-readable justification.
            </>,
            <>
              <TX>Content generation</TX> — generate or summarise the recommended items themselves.
            </>,
          ]}
        />
      </section>

      <section className="space-y-3">
        <H2 id="tradeoffs">Strengths vs. risks</H2>
        <Compare
          a={{
            title: 'Strengths',
            points: [
              'World knowledge — helps cold start with little interaction data.',
              'Natural-language interface; conversational refinement.',
              'Strong, transferable semantic representations.',
              'Fluent, on-demand explanations.',
            ],
          }}
          b={{
            title: 'Risks',
            points: [
              'Hallucination — may recommend items that do not exist in the catalogue.',
              'Training-data bias — over-recommends popular / well-documented items.',
              'Cost and latency at scale.',
              'Stale knowledge — unaware of new items; sensitive to prompt wording.',
            ],
          }}
        />
        <Callout kind="pitfall">
          An LLM does not know your catalogue. Always <TX>ground</TX> it — constrain or
          retrieve-and-verify against the real item set so it cannot recommend things you do not
          actually have.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="positioning">How it fits with classic methods</H2>
        <P>
          Generative AI rarely replaces collaborative filtering or matrix factorization at scale —
          they are cheaper and grounded in real behaviour. The pragmatic pattern is{' '}
          <TX>hybrid</TX>: use the LLM for cold start, conversation, embeddings and explanations,
          and use classic CF/CBF for the high-volume scoring.
        </P>
      </section>

      <MiniCheck q="Why is grounding / retrieval important when an LLM is used as a recommender?">
        An LLM generates text from learned patterns, not from your live catalogue, so it can{' '}
        <TX>hallucinate</TX> items that do not exist and lean on <TX>popularity bias</TX> from its
        training data. Grounding it — restricting or verifying its output against the real item set
        (retrieval-augmented) — keeps recommendations valid, current and actually available.
      </MiniCheck>
    </div>
  )
}
