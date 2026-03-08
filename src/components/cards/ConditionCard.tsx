import { useHealthStore } from '../../hooks/useHealthStore'
import CardShell from './CardShell'

const emojis = ['', '😫', '😔', '😐', '😊', '🤩']

export default function ConditionCard() {
  const { record, updateRecord } = useHealthStore()

  return (
    <CardShell icon="🌡️" iconBg="rgba(232,121,249,.2)" title="오늘의 컨디션" sub="전반적인 몸 상태">
      <div className="mt-2 text-center text-[28px]">{emojis[record.condition_score]}</div>
      <input
        type="range"
        min={1}
        max={5}
        value={record.condition_score}
        onChange={(e) => updateRecord({ condition_score: Number(e.target.value) })}
        className="mt-1"
      />
      <div className="mt-1.5 flex justify-between text-[11px] text-sub">
        <span>최악😫</span><span>보통😐</span><span>최고🤩</span>
      </div>
      <label className="mt-3 block text-xs text-sub">메모</label>
      <textarea
        rows={2}
        placeholder="오늘 몸 상태나 특이사항을 적어주세요"
        value={record.memo}
        onChange={(e) => updateRecord({ memo: e.target.value })}
        className="mt-1 w-full resize-none rounded-[10px] border border-border bg-card2 px-3 py-2.5 font-[inherit] text-sm text-text outline-none focus:border-accent"
      />
    </CardShell>
  )
}
