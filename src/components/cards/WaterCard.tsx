import { useHealthStore } from '../../hooks/useHealthStore'
import CardShell from './CardShell'

const MAX_GLASSES = 8

export default function WaterCard() {
  const { record, updateRecord } = useHealthStore()
  const count = record.water_count

  const toggle = (idx: number) => {
    updateRecord({ water_count: idx < count ? idx : idx + 1 })
  }

  return (
    <CardShell icon="💧" iconBg="rgba(96,165,250,.2)" title="수분 섭취" sub="목표: 2,000ml (1잔=250ml)">
      <div className="mt-2 flex items-center justify-between">
        <div className="flex flex-1 flex-wrap gap-1">
          {Array.from({ length: MAX_GLASSES }, (_, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`flex h-7 w-7 items-center justify-center rounded-md border-2 text-sm transition-all ${
                i < count
                  ? 'border-blue bg-blue'
                  : 'border-border bg-transparent'
              }`}
            >
              💧
            </button>
          ))}
        </div>
        <div className="min-w-[60px] text-right">
          <div className="text-lg font-bold text-blue">{count * 250}ml</div>
          <div className="text-[13px] text-sub">/ 2000ml</div>
        </div>
      </div>
    </CardShell>
  )
}
