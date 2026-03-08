import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine,
} from 'recharts'
import { useGoalStore } from '../hooks/useGoalStore'
import { loadRecordsByDateRange } from '../lib/storage'
import type { HealthRecord } from '../lib/types'

export default function GoalPage() {
  const { getGoal, setGoal } = useGoalStore()
  const currentMonth = new Date().toISOString().slice(0, 7)
  const goal = getGoal(currentMonth)

  const [targetWeight, setTargetWeight] = useState(goal?.target_weight ?? null)
  const [targetBlood, setTargetBlood] = useState(goal?.target_blood_sugar ?? null)
  const [weightData, setWeightData] = useState<{ name: string; value: number | null }[]>([])
  const [bloodData, setBloodData] = useState<{ name: string; value: number | null }[]>([])
  const [latestWeight, setLatestWeight] = useState<number | null>(null)
  const [latestBlood, setLatestBlood] = useState<number | null>(null)

  useEffect(() => {
    const g = getGoal(currentMonth)
    setTargetWeight(g?.target_weight ?? null)
    setTargetBlood(g?.target_blood_sugar ?? null)
  }, [currentMonth, getGoal])

  useEffect(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 29)

    loadRecordsByDateRange(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)).then(
      (records) => {
        const byDate: Record<string, HealthRecord> = {}
        records.forEach((r) => {
          if (!byDate[r.date] || r.session === 'evening') byDate[r.date] = r
        })

        const wData = []
        const bData = []
        let lw: number | null = null
        let lb: number | null = null

        for (let i = 29; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const key = d.toISOString().slice(0, 10)
          const rec = byDate[key]
          const label = d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })

          const w = rec?.weight ?? null
          const b = rec?.blood_sugar ?? null
          wData.push({ name: label, value: w })
          bData.push({ name: label, value: b })
          if (w !== null) lw = w
          if (b !== null) lb = b
        }

        setWeightData(wData)
        setBloodData(bData)
        setLatestWeight(lw)
        setLatestBlood(lb)
      }
    )
  }, [])

  const handleSaveGoal = () => {
    setGoal({ month: currentMonth, target_weight: targetWeight, target_blood_sugar: targetBlood })
  }

  const monthLabel = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })

  return (
    <div className="p-4 pb-24">
      <div className="mb-2 text-[13px] font-bold uppercase tracking-wider text-sub">
        {monthLabel} 목표
      </div>

      <div className="mb-4 rounded-2xl border border-border bg-card p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-sub">목표 몸무게 (kg)</label>
            <input
              type="number"
              placeholder="60.0"
              step={0.1}
              value={targetWeight ?? ''}
              onChange={(e) => setTargetWeight(e.target.value ? Number(e.target.value) : null)}
              className="mt-1 w-full rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-sub">목표 혈당 (mg/dL)</label>
            <input
              type="number"
              placeholder="100"
              value={targetBlood ?? ''}
              onChange={(e) => setTargetBlood(e.target.value ? Number(e.target.value) : null)}
              className="mt-1 w-full rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
            />
          </div>
        </div>
        <button
          onClick={handleSaveGoal}
          className="mt-3 w-full rounded-[10px] bg-accent py-2.5 text-sm font-semibold text-white"
        >
          목표 저장
        </button>

        {(targetWeight || targetBlood) && (
          <div className="mt-3 flex gap-2">
            {targetWeight && latestWeight && (
              <div className="flex-1 rounded-xl bg-card2 p-3 text-center">
                <div className="text-[11px] text-sub">몸무게</div>
                <div className="text-sm font-bold text-blue">
                  {latestWeight}kg → {targetWeight}kg
                </div>
                <div className={`text-xs font-semibold ${latestWeight <= targetWeight ? 'text-green' : 'text-red'}`}>
                  {latestWeight <= targetWeight ? '달성!' : `${(latestWeight - targetWeight).toFixed(1)}kg 남음`}
                </div>
              </div>
            )}
            {targetBlood && latestBlood && (
              <div className="flex-1 rounded-xl bg-card2 p-3 text-center">
                <div className="text-[11px] text-sub">혈당</div>
                <div className="text-sm font-bold text-yellow">
                  {latestBlood}mg → {targetBlood}mg
                </div>
                <div className={`text-xs font-semibold ${latestBlood <= targetBlood ? 'text-green' : 'text-red'}`}>
                  {latestBlood <= targetBlood ? '달성!' : `${latestBlood - targetBlood}mg 초과`}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-2 text-[13px] font-bold uppercase tracking-wider text-sub">30일 몸무게 추이</div>
      <div className="mb-4 rounded-2xl border border-border bg-card p-4">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={weightData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} interval={6} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa', r: 3 }} connectNulls name="몸무게(kg)" />
            {targetWeight && (
              <ReferenceLine y={targetWeight} stroke="#34d399" strokeDasharray="6 4" strokeWidth={2} label={{ value: `목표 ${targetWeight}kg`, fill: '#34d399', fontSize: 10, position: 'insideTopRight' }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-2 text-[13px] font-bold uppercase tracking-wider text-sub">30일 혈당 추이</div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={bloodData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} interval={6} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#fbbf24', r: 3 }} connectNulls name="혈당(mg/dL)" />
            {targetBlood && (
              <ReferenceLine y={targetBlood} stroke="#34d399" strokeDasharray="6 4" strokeWidth={2} label={{ value: `목표 ${targetBlood}mg`, fill: '#34d399', fontSize: 10, position: 'insideTopRight' }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
