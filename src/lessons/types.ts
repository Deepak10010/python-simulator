import type { ComponentType } from 'react'

export type Strategy = 'A' | 'B' | 'C'

export type Tier =
  | 'beginner'
  | 'intermediate'
  | 'upper-intermediate'
  | 'advanced'
  | 'expert'

export interface LessonBase {
  id: string
  /** Catalog number, e.g. 7 for Loops. */
  number: number
  title: string
  tier: Tier
  strategy: Strategy
  /** One-line hook shown on cards. */
  blurb: string
  /** Sub-topics covered (shown as chips). */
  topics: string[]
  emoji: string
}

/** Trace-driven lesson: explanation + sample code run through the engine. */
export interface LessonA extends LessonBase {
  strategy: 'A'
  /** Markdown-ish explanation (rendered as paragraphs). */
  explanation: string[]
  sampleCode: string
  /** Which viz panels to show. */
  show?: {
    calc?: boolean
    variables?: boolean
    heap?: boolean
    stack?: boolean
    output?: boolean
  }
  inputs?: string[]
}

/** Custom-animation lesson: a bespoke scene component. */
export interface LessonBC extends LessonBase {
  strategy: 'B' | 'C'
  explanation: string[]
  Scene: ComponentType
}

export type Lesson = LessonA | LessonBC

export const TIER_LABELS: Record<Tier, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  'upper-intermediate': 'Upper Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
}

export const TIER_ORDER: Tier[] = [
  'beginner',
  'intermediate',
  'upper-intermediate',
  'advanced',
  'expert',
]
