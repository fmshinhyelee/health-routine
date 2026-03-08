import { useEffect } from 'react'
import { useHealthStore } from './hooks/useHealthStore'
import { useAuthStore } from './hooks/useAuthStore'
import { useRoutineStore } from './hooks/useRoutineStore'
import { useGoalStore } from './hooks/useGoalStore'
import { setStorageUserId } from './lib/storage'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import LogPage from './components/LogPage'
import SummaryPage from './components/SummaryPage'
import HistoryPage from './components/HistoryPage'
import GoalPage from './components/GoalPage'
import AuthPage from './components/AuthPage'

export default function App() {
  const { page, loadToday } = useHealthStore()
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (user) {
      setStorageUserId(user.id)
      useRoutineStore.getState().setUserId(user.id)
      useGoalStore.getState().setUserId(user.id)
      loadToday()
    }
  }, [user, loadToday])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <div className="mb-2 text-3xl">💚</div>
          <p className="text-sm text-sub">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <>
      <Header />
      {page === 'log' && <LogPage />}
      {page === 'summary' && <SummaryPage />}
      {page === 'goal' && <GoalPage />}
      {page === 'history' && <HistoryPage />}
      <BottomNav />
      <Toast />
    </>
  )
}
