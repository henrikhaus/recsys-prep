import type { Topic } from '#/content/types'
import * as foundations from './foundations'
import * as contentBased from './content-based'
import * as collaborative from './collaborative'
import * as evaluation from './evaluation'
import * as exploration from './exploration'
import * as context from './context'
import * as ethics from './ethics'
import * as youngUsers from './young-users'
import * as hybrid from './hybrid'
import * as genai from './genai'
import * as counterfactual from './counterfactual'
import * as attacks from './attacks'

const modules = [
  foundations,
  contentBased,
  collaborative,
  evaluation,
  exploration,
  context,
  ethics,
  youngUsers,
  hybrid,
  genai,
  counterfactual,
  attacks,
]

export const TOPICS: Topic[] = modules.map((m) => ({ ...m.meta, Content: m.Content }))

export const getTopic = (id: string): Topic | undefined => TOPICS.find((t) => t.id === id)

export const topicIndex = (id: string): number => TOPICS.findIndex((t) => t.id === id)
