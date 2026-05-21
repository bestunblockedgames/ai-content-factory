'use client'

import { NeonButton } from '@/components/ui/NeonButton'

interface NavbarProps {
  title?: string
  onExport?: () => void
}

export function Navbar({ title = 'AI 内容工厂', onExport }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-dark-border glass">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center text-white text-sm font-bold">
          A
        </div>
        <span className="font-semibold text-white">{title}</span>
      </div>
      {onExport && (
        <NeonButton onClick={onExport} color="cyan" className="text-xs">
          导出
        </NeonButton>
      )}
    </nav>
  )
}
