import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from 'recharts'
import { loadRecord, loadRecordsByDateRange } from '../lib/storage'
import type { HealthRecord } from '../lib/types'

const condEmojis = ['', '😫', '😔', '😐', '😊', '🤩']

function calcSleepHours(bed: string, wake: string): string {
  const [bh, bm] = bed.split(':').map(Number)
  const [wh, wm] = wake.split(':').map(Number)
  let mins = (wh * 60 + wm) - (bh * 60 + bm)
  if (mins < 0) mins += 1440
  return (mins / 60).toFixed(1)
}

export default function SummaryPage() {
  const [record, setRecord] = useState<HealthRecord | null>(null)
  const [chartData, setChartData] = useState<{ name: string; weight: number | null; condition: number | null }[]>([])

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)

    loadRecord(today).then((data) => setRecord(data))

    // Load week data for chart
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 6)
    loadRecordsByDateRange(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)).then(
      (records) => {
        const byDate: Record<string, HealthRecord> = {}
        records.forEach((r) => {
          byDate[r.date] = r
        })
        const data = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const key = d.toISOString().slice(0, 10)
          const rec = byDate[key]
          data.push({
            name: d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
            weight: rec?.weight ?? null,
            condition: rec?.condition_score ?? null,
          })
        }
        setChartData(data)
      }
    )
  }, [])

  const summaryItems = record
    ? [
        { icon: '😴', val: record.sleep_bed && record.sleep_wake ? `${calcSleepHours(record.sleep_bed, record.sleep_wake)}h` : '-', label: '수면 시간', color: '#60a5fa' },
        { icon: '💧', val: `${record.water_count * 250}ml`, label: '수분 섭취', color: '#60a5fa' },
        { icon: '🏋️', val: record.exercise_minutes ? `${record.exercise_minutes}분` : '-', label: '운동 시간', color: '#34d399' },
        { icon: '📊', val: record.weight ? `${record.weight}kg` : '-', label: '몸무게', color: '#f87171' },
        { icon: '🩸', val: record.blood_sugar ? `${record.blood_sugar}mg` : '-', label: '혈당', color: '#fbbf24' },
        { icon: '😊', val: condEmojis[record.condition_score] || '😐', label: '컨디션', color: '#e879f9' },
      ]
    : []

  return (
    <div className="p-4 pb-24">
      <div className="mb-2 text-[13px] font-bold uppercase tracking-wider text-sub">오늘 요약</div>

      {summaryItems.length > 0 ? (
        <div className="mb-3 grid grid-cols-2 gap-2.5">
          {summaryItems.map((s) => (
            <div key={s.label} className="rounded-[14px] border border-border bg-card p-3.5 text-center">
              <div className="text-[22px]">{s.icon}</div>
              <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.val}</div>
              <div className="mt-0.5 text-[11px] text-sub">{s.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4 rounded-[14px] border border-border bg-card p-8 text-center text-sm text-sub">
          오늘 아직 기록이 없어요
        </div>
      )}

      <div className="mb-2 mt-4 text-[13px] font-bold uppercase tracking-wider text-sub">주간 트렌드</div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-2 text-[15px] font-bold">몸무게 · 컨디션</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="weight" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
            <YAxis yAxisId="cond" orientation="right" domain={[1, 5]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
            <Tooltip
              contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line yAxisId="weight" type="monotone" dataKey="weight" stroke="#60a5fa" strokeWidth={2.5} dot={{ fill: '#60a5fa', r: 4 }} connectNulls name="몸무게(kg)" />
            <Line yAxisId="cond" type="monotone" dataKey="condition" stroke="#e879f9" strokeWidth={2.5} dot={{ fill: '#e879f9', r: 4 }} connectNulls name="컨디션" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
