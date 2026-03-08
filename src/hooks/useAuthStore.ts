import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthStore {
  user: User | null
  loading: boolean
  initialize: () => void
  signUp: (email: string, password: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signInWithGoogle: () => Promise<string | null>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  initialize: () => {
    if (!supabase) {
      set({ loading: false })
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null, loading: false })
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },

  signUp: async (email, password) => {
    if (!supabase) return 'Supabase가 설정되지 않았습니다.'
    const { error } = await supabase.auth.signUp({ email, password })
    return error ? error.message : null
  },

  signIn: async (email, password) => {
    if (!supabase) return 'Supabase가 설정되지 않았습니다.'
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? error.message : null
  },

  signInWithGoogle: async () => {
    if (!supabase) return 'Supabase가 설정되지 않았습니다.'
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    return error ? error.message : null
  },

  signOut: async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
