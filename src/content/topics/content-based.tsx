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
  id: 'content-based',
  num: 2,
  lecture: 'Lecture 02',
  title: 'Content-based Filtering & NLP',
  blurb:
    'Recommend items similar to what a user liked, using item features. TF-IDF, user profiling, embeddings and BERT.',
  minutes: 18,
  tags: ['TF-IDF', 'cosine', 'user profile', 'embeddings', 'BERT', 'cold start'],
  visualizers: ['tfidf', 'cosine'],
  examWeight: 'core',
}

export function Content() {
  return (
    <div className="space-y-7">
      <Lead>
        Content-based filtering (CBF) estimates a user&rsquo;s preference toward an item&rsquo;s{' '}
        <TX>features</TX>. If you liked sci-fi films, it recommends other sci-fi films — no other
        users needed. Exams test this with TF-IDF arithmetic, so practise the calculation.
      </Lead>

      <section className="space-y-3">
        <H2 id="idea">The core idea</H2>
        <P>
          CBF works entirely within one user&rsquo;s own history. Two ingredients:
        </P>
        <Steps
          items={[
            <>
              <TX>Item representation.</TX> Describe every item as a feature vector.
            </>,
            <>
              <TX>User profile.</TX> Aggregate the feature vectors of the items the user liked into
              a profile vector.
            </>,
          ]}
        />
        <P>
          To score an unseen item, measure how similar its feature vector is to the user
          profile. High similarity → recommend.
        </P>
      </section>

      <section className="space-y-3">
        <H2 id="representation">Representing items by their features</H2>
        <P>Three standard ways to represent items (a very common 1.5-point list question):</P>
        <Bullets
          items={[
            <>
              <TX>Structured / categorical features</TX> — explicit attributes such as genre,
              author, price band, year. Represent as one-hot or categorical values.
            </>,
            <>
              <TX>Bag-of-words with TF-IDF</TX> — turn free text (a description, abstract, lyrics)
              into a weighted term vector.
            </>,
            <>
              <TX>Embeddings</TX> — dense vectors from a model (word2vec, or a contextual model
              like BERT) capturing semantic meaning.
            </>,
          ]}
        />
        <Callout kind="note">
          For a <em>book</em> recommender (a recurring exam scenario) good features are: genre /
          category (fiction, textbook…), author, publication year, and a TF-IDF or embedding
          representation of the blurb. Structure the answer as &ldquo;feature X with values Y for
          reason Z&rdquo;.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="tfidf">TF-IDF</H2>
        <P>
          TF-IDF weights a term by how important it is <em>to one document</em> relative to the
          whole collection. It is the workhorse of text-based CBF.
        </P>
        <H3>Term frequency (TF)</H3>
        <P>
          How often term <TX>t</TX> occurs in document <TX>d</TX>. Either the raw count, or the{' '}
          <TX>relative frequency</TX> (count divided by document length) to normalise for length.
        </P>
        <H3>Inverse document frequency (IDF)</H3>
        <Formula caption="N = total documents, n(t) = documents containing term t">
          IDF(t) = log( N / n(t) )
        </Formula>
        <P>
          A term appearing in <em>every</em> document (&ldquo;the&rdquo;) has IDF ≈ 0 — it carries
          no discriminative power. A rare term has high IDF.
        </P>
        <Formula caption="The final weight of term t in document d">
          TF-IDF(t, d) = TF(t, d) × IDF(t)
        </Formula>
        <Callout kind="pitfall" title="State your log base and TF variant">
          The course has used both log&#8322; and log&#8321;&#8320;, and both raw-count and
          relative-frequency TF. Either is accepted <em>if you state which you use</em>. Marks are
          lost for unstated assumptions, not for the base.
        </Callout>

        <Callout kind="example" title="TF-IDF — the 2023 exam numbers">
          <P>
            Collection of <TX>N = 130</TX> articles. The word &ldquo;cloud&rdquo; appears{' '}
            <TX>7</TX> times in article a1 and in <TX>21</TX> articles overall. &ldquo;office&rdquo;
            appears <TX>2</TX> times in a1 and in <TX>55</TX> articles.
          </P>
          <P>
            TF-IDF(cloud, a1) = 7 × log&#8321;&#8320;(130 / 21) = 7 × 0.79 ≈ <TX>5.53</TX>
          </P>
          <P>
            TF-IDF(office, a1) = 2 × log&#8321;&#8320;(130 / 55) = 2 × 0.374 ≈ <TX>0.75</TX>
          </P>
          <P>
            Interpretation: &ldquo;cloud&rdquo; has the higher weight, so it is more central to the
            topic of article a1 than &ldquo;office&rdquo;.
          </P>
        </Callout>
        <P>
          <TX>Why TF-IDF is useful for RecSys:</TX> it converts unstructured text into a numeric
          feature vector, so you can compute the similarity of item descriptions and of a user
          profile to candidate items in content-based filtering.
        </P>
      </section>

      <section className="space-y-3">
        <H2 id="profile">Building a user profile &amp; scoring</H2>
        <P>
          Given item representations and the items a user has liked, estimate the score for an
          unseen item:
        </P>
        <Steps
          items={[
            <>Take the feature vectors of the items in the user&rsquo;s history.</>,
            <>
              Aggregate them into a <TX>user profile</TX> vector — typically the (rating-weighted)
              average.
            </>,
            <>
              Compute the <TX>cosine similarity</TX> between the profile and each candidate item
              vector.
            </>,
            <>Rank candidates by similarity; recommend the top ones.</>,
          ]}
        />
        <Callout kind="note">
          An alternative to a single profile vector: compute the average cosine similarity between
          the candidate and <em>each liked item</em> individually (this is the approach in the 2025
          exam&rsquo;s book example). Or treat it as <TX>classification</TX> — train a classifier
          on liked vs. disliked items to predict the label of a new item.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="nlp">NLP preprocessing &amp; feature selection</H2>
        <P>
          Raw text must be cleaned before it becomes useful features:{' '}
          <TX>tokenisation</TX>, lowercasing, <TX>stop-word removal</TX>, and{' '}
          <TX>stemming / lemmatisation</TX>. Most online data is unstructured, so preprocessing is
          necessary to extract discriminative features.
        </P>
        <P>
          The <TX>Gini index</TX> can rank how discriminative a word is — a word with a skewed
          distribution across ratings carries signal. It is a feature-selection aid.
        </P>
      </section>

      <section className="space-y-3">
        <H2 id="bert">Word embeddings vs. Transformers (BERT)</H2>
        <Compare
          a={{
            title: 'Static word embeddings (word2vec, GloVe)',
            points: [
              'One fixed vector per word.',
              'Same vector regardless of sentence context.',
              '"bank" (river) = "bank" (money) — collision.',
              'Cheap, simple, pre-computed.',
            ],
          }}
          b={{
            title: 'Transformers (BERT)',
            points: [
              'Context-dependent representation per token.',
              'Self-attention; e.g. BERT has 12 attention heads.',
              'Handles out-of-vocabulary tokens via subwords.',
              'Reusable for many downstream tasks.',
            ],
          }}
        />
        <Callout kind="exam">
          &ldquo;How can BERT support recommender systems?&rdquo; → It produces rich numeric
          representations of textual item content for content-based filtering — turning
          descriptions, reviews or articles into embeddings you can compute similarity over.
        </Callout>
      </section>

      <section className="space-y-3">
        <H2 id="prosandcons">Strengths &amp; limitations</H2>
        <Compare
          a={{
            title: 'Strengths',
            points: [
              'No other users needed — works for a brand-new user with a few ratings.',
              'Handles item cold start: a new item has features, so it can be scored.',
              'Recommendations are explainable ("because it is sci-fi").',
            ],
          }}
          b={{
            title: 'Limitations',
            points: [
              'Over-specialisation / filter bubble — only recommends more of the same.',
              'Low serendipity — no pleasant surprises.',
              'Needs good features; fails if items cannot be described.',
              'Cannot solve user cold start (a user with zero history has no profile).',
            ],
          }}
        />
      </section>

      <MiniCheck q="CBF can recommend a brand-new item nobody has rated. But can it recommend anything to a brand-new user? Why / why not?">
        <P>
          <TX>New item — yes.</TX> The item has feature values, so its similarity to the
          user&rsquo;s profile can be computed. CBF cures <em>item</em> cold start.
        </P>
        <P>
          <TX>New user — no.</TX> With zero interactions there is nothing to aggregate into a
          profile, so there is nothing to compare candidate items against. CBF cannot solve{' '}
          <em>user</em> cold start — you need a fallback such as a popularity recommender or
          onboarding questions.
        </P>
      </MiniCheck>
    </div>
  )
}
