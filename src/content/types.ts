import type { ComponentType } from 'react'

export interface TopicMeta {
  id: string
  num: number
  lecture: string
  title: string
  blurb: string
  minutes: number
  tags: string[]
  visualizers: string[]
  examWeight: 'core' | 'high' | 'medium'
}

export interface Topic extends TopicMeta {
  Content: ComponentType
}
