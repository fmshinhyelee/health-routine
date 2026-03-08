import { create } from 'zustand'
import type { Routine, RoutineCompletion } from '../lib/types'

let userId = ''

function routinesKey() {
  return `health_tracker_routines${userId ? `_${userId}` : ''}`
}
function completionsKey() {
  return `health_tracker_routine_completions${userId ? `_${userId}` : ''}`
}

function loadRoutines(): Routine[] {
  try { return JSON.parse(localStorage.getItem(routinesKey()) || '[]') }
  catch { return [] }
}

function persistRoutines(routines: Routine[]) {
  localStorage.setItem(routinesKey(), JSON.stringify(routines))
}

function loadCompletions(): RoutineCompletion[] {
  try { return JSON.parse(localStorage.getItem(completionsKey()) || '[]') }
  catch { return [] }
}

function persistCompletions(completions: RoutineCompletion[]) {
  localStorage.setItem(completionsKey(), JSON.stringify(completions))
}

interface RoutineStore {
  routines: Routine[]
  completions: RoutineCompletion[]
  setUserId: (id: string) => void
  addRoutine: (routine: Omit<Routine, 'id' | 'createdAt'>) => void
  removeRoutine: (id: string) => void
  toggleCompletion: (routineId: string, date: string) => void
  isCompleted: (routineId: string, date: string) => boolean
  getRoutinesForDate: (date: string) => Routine[]
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  routines: loadRoutines(),
  completions: loadCompletions(),

  setUserId: (id) => {
    userId = id
    set({ routines: loadRoutines(), completions: loadCompletions() })
  },

  addRoutine: (partial) => {
    const routine: Routine = {
      ...partial,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    set((state) => {
      const routines = [...state.routines, routine]
      persistRoutines(routines)
      return { routines }
    })
  },

  removeRoutine: (id) => {
    set((state) => {
      const routines = state.routines.filter((r) => r.id !== id)
      const completions = state.completions.filter((c) => c.routineId !== id)
      persistRoutines(routines)
      persistCompletions(completions)
      return { routines, completions }
    })
  },

  toggleCompletion: (routineId, date) => {
    set((state) => {
      const exists = state.completions.some(
        (c) => c.routineId === routineId && c.date === date
      )
      const completions = exists
        ? state.completions.filter((c) => !(c.routineId === routineId && c.date === date))
        : [...state.completions, { routineId, date }]
      persistCompletions(completions)
      return { completions }
    })
  },

  isCompleted: (routineId, date) => {
    return get().completions.some(
      (c) => c.routineId === routineId && c.date === date
    )
  },

  getRoutinesForDate: (date) => {
    const dayOfWeek = new Date(date).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    return get().routines.filter((r) => {
      if (r.recurrence === 'daily') return true
      if (r.recurrence === 'weekdays') return !isWeekend
      if (r.recurrence === 'weekends') return isWeekend
      return true
    })
  },
}))
