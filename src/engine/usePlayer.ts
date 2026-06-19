import { useCallback, useEffect, useRef, useState } from 'react'
import type { ExecutionStep, TraceResult } from './types'

export interface PlayerState {
  steps: ExecutionStep[]
  index: number
  isPlaying: boolean
  speed: number // steps per second
  current: ExecutionStep | null
  previous: ExecutionStep | null
  truncated: boolean
  error: string | null
  // controls
  setSteps: (result: TraceResult | null) => void
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (i: number) => void
  reset: () => void
  setSpeed: (s: number) => void
}

const SPEEDS = [0.25, 0.5, 1, 2, 4]

export function usePlayer(): PlayerState {
  const [steps, setStepsState] = useState<ExecutionStep[]>([])
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [truncated, setTruncated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  const setSteps = useCallback((result: TraceResult | null) => {
    clearTimer()
    setIsPlaying(false)
    if (!result) {
      setStepsState([])
      setIndex(0)
      setTruncated(false)
      setError(null)
      return
    }
    setStepsState(result.steps)
    setIndex(0)
    setTruncated(result.truncated)
    setError(result.error)
  }, [])

  const pause = useCallback(() => {
    clearTimer()
    setIsPlaying(false)
  }, [])

  const play = useCallback(() => {
    if (steps.length === 0) return
    setIsPlaying(true)
  }, [steps.length])

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, Math.max(0, steps.length - 1)))
  }, [steps.length])

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0))
  }, [])

  const seek = useCallback(
    (i: number) => {
      setIndex(Math.max(0, Math.min(i, steps.length - 1)))
    },
    [steps.length]
  )

  const reset = useCallback(() => {
    pause()
    setIndex(0)
  }, [pause])

  const toggle = useCallback(() => {
    setIsPlaying((p) => !p)
  }, [])

  // Auto-advance while playing.
  useEffect(() => {
    if (!isPlaying) return
    if (index >= steps.length - 1) {
      setIsPlaying(false)
      return
    }
    timer.current = window.setTimeout(() => {
      setIndex((i) => Math.min(i + 1, steps.length - 1))
    }, 1000 / speed)
    return clearTimer
  }, [isPlaying, index, steps.length, speed])

  const current = steps.length > 0 ? steps[Math.min(index, steps.length - 1)] : null
  const previous = index > 0 ? steps[index - 1] : null

  return {
    steps,
    index,
    isPlaying,
    speed,
    current,
    previous,
    truncated,
    error,
    setSteps,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    reset,
    setSpeed,
  }
}

export { SPEEDS }
