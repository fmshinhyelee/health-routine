export interface NapEntry {
  start: string
  end: string
}

export interface HealthRecord {
  id?: string
  user_id?: string
  date: string
  sleep_bed: string
  sleep_wake: string
  sleep_quality: number
  naps: NapEntry[]
  exercise_tags: string[]
  exercise_minutes: number | null
  exercise_intensity: string
  meal_breakfast: string
  meal_lunch: string
  meal_dinner: string
  meal_snack: string
  water_count: number
  blood_sugar: number | null
  weight: number | null
  condition_score: number
  memo: string
  illness_name: string
  illness_memo: string
  created_at?: string
}

export interface Routine {
  id: string
  name: string
  time: string
  recurrence: 'daily' | 'weekdays' | 'weekends'
  notifyEnabled: boolean
  createdAt: string
}

export interface RoutineCompletion {
  routineId: string
  date: string
}

export interface MonthlyGoal {
  month: string
  target_weight: number | null
  target_blood_sugar: number | null
}

export type Page = 'log' | 'summary' | 'history' | 'goal'
