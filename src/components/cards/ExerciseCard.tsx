import { useHealthStore } from '../../hooks/useHealthStore'
import CardShell from './CardShell'

const exerciseOptions = ['걷기', '달리기', '헬스', '요가', '수영', '자전거', '스트레칭', '없음']

export default function ExerciseCard() {
  const { record, updateRecord } = useHealthStore()

  const toggleTag = (tag: string) => {
    const tags = record.exercise_tags.includes(tag)
      ? record.exercise_tags.filter((t) => t !== tag)
      : [...record.exercise_tags, tag]
    updateRecord({ exercise_tags: tags })
  }

  return (
    <CardShell icon="🏋️" iconBg="rgba(52,211,153,.2)" title="운동/활동량" sub="오늘의 운동">
      <div className="flex flex-wrap gap-1.5">
        {exerciseOptions.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`rounded-full border-[1.5px] px-3 py-1.5 text-xs font-semibold transition-all ${
              record.exercise_tags.includes(tag)
                ? 'border-accent bg-accent/20 text-accent'
                : 'border-border text-sub'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-sub">시간 (분)</label>
          <input
            type="number"
            placeholder="30"
            min={0}
            max={300}
            value={record.exercise_minutes ?? ''}
            onChange={(e) => updateRecord({ exercise_minutes: e.target.value ? Number(e.target.value) : null })}
            className="mt-1 w-full rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs text-sub">강도</label>
          <select
            value={record.exercise_intensity}
            onChange={(e) => updateRecord({ exercise_intensity: e.target.value })}
            className="mt-1 w-full rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
          >
            <option>가벼움</option>
            <option>보통</option>
            <option>격렬</option>
          </select>
        </div>
      </div>
    </CardShell>
  )
}
