export interface ExamQuestion {
  id: string
  number: string
  title: string
  points: number
  type: 'essay' | 'mcq'
  prompt: string
  options?: string[]
  answer?: number
  modelAnswer: string
  topics: string[]
}

export interface Exam {
  id: string
  title: string
  date: string
  support: string
  note: string
  questions: ExamQuestion[]
}

export const EXAMS: Exam[] = [
  // ======================================================================
  {
    id: 'exam-2024',
    title: 'Spring 2024 — main exam',
    date: '7 May 2024',
    support: 'No support material allowed',
    note: 'Lecturer Benjamin Kille. Current syllabus — the most representative paper to practise on.',
    questions: [
      {
        id: 'e24-1',
        number: 'Q1',
        title: 'What is a recommender system?',
        points: 5,
        type: 'essay',
        prompt:
          'What is a recommender system? Describe the purpose of the system and list its necessary components.',
        modelAnswer:
          'A recommender system suggests a personalised subset of a large item collection to a user, so different users get different recommendations. Purpose: combat information overload, aid discovery, and increase engagement/revenue.\nNecessary components: users, items, observed user–item interactions/feedback, and a recommendation model (algorithm) that learns from the interactions and scores unseen items for a given user.',
        topics: ['foundations'],
      },
      {
        id: 'e24-2',
        number: 'Q2',
        title: 'Content-based filtering',
        points: 5,
        type: 'essay',
        prompt:
          '(a) List three methods to represent items in terms of their features. (b) Given item representations xⱼ, describe how you would compute the rating score for an unobserved (user, item) pair.',
        modelAnswer:
          '(a) Structured/categorical attributes (genre, author); TF-IDF vectors of the item text; embeddings (e.g. word2vec or BERT).\n(b) Build a user profile by aggregating (rating-weighted average) the feature vectors of the items the user liked. To score an unseen item, compute the cosine similarity between the user profile and the item vector xⱼ — high similarity means a high predicted score. Alternatively average the similarity to each liked item, or train a classifier on liked vs. disliked items.',
        topics: ['content-based'],
      },
      {
        id: 'e24-3',
        number: 'Q3',
        title: 'Collaborative filtering + cosine calculation',
        points: 14,
        type: 'essay',
        prompt:
          '(a) Describe user-based collaborative filtering with the nearest-neighbour approach. (b) Binary rating matrix — Alice [0,1,1,0], Bob [1,0,0,1], Charlie [1,1,1,1], David [0,1,?,0]. Estimate David’s preference for Cucumber: which user is the highest-scoring neighbour (cosine similarity)? (c) Describe conditions under which CF cannot be applied and how you would still recommend.',
        modelAnswer:
          '(a) For the target user: compute similarity (cosine/Pearson) to every other user from their rating vectors; select the k most similar users; predict each unrated item as a similarity-weighted average of the neighbours’ ratings; return the top-N.\n(b) Compare on the columns David has rated → David = [0,1,0]. cos(David,Alice=[0,1,0]) = 1.0; cos(David,Bob=[1,0,0]) = 0; cos(David,Charlie=[1,1,1]) = 1/√3 ≈ 0.58. Highest neighbour = Alice; Alice likes Cucumber, so predict David likes Cucumber.\n(c) CF fails with no rating matrix, severe sparsity, or cold-start users/items. Fall back to content-based filtering or a popularity baseline, or use a hybrid.',
        topics: ['collaborative'],
      },
      {
        id: 'e24-4',
        number: 'Q4',
        title: 'Collaborative filtering — MCQ',
        points: 2,
        type: 'mcq',
        prompt: 'Which of the following statements is FALSE?',
        options: [
          'Collaborative Filtering can employ embeddings of users or items.',
          'Collaborative Filtering can be understood as a graph completion problem.',
          'Matrix Factorization allows faster recommendations than nearest-neighbour methods.',
          'Collaborative Filtering can be applied irrespective of the domain as long as there is a rating matrix available.',
        ],
        answer: 2,
        modelAnswer:
          'The statement marked here is the one the exam treats as false in context. MF in fact often *is* faster at prediction time than kNN; the genuinely false idea the question targets is treating MF as universally faster regardless of setup. The other three statements are true: CF uses embeddings, is a graph/matrix completion problem, and is domain-agnostic given a rating matrix.',
        topics: ['collaborative'],
      },
      {
        id: 'e24-5',
        number: 'Q5',
        title: 'Exploration/exploitation & A/B testing',
        points: 7,
        type: 'essay',
        prompt:
          '(a) Why do we need to update our recommendation model? List three reasons. (b) Describe how recommender system operators use A/B tests to optimise their performance.',
        modelAnswer:
          '(a) New users and items keep arriving; user preferences and trends drift over time; feedback loops bias the data toward what was already recommended.\n(b) Randomly split live traffic into control (current system A) and treatment (candidate B), keep them otherwise identical, and run long enough for a statistically sufficient sample. Compare a primary KPI (CTR, conversion); adopt B only if the difference is statistically significant. Watch for novelty effects, contamination between groups and stopping too early.',
        topics: ['exploration'],
      },
      {
        id: 'e24-6',
        number: 'Q6',
        title: 'Evaluating recommender systems',
        points: 20,
        type: 'essay',
        prompt:
          '(a) List the three main evaluation strategies and discuss benefits/drawbacks. (b) Ways to split data for offline accuracy measurement — choose one and motivate it. (c) With numeric rating data, contrast rating prediction vs. ranking prediction and motivate a choice. (d) List five objectives you would continuously monitor and motivate them.',
        modelAnswer:
          '(a) Offline (replay logged data — cheap, repeatable, but only the past, biased data); online A/B (real behaviour and KPIs, but slow, costly, risk to users); user study (rich qualitative why, but small, expensive, lab ≠ real life).\n(b) Random holdout, cross-validation, sliding window. For time-stamped data choose the sliding window so the test set is always later than training — it avoids leaking the future.\n(c) Rating prediction estimates the numeric score (RMSE/MAE), order irrelevant; ranking prediction orders items (precision, NDCG, MRR), order is everything. Even with numeric data, ranking better reflects what the user experiences, so prefer ranking for top-N delivery.\n(d) CTR (engagement), dwell time (satisfaction), coverage, conversion (revenue), response time (scalability) — each measures a distinct stakeholder concern beyond raw accuracy.',
        topics: ['evaluation'],
      },
      {
        id: 'e24-7',
        number: 'Q7',
        title: 'Hybrid recommender systems',
        points: 5,
        type: 'essay',
        prompt:
          '(a) What is the advantage of a hybrid recommender system? (b) Three models estimate a rating as A=0.8, B=0.7, C=0.4. Describe how you would combine them and why.',
        modelAnswer:
          '(a) A hybrid combines complementary methods so each one’s strengths cover the others’ weaknesses — most importantly covering cold-start gaps and usually improving accuracy.\n(b) Use a weighted average: score = wₐ·0.8 + w_b·0.7 + w_c·0.4 with Σw = 1. Equal weights give (0.8+0.7+0.4)/3 ≈ 0.63. If one method is more reliable for this user/context, give it a larger weight; the weights can be tuned/learned on validation data.',
        topics: ['hybrid'],
      },
      {
        id: 'e24-8',
        number: 'Q8',
        title: 'Context-awareness',
        points: 5,
        type: 'essay',
        prompt:
          '(a) List two contextual dimensions you would consider. (b) Defining contextual features causes a scalability problem — describe how you would control the number of features of one dimension.',
        modelAnswer:
          '(a) Time (hour of day / weekday / season) and social setting (alone, with partner, with family, group). Location and device are also valid.\n(b) Each dimension multiplies the number of contexts, splitting the data thin. Control it with a hierarchy: model the dimension at a coarser granularity (e.g. 24 hours → 4 day-parts, 365 days → 4 seasons) so each context bucket still has enough ratings to learn from.',
        topics: ['context'],
      },
      {
        id: 'e24-9',
        number: 'Q9',
        title: 'Ethics in social media',
        points: 6,
        type: 'essay',
        prompt:
          '(a) List three problems that can arise from recommender systems in social media. (b) How can societies restrict negative consequences of personalisation? List two strategies and motivate them.',
        modelAnswer:
          '(a) Filter bubbles / echo chambers; amplification of misinformation; polarisation through outrage-driven engagement (also: addictive design, popularity bias).\n(b) Diversity/serendipity objectives baked into ranking so feeds are not single-minded; transparency, explanations and user controls so people can see and steer personalisation. Regulation and independent auditing also help mitigate societal harm.',
        topics: ['ethics'],
      },
      {
        id: 'e24-10',
        number: 'Q10',
        title: 'Personalised vacation recommender',
        points: 20,
        type: 'essay',
        prompt:
          'A tourist recommender with 5 cities × 3 accommodation types × 3 meal options. (a) How many items? (b) How would you recommend to a new user given 10 years of interactions? (c) Describe two personalised algorithms you would employ. (d) Outline a context-aware approach where social setting determines accommodation. (e) How would you evaluate success?',
        modelAnswer:
          '(a) 5 × 3 × 3 = 45 items.\n(b) New user = user cold start: serve a most-popular / popularity baseline, optionally with onboarding questions, until enough interactions accumulate.\n(c) Collaborative filtering (neighbourhood or matrix factorization) over the 10 years of interactions; content-based filtering using item features (city, accommodation, meals) for cold items and explainability. A hybrid of the two is ideal.\n(d) Add social setting as a context dimension. Pre-filter or model contextually: learn that families value apartments, couples value hotels, etc., and condition the recommendation on the declared social setting.\n(e) Offline accuracy first (ranking metrics on held-out, temporally split data), then an online A/B test on booking conversion; monitor beyond-accuracy goals (coverage, diversity, satisfaction).',
        topics: ['foundations', 'collaborative', 'context', 'evaluation'],
      },
      {
        id: 'e24-11',
        number: 'Q11',
        title: 'Personalisation in a chosen domain',
        points: 7,
        type: 'essay',
        prompt:
          'Pick a domain and describe how a recommender system would affect user engagement. Outline risks and benefits of introducing personalisation.',
        modelAnswer:
          'Example — music streaming. Benefits: faster discovery, higher engagement and retention, exposure for long-tail artists, a tailored experience. Risks: filter bubbles / over-specialisation, popularity bias crowding out niche artists, reduced serendipity, privacy concerns over listening history, and possible addictive over-engagement. A good answer names a concrete domain and balances both sides.',
        topics: ['ethics', 'foundations'],
      },
      {
        id: 'e24-12',
        number: 'Q12',
        title: 'Diagnosing rising churn',
        points: 4,
        type: 'essay',
        prompt:
          'Churn has increased and the controller suspects the recommender gives unfitting suggestions. How would you find out whether this is the case?',
        modelAnswer:
          'Investigate with data. Compare engagement metrics (CTR, dwell time, satisfaction) of churned vs. retained users. Run an A/B test of the current recommender against an alternative or a simple baseline and see whether churn differs. Inspect offline metrics for drift, check beyond-accuracy issues (low diversity, stale recommendations), and survey churned users. If churn drops under the alternative, the recommender is implicated; otherwise look elsewhere (price, UX).',
        topics: ['evaluation', 'exploration'],
      },
    ],
  },

  // ======================================================================
  {
    id: 'exam-2024-resit',
    title: 'Spring 2024 — re-sit exam',
    date: '10 August 2024',
    support: 'No support material; basic calculator allowed',
    note: 'Lecturer Benjamin Kille. Current syllabus.',
    questions: [
      {
        id: 'r24-1',
        number: 'Q1',
        title: 'Components & RS vs. IR',
        points: 8,
        type: 'essay',
        prompt:
          '(a) List the essential components of a recommender system and describe how they work together. (b) What is the difference between a recommender system and an information retrieval system?',
        modelAnswer:
          '(a) Users, items, observed interactions/feedback, and a recommendation model. The model learns patterns from the historical user–item interactions, builds a representation of the requesting user, scores unseen items and returns the top-N.\n(b) A recommender proactively pushes personalised items with no query; an IR system (search engine) takes an explicit query and pulls back matching documents, often the same for everyone.',
        topics: ['foundations'],
      },
      {
        id: 'r24-2',
        number: 'Q2',
        title: 'Content-based filtering for books',
        points: 16,
        type: 'essay',
        prompt:
          '(a) Pick three features for a book recommender and describe how to represent them (feature X, values Y, reason Z). (b) Given item representations xⱼ and a user profile, describe how to compute the estimate for a (user, item) pair. (c) Conditions under which CBF cannot be applied and the risks of relying only on CBF.',
        modelAnswer:
          '(a) Genre (categorical: fiction/non-fiction/textbook — captures broad taste); author (categorical — readers follow authors); description text (TF-IDF or BERT embedding — captures fine-grained topic).\n(b) Aggregate the liked items’ feature vectors into a user profile; compute cosine similarity between the profile and xⱼ; rank candidates by similarity.\n(c) CBF cannot place a brand-new user (no profile) and needs describable item features. Risks: over-specialisation / filter bubble, low serendipity, ignores community taste and quality signals.',
        topics: ['content-based'],
      },
      {
        id: 'r24-3',
        number: 'Q3',
        title: 'Collaborative filtering — neighbourhood & cosine',
        points: 22,
        type: 'essay',
        prompt:
          '(a) Explain how neighbourhood-based CF works. (b) Difference between user-based and item-based, and when to choose each. (c) Rating matrix (1–10) — estimate Emma’s preference for Dragon Fruit using cosine similarity; which user is most similar? (d) Why is the given matrix unrealistic? (e) What user-experience advantage do MF latent factors give?',
        modelAnswer:
          '(a) Compute similarities between users (or items), pick the k nearest neighbours, predict an unrated cell as a similarity-weighted average of neighbour ratings, rank and return top-N.\n(b) User-based finds similar users; item-based finds similar items and uses the target user’s own ratings. Choose user-based when items churn fast (news); item-based when items are stable and you want precomputed, scalable, attack-resistant similarities.\n(c) Compute cosine between Emma’s rating vector and each other user (over co-rated items), pick the highest, and predict Dragon Fruit as the similarity-weighted average of neighbours’ Dragon-Fruit ratings.\n(d) A real rating matrix is extremely sparse — most cells empty — whereas the given one is fully filled.\n(e) Latent factors let the system generalise and scale; for the user this means fast, robust recommendations even under sparsity, and discovery of non-obvious matches.',
        topics: ['collaborative'],
      },
      {
        id: 'r24-4',
        number: 'Q4',
        title: 'Collaborative filtering — MCQ',
        points: 2,
        type: 'mcq',
        prompt: 'Which of the following statements is FALSE?',
        options: [
          'Collaborative Filtering can employ feature embeddings of users or items.',
          'Both Matrix Factorization and kNN methods struggle with new items.',
          'Collaborative Filtering can be understood as a graph completion problem.',
          'Collaborative Filtering can be applied irrespective of the domain as long as there is a rating matrix.',
        ],
        answer: 1,
        modelAnswer:
          'The false statement targeted here concerns new items: while both MF and kNN do struggle with new items in their basic form, the exam’s intended false option is the over-broad claim. The other three statements (embeddings, graph-completion view, domain-agnostic given a rating matrix) are all true of CF.',
        topics: ['collaborative'],
      },
      {
        id: 'r24-5',
        number: 'Q5',
        title: 'Exploration/exploitation & A/B / A/A tests',
        points: 9,
        type: 'essay',
        prompt:
          '(a) Explain the choices "Explore" and "Exploit". (b) How do A/B tests address the trade-off, and what must organisations consider for meaningful results? (c) How does an A/A test differ from an A/B test and what is learned from it?',
        modelAnswer:
          '(a) Exploit = recommend the option with the best known estimated reward (short-term gain); Explore = try uncertain options to gather information (may reveal something better).\n(b) Randomly split traffic into control/treatment, run long enough for a statistically sufficient sample, compare the KPI. Consider sample size/power, statistical significance, novelty effects, contamination between groups, and multiple-testing inflation.\n(c) An A/A test gives both groups the same system; there should be no significant difference. It validates the experiment pipeline — a "significant" A/A result reveals a biased split or measurement.',
        topics: ['exploration'],
      },
      {
        id: 'r24-6',
        number: 'Q6',
        title: 'Evaluation strategies & data splitting',
        points: 20,
        type: 'essay',
        prompt:
          '(a) Explain offline evaluation, online experiment and user study with advantages/disadvantages. (b) Describe train/validation/test split, sliding window and cross-validation and compare them. (c) For numeric preferences, is rating or ranking prediction the better fit? (d) For a social-media platform, list three "beyond accuracy" goals and define quantitative measurements.',
        modelAnswer:
          '(a) Offline: replay logged data — cheap, repeatable, but biased and no real reaction. Online: A/B on live traffic — true behaviour, but slow, costly, risky. User study: observe participants — rich qualitative insight, but small and artificial.\n(b) Holdout split = simple but ignores time; cross-validation = uses all data and gives variance, but k× compute; sliding window = respects chronology, the realistic choice for time-stamped data.\n(c) Both are possible, but ranking prediction better reflects the delivered top-N experience.\n(d) Diversity (intra-list dissimilarity), coverage (fraction of catalogue ever recommended), creator fairness (Gini of exposure across creators); each defined as a concrete numeric measure.',
        topics: ['evaluation'],
      },
      {
        id: 'r24-7',
        number: 'Q7',
        title: 'Hybrid systems & fallback',
        points: 6,
        type: 'essay',
        prompt:
          '(a) Describe how the scores of CF and CBF can be combined for the same user-item pair. (b) Why is a fallback recommender necessary and what are three candidates?',
        modelAnswer:
          '(a) Combine via a weighted average score = w₁·s_CF + w₂·s_CBF (weights tuned on validation), or a switching rule (use CBF for cold items/users, CF otherwise), or feed both as features into a learned meta-model.\n(b) A fallback guarantees a recommendation when the main models fail — chiefly cold start. Candidates: most-popular (optionally recency-weighted), trending/most-recent, content-based, or random as a last resort.',
        topics: ['hybrid'],
      },
      {
        id: 'r24-8',
        number: 'Q8',
        title: 'Context-awareness & counting contexts',
        points: 9,
        type: 'essay',
        prompt:
          '(a) Describe two contextual dimensions and their values. (b) Advantages/disadvantages of pre-filtering vs. post-filtering. (c) Dimensions A=12, B=15, C=180 values — how many contexts? How would you reduce it so pre-filtering is sensible?',
        modelAnswer:
          '(a) Time (morning/afternoon/evening/night) and social setting (alone/partner/family/group).\n(b) Pre-filtering trains a model per context — perfectly tailored but data-sparse and many models to maintain. Post-filtering keeps one well-trained model and re-ranks for context — robust but the base model is context-blind, so the adjustment is heuristic.\n(c) 12 × 15 × 180 = 32 400 contexts. Reduce by coarsening dimension C up its hierarchy (180 → e.g. 4 seasons), giving 12 × 15 × 4 = 720 — each context then has far more data.',
        topics: ['context'],
      },
      {
        id: 'r24-9',
        number: 'Q9',
        title: 'Ethics & a food recommender',
        points: 8,
        type: 'essay',
        prompt:
          '(a) How can news recommenders affect society? List three effects and mitigations. (b) Design a recipe recommender (users cook recipes and rate them) — method, evaluation, and why.',
        modelAnswer:
          '(a) Filter bubbles (→ inject diversity), misinformation amplification (→ source quality signals, fact-checking), polarisation (→ optimise long-term satisfaction not raw clicks, add transparency).\n(b) Collaborative filtering on the explicit recipe ratings, hybridised with content-based filtering (ingredients, cuisine, difficulty) for cold items. Evaluate offline with a temporal split and rating + ranking metrics, then an online A/B test; monitor diversity and coverage so users are not stuck with the same cuisine. Explicit ratings justify CF; content features handle cold start.',
        topics: ['ethics', 'collaborative', 'evaluation'],
      },
    ],
  },

  // ======================================================================
  {
    id: 'exam-2025',
    title: 'Spring 2025 — exam',
    date: '22 May 2025',
    support: 'No support material; basic calculator allowed',
    note: 'Lecturer Benjamin Kille. Most recent paper — note the random-walk-with-restart question.',
    questions: [
      {
        id: 'e25-1',
        number: 'Q1',
        title: 'Personalised RS & RS vs. IR',
        points: 5,
        type: 'essay',
        prompt:
          '(a) Define "personalised recommender system". (b) What is the difference between a non-personalised recommender system and an information retrieval system?',
        modelAnswer:
          '(a) A personalised recommender system suggests a subset of a large item collection to a given user such that different users receive different recommendations.\n(b) Both a non-personalised recommender and an IR system are non-individualised, but a recommender proactively pushes items to the user, whereas an IR system takes a query and returns documents (pull).',
        topics: ['foundations'],
      },
      {
        id: 'e25-2',
        number: 'Q2',
        title: 'Content-based filtering & cosine',
        points: 20,
        type: 'essay',
        prompt:
          '(a) List three representations for books as items. (b) A user bought books j₁=[1,0,3,2,0], j₂=[2,1,0,1,4], j₃=[0,3,2,0,1]. Candidates j₄=[1,1,2,1,1], j₅=[4,0,0,5,3]. Which candidate matches the user better (cosine similarity)? (c) Can CBF alleviate the cold-start problem?',
        modelAnswer:
          '(a) Categories (fiction, non-fiction, textbook…), TF-IDF of the description, or embeddings (e.g. BERT).\n(b) Norms: ‖j₁‖=3.74, ‖j₂‖=4.69, ‖j₃‖=3.74, ‖j₄‖=2.83, ‖j₅‖=7.07. cos(j₁,j₄)=0.85, cos(j₂,j₄)=0.60, cos(j₃,j₄)=0.76 → avg 0.74. cos(j₁,j₅)=0.53, cos(j₂,j₅)=0.75, cos(j₃,j₅)=0.11 → avg 0.46. Book j₄ is the better fit.\n(c) Cold start = the system lacks information about a user or item. CBF handles *item* cold start by using item features to find similarities, but cannot alleviate *user* cold start.',
        topics: ['content-based'],
      },
      {
        id: 'e25-3',
        number: 'Q3',
        title: 'Collaborative filtering & matrix factorization',
        points: 17,
        type: 'essay',
        prompt:
          '(a) Describe item-based CF with the neighbourhood approach (10 neighbours, top-5 objective), step by step. (b) Given user and item factor matrices, determine the three best items for User 1 = [0.90, 0.30, 0.20] and report the ranked scores.',
        modelAnswer:
          '(a) Associate the request with a user; with rating matrix Y and an item-similarity function s(i,j) (cosine/Pearson) compute the item–item similarity matrix S. For each item the user has not rated, look up its similarity to the items the user *has* rated, take the 10 most similar (truncate if fewer), estimate the rating as the similarity-weighted average of the user’s own ratings, sort all estimates descending and return the top 5.\n(b) Dot product of User 1 with each item: Item1=0.950, Item2=0.855, Item3=0.770, Item4=0.605, Item5=0.670, Item6=0.610, Item7=0.520, Item8=0.665. Top three: Item 1 (0.950), Item 2 (0.855), Item 3 (0.770).',
        topics: ['collaborative'],
      },
      {
        id: 'e25-4',
        number: 'Q4',
        title: 'Exploration/exploitation — MCQ',
        points: 2,
        type: 'mcq',
        prompt: 'Which of the following statements is TRUE?',
        options: [
          'Exploitation strategies always lead to better long-term performance than exploration.',
          'Multi-armed bandit algorithms solve the dilemma by eliminating exploration entirely.',
          'Thompson sampling is a probabilistic approach that balances exploration and exploitation by sampling from the posterior distribution of expected rewards.',
          'Pure exploration strategies maximise short-term user satisfaction.',
        ],
        answer: 2,
        modelAnswer:
          'Option (c) is correct. Thompson sampling keeps a posterior per arm, samples from each and picks the highest sample — probabilistic explore/exploit balancing. (a) is false (exploit-only can get stuck); (b) is false (bandits balance, not eliminate, exploration); (d) is false (pure exploration sacrifices short-term satisfaction).',
        topics: ['exploration'],
      },
      {
        id: 'e25-5',
        number: 'Q5',
        title: 'Monitoring & metrics',
        points: 13,
        type: 'essay',
        prompt:
          '(a) Describe random split, cross-validation and sliding window. (b) A system has MAE = 0.2 (scale 0–5) and MRR = 0.2 — which better reflects accuracy? Motivate. (c) List five objectives measuring different aspects.',
        modelAnswer:
          '(a) Random split: fill train/validation/test randomly by proportion. Cross-validation: partition into k folds, each fold is the test set once, report the distribution. Sliding window: order data chronologically, train on a window, test on the next slice, shift forward.\n(b) MRR reflects user satisfaction better. The low MAE shows scores are well approximated, but MRR = 0.2 means the first relevant item is on average around rank 5 — the system struggles to put relevant items at the top.\n(c) Click rate (engagement), dwell time (satisfaction), coverage (catalogue access), conversion rate (revenue), response time (scalability).',
        topics: ['evaluation'],
      },
      {
        id: 'e25-6',
        number: 'Q6',
        title: 'Hybrid recommenders',
        points: 7,
        type: 'essay',
        prompt:
          '(a) Motivate the need for simple, barely-personalised methods and describe one. (b) Five methods A–E give estimates for two items, with some N/A. Describe how you would combine the estimates.',
        modelAnswer:
          '(a) Simple methods act as a baseline / fallback: they always return a recommendation even when sophisticated models fail (e.g. cold start). A good choice is a most-popular baseline that weights recent interactions higher.\n(b) Ignore methods that return N/A for an item — N/A expresses no preference, not a zero. Combine the remaining estimates with a weighted average, or use a voting scheme over which item each method prefers; here methods favouring item 2 outvote those favouring item 1.',
        topics: ['hybrid'],
      },
      {
        id: 'e25-7',
        number: 'Q7',
        title: 'Literature-review recommender',
        points: 16,
        type: 'essay',
        prompt:
          '(a) Balance recency vs. citation count when ranking articles — discuss implications. (b) Describe two article representations with pros/cons. (c) Why are context-aware recommenders NOT a good fit here? (d) What would you monitor for long-term user satisfaction?',
        modelAnswer:
          '(a) Recent articles show cutting-edge trends; highly-cited articles are authoritative — but the two conflict, since citations take time. Use a hybrid that mixes a recency-focused and a citation-popularity recommender so the list contains both fresh and established work.\n(b) Keywords: each keyword a dimension of a preference vector — cheap and simple, but suffers from synonymy. Title+abstract embeddings from a language model: capture semantics and find articles keywords miss, but are costlier and depend on the chosen model.\n(c) Article relevance to a research interest does not depend on the student’s time, location or mood — context adds sparsity without benefit.\n(d) Whether recommended articles end up cited in the final thesis, plus engagement signals (return rate, click rate, dwell time) across research fields.',
        topics: ['content-based', 'hybrid', 'context', 'evaluation'],
      },
      {
        id: 'e25-8',
        number: 'Q8',
        title: 'Popularity bias & diversity',
        points: 5,
        type: 'essay',
        prompt:
          '(a) Explain why recommender systems exacerbate popularity bias. (b) Why does a random recommender optimise diversity, and why would we still not use it?',
        modelAnswer:
          '(a) Facing user cold start, systems fall back to the most popular items; showing them increases their exposure and interactions, which makes them look even more popular — a self-reinforcing loop, while the long tail gets no attention.\n(b) A random recommender gives every item a non-zero chance, so it covers the whole catalogue and maximises diversity. But it discards all the preference information in the rating matrix, so most recommendations are irrelevant — diversity must come *with* relevance.',
        topics: ['ethics'],
      },
      {
        id: 'e25-9',
        number: 'Q9',
        title: 'Random walk with restart on a bipartite graph',
        points: 13,
        type: 'essay',
        prompt:
          '(a) Explain how random walk with restart (RWR) can be used for item recommendation on a bipartite user-item graph. (b) How can computational cost be kept in check when adding nodes?',
        modelAnswer:
          '(a) Model users and items as the two node sets of a bipartite graph, with observed interactions as edges. Start the walk at the target user; at each step, with probability α restart at that user, otherwise move to a random neighbour. Use a low α to encourage exploration. The walk alternates user→item→user…; count visits to each item node. After a fixed budget, normalise the item visit counts, drop items the user already knows, and rank items by their normalised scores.\n(b) When adding an item, rerun the walk with a low budget focused on that item — if it is well connected it will be visited. For a new user, wait until at least one edge exists, then use the visit frequencies of users linked to that item as a proxy. This avoids recomputing the whole stationary distribution.',
        topics: ['collaborative'],
      },
    ],
  },

  // ======================================================================
  {
    id: 'exam-2022',
    title: 'Spring 2022 — exam',
    date: '12 May 2022',
    support: 'All support material allowed',
    note: 'Older syllabus. Semantic-web / SPARQL questions are omitted — that material is not in the current 12-lecture course.',
    questions: [
      {
        id: 'e22-1',
        number: 'Q1',
        title: 'Long-tail property',
        points: 10,
        type: 'essay',
        prompt:
          'Long tail: only a small fraction of items are rated frequently, most rarely. (a) Two consequences of not handling it, with explanation. (b) How does the long tail affect recommender performance, and why?',
        modelAnswer:
          '(a) Lack of diversity — recommendations concentrate on a few popular items. Biased recommendations — popular items dominate so niche items and niche tastes are under-served, reinforcing popularity bias.\n(b) The long tail increases sparsity: most items have very few ratings, so similarity and rating estimates for them are unreliable, and frequently-rated items dominate peer-group selection and rating prediction — degrading neighbourhood-model performance.',
        topics: ['ethics', 'evaluation'],
      },
      {
        id: 'e22-4',
        number: 'Q4',
        title: 'TF-IDF',
        points: 9,
        type: 'essay',
        prompt:
          '(a) How is TF-IDF useful for recommender systems? (b) Given relative word frequencies, compute the TF-IDF of "Computer" and "The" for Document 2 (Computer: 0.2,0.05,0,0; The: 0.5,0.6,0.4,0.5).',
        modelAnswer:
          '(a) TF-IDF captures how important a word is to a document relative to the collection, turning text into numeric vectors so item similarities can be computed in content-based filtering.\n(b) Using relative-frequency TF and IDF = log(N / docs-with-term): "Computer" appears in 2 of 4 documents → IDF = log₂(4/2) = 1, TF-IDF = 0.05 × 1 ≈ 0.05. "The" appears in all 4 documents → IDF = log(4/4) = 0, TF-IDF = 0.6 × 0 = 0. State your log base and TF variant.',
        topics: ['content-based'],
      },
      {
        id: 'e22-5',
        number: 'Q5',
        title: 'Group project — data & ethics',
        points: 10,
        type: 'essay',
        prompt:
          '(a) What additional data would you collect for a news recommender, and why? (b) What ethical considerations apply to a news recommender?',
        modelAnswer:
          '(a) Share counts (social/mail/messaging) as a strong implicit interest signal; demographic data (age, gender, occupation) for profiling; explicit feedback; location and other contextual information — each adds signal for better personalisation.\n(b) Privacy of sensitive reading history; misinformation amplification; bias (popularity / viewpoint); filter bubbles and polarisation. A good answer also reflects on whether the project itself adequately addresses these.',
        topics: ['ethics', 'foundations'],
      },
      {
        id: 'e22-6',
        number: 'Q6',
        title: 'BERT vs. word embeddings',
        points: 6,
        type: 'essay',
        prompt:
          '(a) Difference between Transformers such as BERT and word embeddings. (b) How can BERT support recommender systems?',
        modelAnswer:
          '(a) Static word embeddings assign one fixed vector per word regardless of context; BERT (a Transformer) produces context-dependent representations using self-attention (e.g. 12 attention heads), is reusable for many tasks, and handles out-of-vocabulary tokens via subwords.\n(b) BERT translates textual item content (descriptions, reviews, articles) into rich numeric representations for content-based filtering.',
        topics: ['content-based'],
      },
      {
        id: 'e22-7',
        number: 'Q7',
        title: 'User feedback',
        points: 8,
        type: 'essay',
        prompt:
          'Designing a music recommender. (a) Which two types of feedback would you collect? (b) Why these? (c) Does the feedback type affect the recommender method you choose?',
        modelAnswer:
          '(a) Implicit feedback (play counts, skips) and explicit feedback (a 1–5 rating or like/dislike).\n(b) Implicit feedback is abundant and cheap and reflects real behaviour; explicit feedback is sparse but unambiguous. Together they balance coverage and accuracy.\n(c) Yes. Numeric ratings suit rating prediction (RMSE/MAE); implicit/unary signals suit ranking / top-N with positive-only learning. The feedback type drives the task framing and the metrics.',
        topics: ['foundations'],
      },
      {
        id: 'e22-8',
        number: 'Q8',
        title: 'Context-awareness & time hierarchy',
        points: 8,
        type: 'essay',
        prompt:
          '(a) Modelling the time context: what role do hierarchies play, and list three levels for a music recommender. (b) Trade-off between considering many contextual aspects and performance.',
        modelAnswer:
          '(a) Hierarchies control the sparsity of a context-aware system: when a fine-grained context has too few ratings you aggregate to a coarser level. Three time levels: hour of day (intra-day variation), weekday (working days vs. weekend), season (long cycles).\n(b) Contextual information improves relevance, but too many dimensions reduce the data points per specific situation; the system then ignores valuable information and performance drops.',
        topics: ['context'],
      },
      {
        id: 'e22-9',
        number: 'Q9',
        title: 'Evaluating a music recommender',
        points: 16,
        type: 'essay',
        prompt:
          '(a) Plan the evaluation before deployment — what metrics and why? (b) After deployment you run an A/B test — why, and what would you evaluate?',
        modelAnswer:
          '(a) Evaluate offline first on a temporally split dataset. Choose metrics by task: ranking metrics (precision/recall, NDCG, MRR) for top-N delivery, rating metrics (RMSE/MAE) if predicting scores. Also report beyond-accuracy goals: coverage, diversity, novelty.\n(b) An A/B test measures real user behaviour that offline replay cannot — it confirms the offline winner on live KPIs (CTR, listening time, retention) and detects effects like novelty. Compare the new recommender against the current one on these business metrics.',
        topics: ['evaluation', 'exploration'],
      },
      {
        id: 'e22-10',
        number: 'Q10',
        title: 'Attacks',
        points: 7,
        type: 'essay',
        prompt:
          '(a) An adversary launches a push attack — what could be the intention? (b) Which CF method could prevent such an attack, and why?',
        modelAnswer:
          '(a) To amplify a target item’s popularity so the system recommends it more often.\n(b) Item-based collaborative filtering. It is generally harder to attack because it leverages the genuine target user’s own ratings to make predictions, and an attacker cannot inject ratings into a real user’s account. User-based CF, by contrast, relies on a neighbourhood that fake profiles can join.',
        topics: ['attacks', 'collaborative'],
      },
      {
        id: 'e22-11',
        number: 'Q11',
        title: "Kendall's rank correlation",
        points: 6,
        type: 'essay',
        prompt:
          'Compute Kendall’s rank correlation coefficient for the posts recommended to Ingrid (5 posts; her interest order differs from the recommended order).',
        modelAnswer:
          'Enumerate posts 1–5 by recommended order; for every pair check whether the recommended order matches the ground-truth (interest) order: +1 if concordant, −1 if discordant. Sum the pairwise scores and divide by n(n−1)/2 = 10. For Ingrid the sum was 1, giving τ = 1/10 = 0.1.',
        topics: ['evaluation'],
      },
      {
        id: 'e22-12',
        number: 'Q12',
        title: 'Reciprocal hit rate',
        points: 6,
        type: 'essay',
        prompt: 'What is the (average) reciprocal hit rate for the recommendations to Ingrid?',
        modelAnswer:
          'ARHR(u) = Σ 1/vⱼ over the ranks vⱼ of the items the user engaged with. Ingrid engaged with items at ranks 4, 2 and 1, so ARHR = 1/4 + 1/2 + 1/1 = 1.75.',
        topics: ['evaluation'],
      },
    ],
  },

  // ======================================================================
  {
    id: 'exam-2023',
    title: 'Spring 2023 — exam',
    date: '12 May 2023',
    support: 'No support material; basic calculator allowed',
    note: 'Older syllabus. The semantic-web question is omitted — not part of the current course.',
    questions: [
      {
        id: 'e23-1',
        number: 'Q1',
        title: 'Context-awareness — matching',
        points: 6,
        type: 'mcq',
        prompt:
          'Match the description to the approach. Which approach "builds a separate model for each context"?',
        options: ['Contextual modelling', 'Pre-filtering', 'Post-filtering'],
        answer: 1,
        modelAnswer:
          'Pre-filtering builds a separate model per context. "Integrates the context into the model" = contextual modelling. "Re-ranks the recommendations for the context" = post-filtering.',
        topics: ['context'],
      },
      {
        id: 'e23-2',
        number: 'Q2',
        title: 'TF-IDF calculation',
        points: 10,
        type: 'essay',
        prompt:
          '(a) Explain what TF-IDF is and why it is used. (b) Collection of 130 articles. "cloud": 7 times in article a1, in 21 articles. "office": 2 times in a1, in 55 articles. Compute the TF-IDF values and explain what they mean.',
        modelAnswer:
          '(a) TF-IDF (term frequency × inverse document frequency) weights each word by its importance to a document relative to the collection; in content-based recommenders it weights words in item descriptions.\n(b) TF-IDF(cloud, a1) = 7 × log₁₀(130/21) = 7 × 0.79 ≈ 5.53. TF-IDF(office, a1) = 2 × log₁₀(130/55) = 2 × 0.374 ≈ 0.75. "cloud" has the higher weight, so it is more central to the topic of article a1 than "office".',
        topics: ['content-based'],
      },
      {
        id: 'e23-3',
        number: 'Q3',
        title: 'Content-based filtering — multi-select',
        points: 8,
        type: 'mcq',
        prompt:
          'Which single statement is CORRECT about content-based filtering? (The original was multi-select; pick the clearly correct one.)',
        options: [
          'Gini index is an unsupervised feature-selection approach.',
          'Classification algorithms can be used to learn user profiles in content-based recommenders.',
          'Most online data is structured.',
          'Euclidean distance cannot be used to compare items.',
        ],
        answer: 1,
        modelAnswer:
          'Classification algorithms can learn a user profile (liked vs. disliked) in CBF — correct. The original exam also accepted: cosine/Euclidean are used for item similarity; Gini index reflects a word’s discriminative power on ratings; preprocessing of text is necessary. False statements: most online data is *un*structured, and the Gini phrasing about being purely "unsupervised" is misleading.',
        topics: ['content-based'],
      },
      {
        id: 'e23-4',
        number: 'Q4',
        title: 'Matrix factorization — MCQ',
        points: 4,
        type: 'mcq',
        prompt:
          'A movie recommender uses matrix factorization. You split the data by holding out some whole users and whole movies into the test set. Why won’t this work?',
        options: [
          'You will be committing multiple testing.',
          'Matrix factorization is unsupervised and cannot be evaluated with a test set.',
          'The training data will contain examples from the future.',
          'The model will not learn representations during training for the users and movies in the test set.',
        ],
        answer: 3,
        modelAnswer:
          'Matrix factorization only learns latent vectors for users and items seen in training. Whole users/items held out have no learned factors, so r̂ = p·q is undefined for them. Hold out individual ratings instead.',
        topics: ['collaborative', 'evaluation'],
      },
      {
        id: 'e23-5',
        number: 'Q5',
        title: 'Attacks — MCQ',
        points: 5,
        type: 'mcq',
        prompt: 'Which statement about attacks in recommender systems is WRONG?',
        options: [
          'Automated attacks can be prevented by using CAPTCHAs.',
          'Submitting malicious negative reviews for a product is called a nuke attack.',
          'A popular attack is a type of push attack which uses popular items as filler items.',
          'The effectiveness of an attack is independent of the type of recommendation algorithm.',
        ],
        answer: 3,
        modelAnswer:
          'The wrong statement is that effectiveness is independent of the algorithm — it depends heavily on it (item-based CF, for instance, resists push attacks far better than user-based CF). The other three statements are correct.',
        topics: ['attacks'],
      },
      {
        id: 'e23-6',
        number: 'Q6',
        title: 'Evaluation of recommender systems',
        points: 16,
        type: 'essay',
        prompt:
          '(a) Give two evaluation goals and explain them. (b) Differences between rating-prediction and ranking metrics and which goals they meet; name two examples of each and what they measure.',
        modelAnswer:
          '(a) Two of: accuracy (predictions match preferences), coverage (fraction of catalogue recommendable), novelty (recommends unknown items), serendipity (surprising yet relevant), diversity (items unlike each other).\n(b) Rating prediction measures how close predicted scores are to actual ratings; order is irrelevant. Ranking measures the quality of the ordered top-N; order is everything. Rating metrics: RMSE and MAE (average error magnitude). Ranking metrics: precision/recall, NDCG, MRR, Kendall, Spearman (relevance and position of items in the list).',
        topics: ['evaluation'],
      },
      {
        id: 'e23-7',
        number: 'Q7',
        title: 'Hybrid recommender systems — MCQ',
        points: 5,
        type: 'mcq',
        prompt: 'Which statement about hybrid recommender systems is WRONG?',
        options: [
          'Hybrid recommender systems aim to take advantage of the strengths of various methods.',
          'Evaluating hybrid recommender systems is usually easier.',
          'Switching hybrids are part of ensemble design and handle the cold-start problem better.',
          'Ensemble design combines the output of different recommender algorithms into a single output.',
        ],
        answer: 1,
        modelAnswer:
          'Evaluating hybrids is usually *harder*, not easier — more components and interactions to assess. The other three statements correctly describe hybrid systems.',
        topics: ['hybrid'],
      },
      {
        id: 'e23-9',
        number: 'Q9',
        title: 'Challenges of recommender systems — matching',
        points: 8,
        type: 'mcq',
        prompt:
          'Match the definition to the challenge. "When a new user is introduced, it is not possible to generate recommendations for that user."',
        options: ['Serendipity', 'Gray sheep problem', 'Cold start', 'Data sparsity'],
        answer: 2,
        modelAnswer:
          'Cold start = a new user/item with no interactions. "Not enough ratings from users" = data sparsity. "Users whose preferences don’t consistently agree/disagree with any group" = gray sheep. "Recommends items similar to those already recommended" relates to (lack of) serendipity.',
        topics: ['foundations', 'collaborative'],
      },
      {
        id: 'e23-10',
        number: 'Q10',
        title: 'Ethical aspects — bias',
        points: 12,
        type: 'essay',
        prompt:
          'Discuss bias from the recommender-systems perspective: how do you define bias, why is it a problem (with an example), and how can it be addressed?',
        modelAnswer:
          'Bias is a systematic skew in a recommender’s behaviour. It can be item-side — recommending some items more than their quality warrants (popularity bias) — or user-side — the user model serving some groups (e.g. men aged 18–25) better than others. It is a problem because it produces unfair recommendations, entrenches filter bubbles and disadvantages users and item providers; e.g. niche creators never get exposure. Address it with debiasing algorithms, training on debiased / re-weighted data, diversity objectives, transparency and auditing.',
        topics: ['ethics'],
      },
      {
        id: 'e23-11',
        number: 'Q11',
        title: 'RMSE / MAE calculation',
        points: 10,
        type: 'essay',
        prompt:
          '(a) Given user ratings and predicted ratings, calculate MAE and RMSE. (b) Compare the two metrics — how do they differ and why?',
        modelAnswer:
          '(a) Compute each error e = predicted − actual. MAE = (Σ|e|)/|E|; RMSE = √((Σe²)/|E|). For the exam data, MAE = 12.7/11 ≈ 1.155 and RMSE ≈ 1.222.\n(b) RMSE squares errors before averaging, so it disproportionately penalises large errors; MAE treats every error linearly. RMSE ≥ MAE always, and the gap grows when a few predictions are badly off.',
        topics: ['evaluation'],
      },
    ],
  },
]

export const getExam = (id: string): Exam | undefined => EXAMS.find((e) => e.id === id)
