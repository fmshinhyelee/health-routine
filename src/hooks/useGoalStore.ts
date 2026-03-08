import { create } from 'zustand'
import type { MonthlyGoal } from '../lib/types'

const GOALS_KEY = 'health_tracker_goals'

function loadGoals(): MonthlyGoal[] {
  try { return JSON.parse(localStorage.getItem(GOALS_KEY) || '[]') }
  catch { return [] }
}

function persistGoals(goals: MonthlyGoal[]) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
}

interface GoalStore {
  goals: MonthlyGoal[]
  getGoal: (month: string) => MonthlyGoal | null
  setGoal: (goal: MonthlyGoal) => void
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: loadGoals(),

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
