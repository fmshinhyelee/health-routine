import { useHealthStore } from '../../hooks/useHealthStore'
import CardShell from './CardShell'

export default function BodyCard() {
  const { record, updateRecord } = useHealthStore()

  return (
    <CardShell icon="📊" iconBg="rgba(248,113,113,.2)" title="혈당 / 몸무게" sub="측정값 입력">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-sub">혈당 (mg/dL)</label>
          <input
            type="number"
            placeholder="120"
            min={50}
            max={400}
            value={record.blood_sugar ?? ''}
            onChange={(e) => updateRecord({ blood_sugar: e.target.value ? Number(e.target.value) : null })}
            className="mt-1 w-full rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs text-sub">몸무게 (kg)</label>
          <input
            type="number"
            placeholder="60.0"
            step={0.1}
            min={30}
            max={200}
            value={record.weight ?? ''}
            onChange={(e) => updateRecord({ weight: e.target.value ? Number(e.target.value) : null })}
            className="mt-1 w-full rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
        </div>
      </div>
    </CardShell>
  )
}
