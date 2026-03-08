import { useEffect } from 'react'
import { useHealthStore } from './hooks/useHealthStore'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import LogPage from './components/LogPage'
import SummaryPage from './components/SummaryPage'
import HistoryPage from './components/HistoryPage'
import GoalPage from './components/GoalPage'

export default function App() {
  const { page, loadToday } = useHealthStore()

  useEffect(() => {
    loadToday()
  }, [loadToday])

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
