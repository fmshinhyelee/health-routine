import { useEffect, useState } from 'react'
import { useHealthStore } from '../hooks/useHealthStore'
import { useAuthStore } from '../hooks/useAuthStore'
import { loadAllRecords } from '../lib/storage'
import type { Session } from '../lib/types'

export default function Header() {
  const { session, setSession } = useHealthStore()
  const { user, signOut } = useAuthStore()
  const [streak, setStreak] = useState(0)

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  useEffect(() => {
    loadAllRecords().then((records) => {
      const dateSet = new Set(records.map((r) => r.date))
      let count = 0
      const d = new Date()
      for (let i = 0; i < 365; i++) {
        const key = d.toISOString().slice(0, 10)
        if (dateSet.has(key)) {
          count++
          d.setDate(d.getDate() - 1)
        } else {
          if (i === 0) {
            d.setDate(d.getDate() - 1)
            continue
          }
          break
        }
      }
      setStreak(count)
    })
  }, [])

  const tabs: { key: Session; label: string }[] = [
    { key: 'morning', label: '🌅 아침' },
    { key: 'evening', label: '🌙 저녁' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-gradient-to-br from-[#1e1b4b] to-card px-4 pt-5 pb-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-lg font-bold text-transparent">
            💚 건강 루틴
          </div>
          <div className="text-[13px] text-sub">{today}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-gradient-to-br from-[#f97316] to-[#ef4444] px-2.5 py-1 text-[13px] font-bold text-white">
            🔥 {streak}일
          </div>
          <button
            onClick={signOut}
            className="rounded-full bg-card2 px-2.5 py-1 text-[11px] text-sub transition-colors active:bg-border"
            title={user?.email ?? ''}
          >
            로그아웃
          </button>
        </div>
      </div>
      <div className="flex gap-1 rounded-xl bg-card2 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSession(t.key)}
            className={`flex-1 rounded-[10px] py-2 text-sm font-semibold transition-all ${
              session === t.key
                ? 'bg-accent text-white'
                : 'text-sub'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </header>
  )
}
