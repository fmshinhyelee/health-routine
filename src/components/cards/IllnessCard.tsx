import { useHealthStore } from '../../hooks/useHealthStore'
import CardShell from './CardShell'

export default function IllnessCard() {
  const { record, updateRecord } = useHealthStore()

  return (
    <CardShell icon="🏥" iconBg="rgba(248,113,113,.2)" title="질병 트래킹" sub="현재 앓고 있는 질병 기록">
      <div className="mb-2.5">
        <label className="text-xs text-sub">질병명</label>
        <input
          type="text"
          placeholder="예: 당뇨, 고혈압, 위염"
          value={record.illness_name}
          onChange={(e) => updateRecord({ illness_name: e.target.value })}
          className="mt-1 w-full rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="text-xs text-sub">오늘의 메모</label>
        <textarea
          placeholder="오늘의 증상, 복약 기록, 컨디션 변화 등을 자유롭게 적어주세요"
          value={record.illness_memo}
          onChange={(e) => updateRecord({ illness_memo: e.target.value })}
          rows={3}
          className="mt-1 w-full resize-none rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
        />
      </div>
    </CardShell>
  )
}
