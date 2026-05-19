export interface ConceptQuestion {
  id: string
  topicId: string
  question: string
  options: string[]
  answer: number
  explanation: string
}

export const CONCEPT_QUESTIONS: ConceptQuestion[] = [
  // --- foundations ---------------------------------------------------------
  {
    id: 'f1',
    topicId: 'foundations',
    question: 'What best distinguishes a recommender system from an information retrieval system?',
    options: [
      'A recommender proactively pushes items; IR responds to an explicit query (pull).',
      'A recommender always uses deep learning; IR uses keyword matching.',
      'IR is personalised; recommenders are not.',
      'They are the same — both rank documents.',
    ],
    answer: 0,
    explanation:
      'Recommenders push personalised items at the user with no query; IR systems pull documents in response to a stated query.',
  },
  {
    id: 'f2',
    topicId: 'foundations',
    question: 'Which is the correct definition of a personalised recommender system?',
    options: [
      'A system that shows the same most-popular items to everyone.',
      'A system that suggests a subset of a large item collection so different users get different recommendations.',
      'A system that answers natural-language questions.',
      'A system that only ranks items by price.',
    ],
    answer: 1,
    explanation:
      'Personalisation means the output depends on the user — different users receive different recommendations.',
  },
  {
    id: 'f3',
    topicId: 'foundations',
    question: 'A streaming app logs only which songs were played — no ratings, no skips. Which framing fits?',
    options: [
      'Rating prediction evaluated with RMSE.',
      'Ranking / top-N with positive-only implicit feedback.',
      'It is impossible to build any recommender.',
      'Semantic reasoning over an ontology.',
    ],
    answer: 1,
    explanation:
      'Plays are unary implicit positives — there are no scores to predict, so frame it as top-N ranking.',
  },
  {
    id: 'f4',
    topicId: 'foundations',
    question: 'Which challenge does content-based filtering solve that collaborative filtering cannot?',
    options: [
      'User cold start',
      'Item cold start',
      'Gray sheep users',
      'Scalability',
    ],
    answer: 1,
    explanation:
      'A new item has feature values, so CBF can score it. Neither method solves user cold start on its own.',
  },

  // --- content-based -------------------------------------------------------
  {
    id: 'c1',
    topicId: 'content-based',
    question: 'What is the effect of the IDF factor in TF-IDF?',
    options: [
      'It boosts terms that appear in every document.',
      'It down-weights common terms and rewards rare, discriminative ones.',
      'It normalises document length.',
      'It counts how often a term appears in one document.',
    ],
    answer: 1,
    explanation:
      'IDF = log(N/df): a term in every document has IDF ≈ 0, a rare term gets a high IDF.',
  },
  {
    id: 'c2',
    topicId: 'content-based',
    question: 'What is the main limitation of pure content-based filtering?',
    options: [
      'It needs a large community of users.',
      'It cannot handle new items.',
      'Over-specialisation — it only recommends more of the same, with low serendipity.',
      'It cannot be explained.',
    ],
    answer: 2,
    explanation:
      'CBF stays inside the user’s known interests, producing a filter bubble with little novelty.',
  },
  {
    id: 'c3',
    topicId: 'content-based',
    question: 'How does BERT differ from static word embeddings such as word2vec?',
    options: [
      'BERT assigns one fixed vector per word regardless of context.',
      'BERT produces context-dependent representations using self-attention.',
      'Word embeddings are always more accurate.',
      'BERT cannot handle out-of-vocabulary tokens.',
    ],
    answer: 1,
    explanation:
      'Static embeddings give one vector per word; BERT’s representation depends on the surrounding sentence.',
  },
  {
    id: 'c4',
    topicId: 'content-based',
    question: 'Which is a valid way to represent items for content-based filtering?',
    options: [
      'Only the user’s rating history.',
      'TF-IDF vectors, categorical attributes, or embeddings.',
      'The number of other users who rated the item.',
      'A random hash of the item id.',
    ],
    answer: 1,
    explanation:
      'Items are represented by their features: structured attributes, TF-IDF of text, or learned embeddings.',
  },

  // --- collaborative -------------------------------------------------------
  {
    id: 'cf1',
    topicId: 'collaborative',
    question: 'What does collaborative filtering fundamentally require?',
    options: [
      'Rich textual descriptions of every item.',
      'A user–item rating (interaction) matrix.',
      'An ontology of the domain.',
      'Demographic data for every user.',
    ],
    answer: 1,
    explanation:
      'CF works from the rating matrix alone and is domain-agnostic as long as that matrix exists.',
  },
  {
    id: 'cf2',
    topicId: 'collaborative',
    question: '"Users who bought A also bought B" is the textbook description of which method?',
    options: [
      'User-based collaborative filtering',
      'Item-based collaborative filtering',
      'Content-based filtering',
      'Matrix factorization',
    ],
    answer: 1,
    explanation:
      'Item-based CF recommends items similar to ones the user already engaged with — and it is explainable.',
  },
  {
    id: 'cf3',
    topicId: 'collaborative',
    question: 'In matrix factorization, the predicted rating for (user, item) is computed as…',
    options: [
      'the cosine of their TF-IDF vectors.',
      'the dot product of the user and item latent-factor vectors.',
      'the average rating of the item.',
      'the Jaccard similarity of their neighbourhoods.',
    ],
    answer: 1,
    explanation:
      'MF gives each user and item an f-dimensional factor vector; r̂ = pᵤ · qᵢ.',
  },
  {
    id: 'cf4',
    topicId: 'collaborative',
    question: 'Why does holding out whole users and whole items into the test set break an MF evaluation?',
    options: [
      'It causes multiple testing.',
      'MF is unsupervised and cannot be tested.',
      'The model never learned factor vectors for those users/items, so it cannot score them.',
      'It puts the future into the training set.',
    ],
    answer: 2,
    explanation:
      'MF only learns latent vectors for users/items seen in training — hold out individual ratings instead.',
  },
  {
    id: 'cf5',
    topicId: 'collaborative',
    question: 'A "gray sheep" user is one who…',
    options: [
      'rates everything five stars.',
      'has preferences that do not consistently agree or disagree with any group.',
      'has never rated anything.',
      'only rates popular items.',
    ],
    answer: 1,
    explanation:
      'Gray sheep have idiosyncratic taste, so collaborative filtering finds no useful neighbourhood for them.',
  },

  // --- evaluation ----------------------------------------------------------
  {
    id: 'e1',
    topicId: 'evaluation',
    question: 'How does RMSE differ from MAE?',
    options: [
      'RMSE ignores large errors; MAE amplifies them.',
      'RMSE squares errors, so it disproportionately penalises large errors.',
      'They always give the same value.',
      'MAE can be negative; RMSE cannot.',
    ],
    answer: 1,
    explanation:
      'Because RMSE squares the errors before averaging, a few big mistakes weigh heavily; RMSE ≥ MAE always.',
  },
  {
    id: 'e2',
    topicId: 'evaluation',
    question: 'You have time-stamped interactions. Which data-splitting method avoids leaking the future?',
    options: [
      'Random holdout split',
      'Sliding-window (temporal) split',
      'Holding out whole users',
      'Any split works equally well',
    ],
    answer: 1,
    explanation:
      'A random split can put future events in training; a temporal sliding window keeps the test set strictly later.',
  },
  {
    id: 'e3',
    topicId: 'evaluation',
    question: 'Which metric belongs to ranking (top-N) evaluation rather than rating prediction?',
    options: ['RMSE', 'MAE', 'NDCG', 'Mean of squared residuals'],
    answer: 2,
    explanation:
      'NDCG, precision, recall, MRR and Kendall’s τ are ranking metrics; RMSE and MAE are rating-prediction metrics.',
  },
  {
    id: 'e4',
    topicId: 'evaluation',
    question: 'Serendipity as a beyond-accuracy goal means recommendations that are…',
    options: [
      'the most popular items.',
      'both surprising and relevant.',
      'identical to the user’s history.',
      'fastest to compute.',
    ],
    answer: 1,
    explanation:
      'Serendipity = pleasant surprise: items the user would not expect but still enjoys.',
  },
  {
    id: 'e5',
    topicId: 'evaluation',
    question: 'A key drawback of offline evaluation is that…',
    options: [
      'it is too expensive to run.',
      'it only measures past recorded behaviour and cannot capture real user reaction.',
      'it requires recruiting participants.',
      'it always overestimates response time.',
    ],
    answer: 1,
    explanation:
      'Offline replay is cheap and repeatable but only reflects historical, possibly biased, data.',
  },

  // --- exploration ---------------------------------------------------------
  {
    id: 'x1',
    topicId: 'exploration',
    question: 'In the explore/exploit trade-off, "exploit" means…',
    options: [
      'try items whose value is uncertain.',
      'recommend the option with the best known estimated reward.',
      'recommend items at random.',
      'never update the model.',
    ],
    answer: 1,
    explanation:
      'Exploit = cash in on the current best estimate; explore = sample uncertain options to learn.',
  },
  {
    id: 'x2',
    topicId: 'exploration',
    question: 'Which statement about Thompson sampling is correct?',
    options: [
      'It eliminates the need for exploration entirely.',
      'It always picks the arm with the highest current average.',
      'It samples from the posterior distribution of expected rewards to balance explore/exploit.',
      'It is a deterministic algorithm.',
    ],
    answer: 2,
    explanation:
      'Thompson sampling draws a value from each arm’s posterior and picks the highest sample — probabilistic balancing.',
  },
  {
    id: 'x3',
    topicId: 'exploration',
    question: 'What is the purpose of an A/A test?',
    options: [
      'To compare two genuinely different systems.',
      'To show both groups the same system and verify the experiment pipeline is unbiased.',
      'To double the sample size.',
      'To eliminate the novelty effect.',
    ],
    answer: 1,
    explanation:
      'An A/A test should show no significant difference; if it does, the splitting/measurement setup is flawed.',
  },
  {
    id: 'x4',
    topicId: 'exploration',
    question: 'Why must a recommendation model be continuously updated?',
    options: [
      'Because hardware degrades.',
      'New users/items arrive, tastes drift, and feedback loops bias the data.',
      'Because users dislike stable systems.',
      'There is no real reason to update it.',
    ],
    answer: 1,
    explanation:
      'New entities, preference drift and feedback loops all make a static model go stale.',
  },

  // --- context -------------------------------------------------------------
  {
    id: 'ctx1',
    topicId: 'context',
    question: '"Builds a separate model for each context" describes which context-aware approach?',
    options: ['Post-filtering', 'Pre-filtering', 'Contextual modelling', 'Hybridisation'],
    answer: 1,
    explanation:
      'Pre-filtering slices the data per context and trains a model on each slice.',
  },
  {
    id: 'ctx2',
    topicId: 'context',
    question: 'What role do hierarchies play in context-aware recommendation?',
    options: [
      'They make recommendations faster.',
      'They control sparsity by letting you aggregate to a coarser context level.',
      'They replace the rating matrix.',
      'They are only used for security.',
    ],
    answer: 1,
    explanation:
      'When a fine-grained context has too little data, you climb the hierarchy to a level with enough ratings.',
  },
  {
    id: 'ctx3',
    topicId: 'context',
    question: 'A system has context dimensions of size 12, 15 and 180. How many contexts is that?',
    options: ['207', '2 700', '32 400', '180'],
    answer: 2,
    explanation:
      'Total contexts = product of the dimension sizes: 12 × 15 × 180 = 32 400.',
  },
  {
    id: 'ctx4',
    topicId: 'context',
    question: 'A disadvantage of contextual pre-filtering compared to post-filtering is that…',
    options: [
      'it cannot use any context at all.',
      'each per-context model is trained on very little data (sparsity).',
      'it is impossible to implement.',
      'it ignores the user entirely.',
    ],
    answer: 1,
    explanation:
      'Pre-filtering splits the dataset into many small slices, so each model can be data-starved.',
  },

  // --- ethics --------------------------------------------------------------
  {
    id: 'et1',
    topicId: 'ethics',
    question: 'Why do recommender systems tend to exacerbate popularity bias?',
    options: [
      'Popular items are always higher quality.',
      'They fall back to popular items, which get more exposure, more clicks, and look even more popular.',
      'Users only ever ask for popular items.',
      'It is a hardware limitation.',
    ],
    answer: 1,
    explanation:
      'A self-reinforcing feedback loop: recommend popular → exposure → clicks → looks more popular.',
  },
  {
    id: 'et2',
    topicId: 'ethics',
    question: 'A filter bubble is best described as…',
    options: [
      'a faster caching layer.',
      'personalisation narrowing what a user sees to content that confirms existing views.',
      'a way to detect attacks.',
      'a metric for diversity.',
    ],
    answer: 1,
    explanation:
      'Filter bubbles reduce information diversity and can reinforce beliefs and polarisation.',
  },
  {
    id: 'et3',
    topicId: 'ethics',
    question: 'A purely random recommender maximises diversity, yet we still avoid it because…',
    options: [
      'it is too slow.',
      'it discards all preference information in the rating matrix, so most recommendations are irrelevant.',
      'it cannot be implemented.',
      'it always recommends popular items.',
    ],
    answer: 1,
    explanation:
      'Random covers everything but ignores known preferences — the goal is diversity with relevance.',
  },
  {
    id: 'et4',
    topicId: 'ethics',
    question: 'Which is a genuine ethical concern specific to a news recommender?',
    options: [
      'Predicting exact star ratings.',
      'Amplifying misinformation and creating filter bubbles / polarisation.',
      'Computing cosine similarity too slowly.',
      'Storing item ids.',
    ],
    answer: 1,
    explanation:
      'Engagement-optimised news ranking can spread misinformation and fragment public discourse.',
  },

  // --- young users ---------------------------------------------------------
  {
    id: 'y1',
    topicId: 'young-users',
    question: 'The core message of the young-users lecture is that children…',
    options: [
      'should be recommended the same items as adults.',
      'are "not little adults" — they have different needs, vocabulary and require appropriateness.',
      'never use recommender systems.',
      'give perfectly reliable feedback.',
    ],
    answer: 1,
    explanation:
      'Children differ developmentally; an adult engagement model can be wrong or unsafe for them.',
  },
  {
    id: 'y2',
    topicId: 'young-users',
    question: 'Why is recommending to children a multi-stakeholder problem?',
    options: [
      'Only the child has any say.',
      'The child, parents and teachers all have differing goals (fun, safety, education).',
      'Children pay for subscriptions.',
      'There are no other stakeholders.',
    ],
    answer: 1,
    explanation:
      'The user and decision-makers differ — parents want safety, teachers want educational value.',
  },
  {
    id: 'y3',
    topicId: 'young-users',
    question: 'For young users, the "best" recommendation is judged mainly by…',
    options: [
      'click-through rate alone.',
      'appropriateness and safety, not just engagement.',
      'how popular the item is globally.',
      'how fast it loads.',
    ],
    answer: 1,
    explanation:
      'Appropriateness, safety and developmental suitability outrank raw engagement for children.',
  },

  // --- hybrid --------------------------------------------------------------
  {
    id: 'h1',
    topicId: 'hybrid',
    question: 'The main reason to build a hybrid recommender is to…',
    options: [
      'make evaluation easier.',
      'combine methods so each one’s strengths cover the others’ weaknesses, e.g. cold start.',
      'reduce the number of items.',
      'avoid using any machine learning.',
    ],
    answer: 1,
    explanation:
      'Hybrids blend complementary methods; notably they cover each other’s cold-start gaps.',
  },
  {
    id: 'h2',
    topicId: 'hybrid',
    question: 'Which is a sensible fallback recommender for a brand-new user?',
    options: [
      'Matrix factorization',
      'A most-popular (recency-weighted) baseline',
      'User-based collaborative filtering',
      'An attack detector',
    ],
    answer: 1,
    explanation:
      'With no history, personalised methods fail; a most-popular baseline always returns something.',
  },
  {
    id: 'h3',
    topicId: 'hybrid',
    question: 'Which statement about hybrid recommenders is FALSE?',
    options: [
      'They aim to combine the strengths of several methods.',
      'Evaluating a hybrid recommender is usually easier than evaluating a single method.',
      'Switching hybrids help with cold start.',
      'Ensembles combine several algorithms’ outputs.',
    ],
    answer: 1,
    explanation:
      'Hybrids are harder to evaluate — more components and interactions to assess.',
  },
  {
    id: 'h4',
    topicId: 'hybrid',
    question: 'A switching hybrid…',
    options: [
      'always averages every method’s score.',
      'picks one method per situation, e.g. CBF for cold users and CF otherwise.',
      'shows results from all methods side by side.',
      'never uses collaborative filtering.',
    ],
    answer: 1,
    explanation:
      'Switching selects the most suitable method for the current condition.',
  },

  // --- genai ---------------------------------------------------------------
  {
    id: 'g1',
    topicId: 'genai',
    question: 'A key risk of using an LLM directly as a recommender is that it may…',
    options: [
      'be too accurate.',
      'hallucinate items that do not exist in the catalogue.',
      'never produce any output.',
      'only work for numeric ratings.',
    ],
    answer: 1,
    explanation:
      'LLMs generate from learned text, not your live catalogue, so they can invent non-existent items.',
  },
  {
    id: 'g2',
    topicId: 'genai',
    question: 'Why is grounding / retrieval important when an LLM recommends items?',
    options: [
      'It makes the model train faster.',
      'It constrains output to the real, current item set, preventing hallucination.',
      'It removes the need for any data.',
      'It is only needed for images.',
    ],
    answer: 1,
    explanation:
      'Grounding ties the LLM’s suggestions to the actual catalogue so recommendations are valid and available.',
  },
  {
    id: 'g3',
    topicId: 'genai',
    question: 'Which is a productive use of generative AI in recommender systems?',
    options: [
      'Replacing the rating matrix with random numbers.',
      'Generating item/user embeddings, conversational interfaces and explanations.',
      'Deleting unpopular items.',
      'Disabling evaluation.',
    ],
    answer: 1,
    explanation:
      'LLMs help with representations, conversation, cold start, data augmentation and explanations.',
  },

  // --- counterfactual ------------------------------------------------------
  {
    id: 'k1',
    topicId: 'counterfactual',
    question: 'Off-policy evaluation aims to…',
    options: [
      'deploy a new policy and measure it live.',
      'estimate a new (target) policy’s performance from data logged under a different policy.',
      'delete biased logged data.',
      'train a model with no data.',
    ],
    answer: 1,
    explanation:
      'OPE reuses logged data from the old policy to estimate how a new policy would perform.',
  },
  {
    id: 'k2',
    topicId: 'counterfactual',
    question: 'Inverse propensity scoring corrects logged data by…',
    options: [
      'deleting all popular items.',
      're-weighting each logged reward by the inverse of its logging probability (propensity).',
      'squaring every reward.',
      'averaging over all users.',
    ],
    answer: 1,
    explanation:
      'IPS up-weights rarely shown actions and down-weights over-shown ones, making the estimate unbiased.',
  },
  {
    id: 'k3',
    topicId: 'counterfactual',
    question: 'Why does a fully deterministic logging policy break importance-sampling OPE?',
    options: [
      'It produces too much data.',
      'Propensities are 1 or 0, so any new action has propensity 0 — division by zero.',
      'It is too slow.',
      'It cannot store rewards.',
    ],
    answer: 1,
    explanation:
      'Importance sampling needs non-zero logging probabilities; deterministic logging gives 0 for unseen actions.',
  },
  {
    id: 'k4',
    topicId: 'counterfactual',
    question: 'A trade-off between model-based and model-free off-policy estimators is…',
    options: [
      'model-based is unbiased but slow; model-free is biased but fast.',
      'model-based is low-variance but biased; model-free (IPS) is unbiased but high-variance.',
      'both are always identical.',
      'neither can use logged data.',
    ],
    answer: 1,
    explanation:
      'The direct method is low-variance but biased if the reward model is wrong; IPS is unbiased but high-variance.',
  },

  // --- attacks -------------------------------------------------------------
  {
    id: 'a1',
    topicId: 'attacks',
    question: 'An adversary launches a push attack. What is the intention?',
    options: [
      'To demote a competitor’s item.',
      'To amplify a target item’s popularity so it is recommended more.',
      'To delete the rating matrix.',
      'To slow down the server.',
    ],
    answer: 1,
    explanation:
      'A push attack promotes a target item; a nuke attack demotes one.',
  },
  {
    id: 'a2',
    topicId: 'attacks',
    question: 'Why is item-based collaborative filtering harder to attack with a push attack?',
    options: [
      'It does not use any ratings.',
      'It predicts from the genuine target user’s own ratings, which an attacker cannot inject.',
      'It is encrypted.',
      'It ignores popular items.',
    ],
    answer: 1,
    explanation:
      'Item-based CF leans on the authentic user’s ratings; fake profiles cannot alter a real user’s account.',
  },
  {
    id: 'a3',
    topicId: 'attacks',
    question: 'Which is NOT one of the four parts of a fake (injected) attack profile?',
    options: ['Target item', 'Filler items', 'Selected items', 'A debiasing term'],
    answer: 3,
    explanation:
      'An attack profile has a target item, selected items, filler items, and unrated items.',
  },
  {
    id: 'a4',
    topicId: 'attacks',
    question: 'Which statement about attacks is FALSE?',
    options: [
      'A bandwagon attack rates popular items highly to look influential.',
      'The effectiveness of an attack is independent of the recommendation algorithm.',
      'CAPTCHAs help prevent automated attacks.',
      'Item-based CF resists push attacks better than user-based CF.',
    ],
    answer: 1,
    explanation:
      'Attack effectiveness depends heavily on the algorithm — that is why algorithm choice is itself a defence.',
  },
]

export const conceptByTopic = (topicId: string): ConceptQuestion[] =>
  CONCEPT_QUESTIONS.filter((q) => q.topicId === topicId)
