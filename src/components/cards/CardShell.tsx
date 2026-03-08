import type { ReactNode } from 'react'

interface Props {
  icon: string
  iconBg: string
  title: string
  sub: string
  children: ReactNode
}

export default function CardShell({ icon, iconBg, title, sub, children }: Props) {
  return (
    <div className="mb-3 rounded-2xl border border-border bg-card p-4">
      <div className="mb-3.5 flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-[10px] text-base"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        <div>
          <div className="text-[15px] font-bold">{title}</div>
          <div className="text-xs text-sub">{sub}</div>
        </div>
      </div>
      {children}
    </div>
  )
}
