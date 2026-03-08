import { useHealthStore } from '../../hooks/useHealthStore'
import CardShell from './CardShell'

const meals = [
  { key: 'meal_breakfast' as const, label: '아침', placeholder: '예: 현미밥, 된장국, 계란' },
  { key: 'meal_lunch' as const, label: '점심', placeholder: '예: 닭가슴살 샐러드' },
  { key: 'meal_dinner' as const, label: '저녁', placeholder: '예: 고구마, 단백질 쉐이크' },
  { key: 'meal_snack' as const, label: '간식', placeholder: '예: 견과류, 과일' },
]

export default function MealCard() {
  const { record, updateRecord } = useHealthStore()

  return (
    <CardShell icon="🍽️" iconBg="rgba(251,191,36,.2)" title="식단/영양" sub="오늘 먹은 것">
      {meals.map((m) => (
        <div key={m.key} className="mt-2.5 first:mt-0">
          <label className="text-xs text-sub">{m.label}</label>
          <input
            type="text"
            placeholder={m.placeholder}
            value={record[m.key]}
            onChange={(e) => updateRecord({ [m.key]: e.target.value })}
            className="mt-1 w-full rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
        </div>
      ))}
    </CardShell>
  )
}
