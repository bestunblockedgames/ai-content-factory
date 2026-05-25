'use client'

import { useState } from 'react'
import { useWorkflowStore } from '@/store/useWorkflowStore'

const modes = [
  { key: 'orchestrate' as const, label: '编排', icon: '🔗' },
  { key: 'debug' as const, label: '调试', icon: '🐛' },
  { key: 'monitor' as const, label: '监控', icon: '📊' },
  { key: 'publish' as const, label: '发布', icon: '🚀' },
]

export function TopBar({ projectName }: { projectName?: string }) {
  const mode = useWorkflowStore((s) => s.mode)
  const setMode = useWorkflowStore((s) => s.setMode)
  const [running, setRunning] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleRun = () => {
    if (running) return
    setRunning(true)
    setMode('debug')
    showToast('工作流开始执行，已切换到调试视图')
    setTimeout(() => {
      setRunning(false)
      showToast('工作流执行完成！')
    }, 3000)
  }

  const handlePublish = () => {
    setMode('publish')
    showToast('已切换到发布页面，选择平台后可一键发布')
  }

  return (
    <div className="h-12 border-b border-dark-border bg-dark-card/80 backdrop-blur-md flex items-center px-4 gap-6 relative">
      {/* Toast */}
      {toast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-dark-card border border-neon-cyan/30 rounded-lg text-xs text-neon-cyan shadow-[0_0_15px_rgba(0,245,212,0.15)] z-50 whitespace-nowrap animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-neon-cyan font-bold text-sm">AI Content Factory</span>
        {projectName && (
          <>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400 text-sm truncate max-w-[200px]">{projectName}</span>
          </>
        )}
      </div>

      <div className="flex gap-1 ml-4">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === m.key
                ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30'
                : 'text-gray-500 hover:text-gray-300 hover:bg-dark-border/30'
            }`}
          >
            <span className="mr-1">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={handleRun}
          disabled={running}
          className={`text-xs px-3 py-1.5 rounded-md border transition-all ${
            running
              ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10 animate-pulse'
              : 'text-gray-400 border-gray-600 hover:text-white hover:border-gray-400 hover:bg-dark-border/30'
          }`}
        >
          {running ? '执行中...' : '运行'}
        </button>
        <button
          onClick={handlePublish}
          className="text-xs bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 px-3 py-1.5 rounded-md hover:bg-neon-cyan/20 transition-colors"
        >
          发布
        </button>
      </div>
    </div>
  )
}
