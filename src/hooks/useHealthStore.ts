import { create } from 'zustand'
import type { Page, HealthRecord } from '../lib/types'
import { saveRecord, loadRecord } from '../lib/storage'

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

function createEmptyRecord(date: string): HealthRecord {
  return {
    date,
    sleep_bed: '23:00',
    sleep_wake: '07:00',
    sleep_quality: 3,
    naps: [],
    exercise_tags: [],
    exercise_minutes: null,
    exercise_intensity: '보통',
    meal_breakfast: '',
    meal_lunch: '',
    meal_dinner: '',
    meal_snack: '',
    water_count: 0,
    blood_sugar: null,
    weight: null,
    condition_score: 3,
    memo: '',
    illness_name: '',
    illness_memo: '',
  }
}

interface HealthStore {
  page: Page
  record: HealthRecord
  saving: boolean
  setPage: (page: Page) => void
  updateRecord: (partial: Partial<HealthRecord>) => void
  save: () => Promise<void>
  loadToday: () => Promise<void>
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  page: 'log',
  record: createEmptyRecord(getToday()),
  saving: false,

  setPage: (page) => set({ page }),

  updateRecord: (partial) =>
    set((state) => ({ record: { ...state.record, ...partial } })),

  save: async () => {
    set({ saving: true })
    const { record } = get()
    await saveRecord({ ...record, date: getToday() })
    set({ saving: false })
  },

  loadToday: async () => {
    const date = getToday()
    const data = await loadRecord(date)
    set({ record: data || createEmptyRecord(date) })
  },
}))
