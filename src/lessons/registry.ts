import type { Lesson, LessonBC } from './types'
import { beginnerLessons } from './content/beginner'
import { SortingScene } from './strategyB/SortingScene'

// Showcase Strategy-B lesson proving the custom-animation path.
const sortingShowcase: LessonBC = {
  id: 'sorting',
  number: 20,
  title: 'Sorting (Bubble Sort)',
  tier: 'intermediate',
  strategy: 'B',
  emoji: '📊',
  blurb: 'Watch bubble sort compare and swap its way to an ordered list.',
  topics: ['algorithms', 'comparisons', 'swaps', 'big-O'],
  explanation: [
    'Some ideas are clearest as a custom animation rather than a line-by-line trace.',
    'Bubble sort repeatedly compares neighbouring values and swaps them if they are out of order. The largest value "bubbles" to the end each pass.',
    'Play it through: yellow = comparing, red = swapping, green = locked in its final sorted spot.',
  ],
  Scene: SortingScene,
}

export const lessons: Lesson[] = [...beginnerLessons, sortingShowcase]

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}

export function lessonsByTier() {
  const map = new Map<string, Lesson[]>()
  for (const l of lessons) {
    const arr = map.get(l.tier) ?? []
    arr.push(l)
    map.set(l.tier, arr)
  }
  return map
}
