import { useState, useEffect, useRef } from 'react'
import CardShell from './CardShell'
import { useRoutineStore } from '../../hooks/useRoutineStore'
import { requestNotificationPermission, scheduleNotification, cancelNotification } from '../../lib/notifications'

const recurrenceLabel: Record<string, string> = { daily: '매일', weekdays: '평일', weekends: '주말' }

export default function RoutineCard() {
  const { routines, addRoutine, removeRoutine, toggleCompletion, isCompleted, getRoutinesForDate } = useRoutineStore()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [time, setTime] = useState('08:00')
  const [recurrence, setRecurrence] = useState<'daily' | 'weekdays' | 'weekends'>('daily')
  const [notifyEnabled, setNotifyEnabled] = useState(false)
  const timerRefs = useRef<Map<string, number>>(new Map())

  const today = new Date().toISOString().slice(0, 10)
  const todayRoutines = getRoutinesForDate(today)

  useEffect(() => {
    timerRefs.current.forEach((id) => cancelNotification(id))
    timerRefs.current.clear()

    routines.forEach((r) => {
      if (r.notifyEnabled && !isCompleted(r.id, today)) {
        const timerId = scheduleNotification(r.name, r.time)
        if (timerId !== null) timerRefs.current.set(r.id, timerId)
      }
    })

    return () => {
      timerRefs.current.forEach((id) => cancelNotification(id))
    }
  }, [routines, today, isCompleted])

  const handleAdd = async () => {
    if (!name.trim()) return
    if (notifyEnabled) await requestNotificationPermission()
    addRoutine({ name: name.trim(), time, recurrence, notifyEnabled })
    setName('')
    setTime('08:00')
    setRecurrence('daily')
    setNotifyEnabled(false)
    setShowForm(false)
  }

  return (
    <CardShell icon="✅" iconBg="rgba(52,211,153,.2)" title="Healthy Routine" sub="매일 반복할 습관 체크">
      {todayRoutines.length === 0 && !showForm && (
        <div className="py-3 text-center text-sm text-sub">등록된 루틴이 없어요</div>
      )}

      {todayRoutines.map((r) => {
        const done = isCompleted(r.id, today)
        return (
          <div key={r.id} className="mt-1.5 flex items-center gap-2 first:mt-0">
            <button
              onClick={() => toggleCompletion(r.id, today)}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-xs transition-all ${
                done ? 'border-green bg-green text-black' : 'border-border'
              }`}
            >
              {done ? '✓' : ''}
            </button>
            <div className="flex-1 min-w-0">
              <div className={`text-sm truncate ${done ? 'text-sub line-through' : 'text-text'}`}>{r.name}</div>
              <div className="text-[11px] text-sub">
                {r.time} · {recurrenceLabel[r.recurrence]}
                {r.notifyEnabled ? ' · 🔔' : ''}
              </div>
            </div>
            <button onClick={() => removeRoutine(r.id)} className="shrink-0 text-xs text-sub">✕</button>
          </div>
        )
      })}

      {showForm ? (
        <div className="mt-3 rounded-xl border border-border bg-card2 p-3">
          <input
            type="text"
            placeholder="루틴 이름 (예: 비타민 C 먹기)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
            className="w-full rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-text outline-none focus:border-accent"
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-sub">시간</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-text outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs text-sub">반복</label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as typeof recurrence)}
                className="mt-1 w-full rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-text outline-none focus:border-accent"
              >
                <option value="daily">매일</option>
                <option value="weekdays">평일</option>
                <option value="weekends">주말</option>
              </select>
            </div>
          </div>
          <label className="mt-2 flex items-center gap-2 text-xs text-sub">
            <input
              type="checkbox"
              checked={notifyEnabled}
              onChange={(e) => setNotifyEnabled(e.target.checked)}
              className="accent-accent"
            />
            알림 받기 🔔
          </label>
          <div className="mt-2 flex gap-2">
            <button onClick={handleAdd} className="flex-1 rounded-[10px] bg-accent py-2 text-sm font-semibold text-white">
              추가
            </button>
            <button onClick={() => setShowForm(false)} className="flex-1 rounded-[10px] border border-border py-2 text-sm text-sub">
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-2 w-full rounded-[10px] border border-dashed border-border py-2 text-xs text-sub"
        >
          + 새 루틴 추가
        </button>
      )}
    </CardShell>
  )
}
