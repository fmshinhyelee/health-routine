import { create } from 'zustand'
import type { MonthlyGoal } from '../lib/types'

let userId = ''

function goalsKey() {
  return `health_tracker_goals${userId ? `_${userId}` : ''}`
}

function loadGoals(): MonthlyGoal[] {
  try { return JSON.parse(localStorage.getItem(goalsKey()) || '[]') }
  catch { return [] }
}

function persistGoals(goals: MonthlyGoal[]) {
  localStorage.setItem(goalsKey(), JSON.stringify(goals))
}

interface GoalStore {
  goals: MonthlyGoal[]
  setUserId: (id: string) => void
  getGoal: (month: string) => MonthlyGoal | null
  setGoal: (goal: MonthlyGoal) => void
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: loadGoals(),

  setUserId: (id) => {
    userId = id
    set({ goals: loadGoals() })
  },

  getGoal: (month) => {
    return get().goals.find((g) => g.month === month) ?? null
  },

  setGoal: (goal) => {
    set((state) => {
      const goals = state.goals.filter((g) => g.month !== goal.month)
      goals.push(goal)
      persistGoals(goals)
      return { goals }
    })
  },
}))
