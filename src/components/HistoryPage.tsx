import { useEffect, useState } from 'react'
import { loadAllRecords } from '../lib/storage'
import type { HealthRecord } from '../lib/types'

const condEmojis = ['', '😫', '😔', '😐', '😊', '🤩']

export default function HistoryPage() {
  const [records, setRecords] = useState<HealthRecord[]>([])

  useEffect(() => {
    loadAllRecords().then(setRecords)
  }, [])

  return (
    <div className="p-4 pb-24">
      <div className="mb-2 text-[13px] font-bold uppercase tracking-wider text-sub">기록 히스토리</div>

      {records.length === 0 ? (
        <div className="py-10 text-center text-sm text-sub">아직 기록이 없어요 😊</div>
      ) : (
        records.map((r) => {
          const chips = [
            r.weight && `몸무게 ${r.weight}kg`,
            r.blood_sugar && `혈당 ${r.blood_sugar}mg`,
            r.water_count && `수분 ${r.water_count * 250}ml`,
            r.exercise_minutes && `운동 ${r.exercise_minutes}분`,
            r.condition_score && `컨디션 ${condEmojis[r.condition_score]}`,
          ].filter(Boolean)

          return (
            <div key={r.date} className="mb-2 rounded-xl border border-border bg-card px-3.5 py-3">
              <div className="mb-1.5 text-xs text-sub">
                {r.date}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {chips.length > 0 ? (
                  chips.map((chip) => (
                    <span key={chip} className="rounded-lg bg-card2 px-2 py-1 text-[11px] text-sub">
                      {chip}
                    </span>
                  ))
                ) : (
                  <span className="rounded-lg bg-card2 px-2 py-1 text-[11px] text-sub">데이터 없음</span>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
