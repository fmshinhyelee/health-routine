import { useHealthStore } from '../../hooks/useHealthStore'
import CardShell from './CardShell'

const emojis = ['', '😫', '😔', '😐', '😊', '🤩']

export default function SleepCard() {
  const { record, updateRecord } = useHealthStore()
  const naps = record.naps ?? []

  const addNap = () => {
    updateRecord({ naps: [...naps, { start: '13:00', end: '13:30' }] })
  }

  const updateNap = (idx: number, field: 'start' | 'end', value: string) => {
    const updated = [...naps]
    updated[idx] = { ...updated[idx], [field]: value }
    updateRecord({ naps: updated })
  }

  const removeNap = (idx: number) => {
    updateRecord({ naps: naps.filter((_, i) => i !== idx) })
  }

  return (
    <CardShell icon="😴" iconBg="rgba(96,165,250,.2)" title="수면" sub="취침·기상 시간 및 품질">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-sub">취침</label>
          <input
            type="time"
            value={record.sleep_bed}
            onChange={(e) => updateRecord({ sleep_bed: e.target.value })}
            className="mt-1 w-full rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs text-sub">기상</label>
          <input
            type="time"
            value={record.sleep_wake}
            onChange={(e) => updateRecord({ sleep_wake: e.target.value })}
            className="mt-1 w-full rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
        </div>
      </div>
      <label className="mt-2.5 block text-xs text-sub">수면 품질</label>
      <div className="mt-2 text-center text-[28px]">{emojis[record.sleep_quality]}</div>
      <input
        type="range"
        min={1}
        max={5}
        value={record.sleep_quality}
        onChange={(e) => updateRecord({ sleep_quality: Number(e.target.value) })}
        className="mt-1"
      />
      <div className="mt-1.5 flex justify-between text-[11px] text-sub">
        <span>최악</span><span>보통</span><span>최고</span>
      </div>

      <label className="mt-3 block text-xs text-sub">낮잠 기록</label>
      {naps.map((nap, i) => (
        <div key={i} className="mt-1.5 flex items-center gap-2">
          <input
            type="time"
            value={nap.start}
            onChange={(e) => updateNap(i, 'start', e.target.value)}
            className="flex-1 rounded-[10px] border border-border bg-card2 px-3 py-2 text-sm text-text outline-none focus:border-accent"
          />
          <span className="text-xs text-sub">~</span>
          <input
            type="time"
            value={nap.end}
            onChange={(e) => updateNap(i, 'end', e.target.value)}
            className="flex-1 rounded-[10px] border border-border bg-card2 px-3 py-2 text-sm text-text outline-none focus:border-accent"
          />
          <button onClick={() => removeNap(i)} className="text-lg text-red">×</button>
        </div>
      ))}
      <button
        onClick={addNap}
        className="mt-2 w-full rounded-[10px] border border-dashed border-border py-2 text-xs text-sub"
      >
        + 낮잠 추가
      </button>
    </CardShell>
  )
}
