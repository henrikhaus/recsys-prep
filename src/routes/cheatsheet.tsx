import { createFileRoute, Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { PageShell, PageHero } from '#/components/Page'
import { Card } from '#/components/ui'

export const Route = createFileRoute('/cheatsheet')({ component: Cheatsheet })

function Ref({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h2 className="display-title mb-3 text-lg font-bold text-[var(--sea-ink)]">{title}</h2>
      <div className="space-y-2.5">{children}</div>
    </Card>
  )
}

function F({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg bg-[rgba(23,58,64,0.05)] px-3 py-2 text-center text-[var(--sea-ink)] [font-family:'Fraunces',Georgia,serif]">
      {children}
    </div>
  )
}

function D({ term, children }: { term: string; children: ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-[var(--sea-ink)]">
      <strong className="font-bold">{term}</strong> — {children}
    </p>
  )
}

function Cheatsheet() {
  return (
    <PageShell>
      <PageHero
        kicker="Cheat sheet"
        title="Every formula and definition, one page"
        lead="The last-hour revision view. If a term is fuzzy, jump back to its topic guide."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Ref title="Core definitions">
          <D term="Recommender system">
            proactively pushes a personalised subset of items; different users get different
            results.
          </D>
          <D term="vs. information retrieval">
            IR pulls documents for an explicit query; an RS pushes without a query.
          </D>
          <D term="Cold start">
            no interactions for a new user/item. CBF fixes item cold start, not user cold start.
          </D>
          <D term="Data sparsity">the rating matrix is mostly empty.</D>
          <D term="Long tail">few items rated often, most rated rarely.</D>
          <D term="Gray sheep">users whose taste fits no group — CF serves them poorly.</D>
        </Ref>

        <Ref title="Content-based & TF-IDF">
          <F>TF(t,d) = count, or count ÷ document length</F>
          <F>IDF(t) = log( N / n(t) )</F>
          <F>TF-IDF(t,d) = TF(t,d) × IDF(t)</F>
          <D term="Score">cosine similarity between the user profile and the item vector.</D>
          <D term="BERT vs word2vec">
            BERT is contextual (per-sentence); word2vec gives one fixed vector per word.
          </D>
          <D term="Weakness">over-specialisation, low serendipity, no user cold start.</D>
        </Ref>

        <Ref title="Collaborative filtering">
          <F>cos(a,b) = a·b ÷ (‖a‖ ‖b‖)</F>
          <F>Pearson = cosine of mean-centred vectors</F>
          <F>r̂(u,i) = r̄ᵤ + Σ sim·(r − r̄) ÷ Σ|sim|</F>
          <F>MF: r̂(u,i) = pᵤ · qᵢ</F>
          <D term="User-based">find similar users; predict from their ratings.</D>
          <D term="Item-based">
            similar items via the target user's own ratings — harder to attack.
          </D>
          <D term="Memory vs model">neighbourhood (kNN) vs learned latent factors (MF).</D>
        </Ref>

        <Ref title="Evaluation — strategies">
          <D term="Offline">replay logs — cheap, repeatable, biased, no real reaction.</D>
          <D term="Online (A/B)">live traffic split — true behaviour, slow and risky.</D>
          <D term="User study">observe participants — rich, but small and artificial.</D>
          <D term="Splits">
            random holdout; cross-validation (k folds); sliding window (temporal — use for
            time-stamped data).
          </D>
        </Ref>

        <Ref title="Evaluation — metrics">
          <F>MAE = Σ|e| ÷ |E|</F>
          <F>RMSE = √( Σe² ÷ |E| ) ≥ MAE</F>
          <F>Precision@k = relevant in top-k ÷ k</F>
          <F>Recall@k = relevant in top-k ÷ all relevant</F>
          <F>NDCG = DCG ÷ ideal DCG</F>
          <F>ARHR = Σ 1/rankₕᵢₜ &nbsp;·&nbsp; MRR = 1/rank₁ₛₜ</F>
          <F>τ = (concordant − discordant) ÷ n(n−1)/2</F>
        </Ref>

        <Ref title="Exploration / exploitation">
          <D term="Exploit">recommend the best known option.</D>
          <D term="Explore">try uncertain options to learn.</D>
          <D term="ε-greedy">random arm with prob. ε, else the best estimate.</D>
          <D term="UCB">pick highest estimate + uncertainty bonus.</D>
          <D term="Thompson">sample each arm's posterior, pick the highest sample.</D>
          <D term="A/B test">
            split traffic; keep B only if the difference is statistically significant.
          </D>
          <D term="A/A test">both groups identical — validates the pipeline is unbiased.</D>
        </Ref>

        <Ref title="Context-awareness">
          <D term="Pre-filtering">a separate model per context — tailored but sparse.</D>
          <D term="Post-filtering">re-rank one model's output for the context.</D>
          <D term="Contextual modelling">context is a direct input to the model.</D>
          <F>#contexts = |D₁| × |D₂| × … × |Dₖ|</F>
          <D term="Hierarchies">
            coarsen a dimension (24h → 4 day-parts) to control sparsity.
          </D>
        </Ref>

        <Ref title="Hybrid & multi-objective">
          <D term="Designs">weighted, switching, mixed, feature-combination, cascade, ensemble.</D>
          <F>score = wₐsₐ + w_b s_b + w_c s_c , Σw = 1</F>
          <D term="Fallback">popularity / recency / random — covers cold start.</D>
          <D term="Multi-objective">trade off accuracy, diversity, revenue, fairness.</D>
        </Ref>

        <Ref title="Ethics & attacks">
          <D term="Popularity bias">a feedback loop: popular → exposed → more popular.</D>
          <D term="Filter bubble">personalisation narrows what a user sees.</D>
          <D term="Push attack">inject fake profiles to amplify an item.</D>
          <D term="Nuke attack">inject fake profiles to demote an item.</D>
          <D term="Attack profile">target, selected, filler and unrated items.</D>
          <D term="Defence">CAPTCHA, anomaly detection, item-based CF, robust algorithms.</D>
        </Ref>

        <Ref title="GenAI & counterfactual">
          <D term="GenAI uses">cold start, conversation, embeddings, explanations.</D>
          <D term="GenAI risk">hallucination — ground it against the real catalogue.</D>
          <D term="Off-policy evaluation">estimate a new policy from logged data.</D>
          <F>IPS: V̂ = (1/n) Σ (π_target ÷ π_log) · reward</F>
          <D term="IPS trade-off">unbiased but high variance; deterministic logs break it.</D>
        </Ref>
      </div>

      <p className="mt-6 text-center text-sm text-[var(--sea-ink-soft)]">
        Need the detail behind any of these?{' '}
        <Link to="/learn" className="font-semibold text-[var(--lagoon-deep)]">
          Open the topic guides
        </Link>
        .
      </p>
    </PageShell>
  )
}
