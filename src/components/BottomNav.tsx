import { useHealthStore } from '../hooks/useHealthStore'
import type { Page } from '../lib/types'
import { HiOutlineClipboardDocumentList, HiOutlineChartBar, HiOutlineClock } from 'react-icons/hi2'
import { HiOutlineFlag } from 'react-icons/hi2'

const navItems: { key: Page; label: string; Icon: typeof HiOutlineClipboardDocumentList }[] = [
  { key: 'log', label: '기록', Icon: HiOutlineClipboardDocumentList },
  { key: 'summary', label: '요약', Icon: HiOutlineChartBar },
  { key: 'goal', label: '목표', Icon: HiOutlineFlag },
  { key: 'history', label: '히스토리', Icon: HiOutlineClock },
]

export default function BottomNav() {
  const { page, setPage } = useHealthStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-card">
      {navItems.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => setPage(key)}
          className={`flex flex-1 flex-col items-center gap-1 pt-3 pb-2 text-[10px] transition-colors ${
            page === key ? 'text-accent' : 'text-sub'
          }`}
        >
          <Icon className="h-[22px] w-[22px]" />
          {label}
        </button>
      ))}
    </nav>
  )
}
