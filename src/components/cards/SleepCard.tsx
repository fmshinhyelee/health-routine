import { useHealthStore } from '../../hooks/useHealthStore'
import CardShell from './CardShell'

const emojis = ['', '😫', '😔', '😐', '😊', '🤩']

export default function SleepCard() {
  const { record, updateRecord } = useHealthStore()

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
    </CardShell>
  )
}
