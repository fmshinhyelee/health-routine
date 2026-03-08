import { supabase } from './supabase'

// Custom exercises
const CUSTOM_EXERCISES_KEY = 'health_tracker_custom_exercises'

export function getCustomExercises(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_EXERCISES_KEY) || '[]')
  } catch {
    return []
  }
}

export function addCustomExercise(name: string): string[] {
  const list = getCustomExercises()
  if (!list.includes(name)) {
    list.push(name)
    localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(list))
  }
  return list
}
import type { HealthRecord } from './types'

const LOCAL_KEY = 'health_tracker_v2'

function getLocalStore(): Record<string, HealthRecord> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}')
  } catch {
    return {}
  }
}

function setLocalStore(data: Record<string, HealthRecord>) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

function makeKey(date: string, session: string) {
  return `${date}_${session}`
}

export async function saveRecord(record: HealthRecord): Promise<void> {
  const key = makeKey(record.date, record.session)

  // Always save locally
  const store = getLocalStore()
  store[key] = record
  setLocalStore(store)

  // Sync to Supabase if available
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase.from('health_records').upsert(
          { ...record, user_id: user.id, id: `${user.id}_${key}` },
          { onConflict: 'id' }
        )
        if (error) console.error('Supabase save error:', error)
      }
    } catch (e) {
      console.error('Supabase sync failed, data saved locally:', e)
    }
  }
}

export async function loadRecord(date: string, session: string): Promise<HealthRecord | null> {
  const key = makeKey(date, session)

  // Try Supabase first
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('health_records')
          .select('*')
          .eq('id', `${user.id}_${key}`)
          .single()
        if (data) return data as HealthRecord
      }
    } catch {
      // Fall through to local
    }
  }

  // Fallback to local
  const store = getLocalStore()
  return store[key] || null
}

export async function loadAllRecords(): Promise<HealthRecord[]> {
  // Try Supabase first
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('health_records')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
        if (data && data.length > 0) return data as HealthRecord[]
      }
    } catch {
      // Fall through to local
    }
  }

  // Fallback to local
  const store = getLocalStore()
  return Object.values(store).sort((a, b) => b.date.localeCompare(a.date))
}

export async function loadRecordsByDateRange(startDate: string, endDate: string): Promise<HealthRecord[]> {
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('health_records')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: true })
        if (data && data.length > 0) return data as HealthRecord[]
      }
    } catch {
      // Fall through
    }
  }

  const store = getLocalStore()
  return Object.values(store)
    .filter(r => r.date >= startDate && r.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date))
}
