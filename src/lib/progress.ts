import { useSyncExternalStore } from 'react'

// localStorage-backed progress store. Single-user, no server.

export interface QuizResult {
  best: number // best fraction correct, 0..1
  lastScore: number
  attempts: number
}

export interface Progress {
  topicsViewed: string[]
  topicsDone: string[]
  conceptQuiz: Record<string, QuizResult>
  examSeen: string[]
  drill: { attempted: number; correct: number; byKind: Record<string, { a: number; c: number }> }
  bookmarks: string[]
}

const KEY = 'recsys-prep:v1'

const empty: Progress = {
  topicsViewed: [],
  topicsDone: [],
  conceptQuiz: {},
  examSeen: [],
  drill: { attempted: 0, correct: 0, byKind: {} },
  bookmarks: [],
}

let state: Progress = empty
const listeners = new Set<() => void>()

function read(): Progress {
  if (typeof window === 'undefined') return empty
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return empty
    return { ...empty, ...JSON.parse(raw) }
  } catch {
    return empty
  }
}

function persist() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* quota or disabled storage — ignore */
  }
}

function emit() {
  listeners.forEach((l) => l())
}

let hydrated = false
function ensureHydrated() {
  if (hydrated || typeof window === 'undefined') return
  hydrated = true
  state = read()
  emit()
}

function set(next: Progress) {
  state = next
  persist()
  emit()
}

function subscribe(cb: () => void) {
  ensureHydrated()
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => empty,
  )
}

const uniq = (a: string[]) => Array.from(new Set(a))

export const progressActions = {
  viewTopic(id: string) {
    if (state.topicsViewed.includes(id)) return
    set({ ...state, topicsViewed: uniq([...state.topicsViewed, id]) })
  },
  toggleTopicDone(id: string) {
    const done = state.topicsDone.includes(id)
    set({
      ...state,
      topicsDone: done
        ? state.topicsDone.filter((x) => x !== id)
        : uniq([...state.topicsDone, id]),
    })
  },
  recordConceptQuiz(id: string, score: number, total: number) {
    const frac = total ? score / total : 0
    const prev = state.conceptQuiz[id]
    set({
      ...state,
      conceptQuiz: {
        ...state.conceptQuiz,
        [id]: {
          best: Math.max(prev?.best ?? 0, frac),
          lastScore: frac,
          attempts: (prev?.attempts ?? 0) + 1,
        },
      },
    })
  },
  markExamSeen(id: string) {
    if (state.examSeen.includes(id)) return
    set({ ...state, examSeen: uniq([...state.examSeen, id]) })
  },
  recordDrill(kind: string, correct: boolean) {
    const k = state.drill.byKind[kind] ?? { a: 0, c: 0 }
    set({
      ...state,
      drill: {
        attempted: state.drill.attempted + 1,
        correct: state.drill.correct + (correct ? 1 : 0),
        byKind: { ...state.drill.byKind, [kind]: { a: k.a + 1, c: k.c + (correct ? 1 : 0) } },
      },
    })
  },
  toggleBookmark(id: string) {
    const has = state.bookmarks.includes(id)
    set({
      ...state,
      bookmarks: has
        ? state.bookmarks.filter((x) => x !== id)
        : uniq([...state.bookmarks, id]),
    })
  },
  reset() {
    set({ ...empty, drill: { attempted: 0, correct: 0, byKind: {} } })
  },
}
