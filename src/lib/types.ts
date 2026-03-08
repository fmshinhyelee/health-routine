export interface HealthRecord {
  id?: string
  user_id?: string
  date: string
  session: 'morning' | 'evening'
  sleep_bed: string
  sleep_wake: string
  sleep_quality: number
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
  created_at?: string
}

export type Page = 'log' | 'summary' | 'history'
export type Session = 'morning' | 'evening'
