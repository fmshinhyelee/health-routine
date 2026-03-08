import { useHealthStore } from '../hooks/useHealthStore'
import { showToast } from './Toast'
import SleepCard from './cards/SleepCard'
import ExerciseCard from './cards/ExerciseCard'
import MealCard from './cards/MealCard'
import WaterCard from './cards/WaterCard'
import BodyCard from './cards/BodyCard'
import ConditionCard from './cards/ConditionCard'
import IllnessCard from './cards/IllnessCard'
import RoutineCard from './cards/RoutineCard'

export default function LogPage() {
  const { save, saving } = useHealthStore()

  const handleSave = async () => {
    await save()
    showToast('✅ 저장 완료!')
  }

  return (
    <div className="p-4 pb-24">
      <SleepCard />
      <ExerciseCard />
      <MealCard />
      <WaterCard />
      <BodyCard />
      <ConditionCard />
      <IllnessCard />
      <RoutineCard />
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 w-full rounded-[14px] bg-gradient-to-br from-accent to-accent2 py-3.5 text-base font-bold text-white transition-opacity active:opacity-80 disabled:opacity-50"
      >
        {saving ? '저장 중...' : '💾 저장하기'}
      </button>
    </div>
  )
}
