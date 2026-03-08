import { useState, useEffect, useCallback } from 'react'
import { useHealthStore } from '../../hooks/useHealthStore'
import { saveMealPhoto, loadMealPhoto, deleteMealPhoto } from '../../lib/imageStore'
import CardShell from './CardShell'

const meals = [
  { key: 'meal_breakfast' as const, label: '아침', placeholder: '예: 현미밥, 된장국, 계란' },
  { key: 'meal_lunch' as const, label: '점심', placeholder: '예: 닭가슴살 샐러드' },
  { key: 'meal_dinner' as const, label: '저녁', placeholder: '예: 고구마, 단백질 쉐이크' },
  { key: 'meal_snack' as const, label: '간식', placeholder: '예: 견과류, 과일' },
]

export default function MealCard() {
  const { record, updateRecord } = useHealthStore()
  const [photos, setPhotos] = useState<Record<string, string>>({})

  const loadPhotos = useCallback(async () => {
    const urls: Record<string, string> = {}
    for (const m of meals) {
      const key = `${record.date}_${record.session}_${m.key}`
      try {
        const blob = await loadMealPhoto(key)
        if (blob) urls[m.key] = URL.createObjectURL(blob)
      } catch { /* ignore */ }
    }
    setPhotos((prev) => {
      Object.values(prev).forEach(URL.revokeObjectURL)
      return urls
    })
  }, [record.date, record.session])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  const handlePhotoUpload = async (mealKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const key = `${record.date}_${record.session}_${mealKey}`
    await saveMealPhoto(key, file)
    setPhotos((prev) => {
      if (prev[mealKey]) URL.revokeObjectURL(prev[mealKey])
      return { ...prev, [mealKey]: URL.createObjectURL(file) }
    })
  }

  const handleDeletePhoto = async (mealKey: string) => {
    const key = `${record.date}_${record.session}_${mealKey}`
    await deleteMealPhoto(key)
    setPhotos((prev) => {
      if (prev[mealKey]) URL.revokeObjectURL(prev[mealKey])
      const next = { ...prev }
      delete next[mealKey]
      return next
    })
  }

  return (
    <CardShell icon="🍽️" iconBg="rgba(251,191,36,.2)" title="식단/영양" sub="오늘 먹은 것">
      {meals.map((m) => (
        <div key={m.key} className="mt-2.5 first:mt-0">
          <label className="text-xs text-sub">{m.label}</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              placeholder={m.placeholder}
              value={record[m.key]}
              onChange={(e) => updateRecord({ [m.key]: e.target.value })}
              className="flex-1 rounded-[10px] border border-border bg-card2 px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
            />
            {photos[m.key] ? (
              <div className="relative h-10 w-10 shrink-0">
                <img src={photos[m.key]} className="h-10 w-10 rounded-lg object-cover" alt="" />
                <button
                  onClick={() => handleDeletePhoto(m.key)}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red text-[10px] text-white"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-sub">
                📷
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(m.key, e)}
                />
              </label>
            )}
          </div>
        </div>
      ))}
    </CardShell>
  )
}
