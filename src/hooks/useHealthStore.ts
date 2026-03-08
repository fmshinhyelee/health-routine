import { create } from 'zustand'
import type { Page, Session, HealthRecord } from '../lib/types'
import { saveRecord, loadRecord } from '../lib/storage'

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

function createEmptyRecord(date: string, session: Session): HealthRecord {
  return {
    date,
    session,
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
  }
}

interface HealthStore {
  page: Page
  session: Session
  record: HealthRecord
  saving: boolean
  setPage: (page: Page) => void
  setSession: (session: Session) => void
  updateRecord: (partial: Partial<HealthRecord>) => void
  save: () => Promise<void>
  loadToday: () => Promise<void>
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  page: 'log',
  session: 'morning',
  record: createEmptyRecord(getToday(), 'morning'),
  saving: false,

  setPage: (page) => set({ page }),

  setSession: (session) => {
    set({ session })
    const date = getToday()
    loadRecord(date, session).then((data) => {
      set({ record: data || createEmptyRecord(date, session) })
    })
  },

  updateRecord: (partial) =>
    set((state) => ({ record: { ...state.record, ...partial } })),

  save: async () => {
    set({ saving: true })
    const { record, session } = get()
    await saveRecord({ ...record, date: getToday(), session })
    set({ saving: false })
  },

  loadToday: async () => {
    const { session } = get()
    const date = getToday()
    const data = await loadRecord(date, session)
    set({ record: data || createEmptyRecord(date, session) })
  },
}))
