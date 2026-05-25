'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { ToolPalette } from '@/components/workflow/ToolPalette'
import { WorkflowEditor } from '@/components/workflow/WorkflowEditor'
import { ConfigPanel } from '@/components/workflow/ConfigPanel'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { DebugView } from '@/components/workflow/views/DebugView'
import { MonitorView } from '@/components/workflow/views/MonitorView'
import { PublishView } from '@/components/workflow/views/PublishView'
import { useWorkflowStore } from '@/store/useWorkflowStore'
import { Project } from '@/types'

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(true)
  const mode = useWorkflowStore((s) => s.mode)
  const loadProjectWorkflow = useWorkflowStore((s) => s.loadProjectWorkflow)

  const fetchProject = useCallback(async () => {
    const res = await fetch(`/api/project/${projectId}`)
    if (res.ok) {
      const p = await res.json()
      setProject(p)
      loadProjectWorkflow(projectId, p.stage, p.topic)
    }
    setLoading(false)
  }, [projectId, loadProjectWorkflow])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  const handleSend = async (message: string) => {
    if (!project) return

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString(),
    }
    setProject((p) => (p ? { ...p, messages: [...p.messages, userMsg] } : p))

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, message }),
    })

    if (!res.body) return
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let assistantContent = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value)
      const lines = text.split('\n').filter((l) => l.startsWith('data: '))
      for (const line of lines) {
        const data = JSON.parse(line.slice(6))
        if (data.text) {
          assistantContent += data.text
          setProject((p) => {
            if (!p) return p
            const msgs = [...p.messages]
            const lastMsg = msgs[msgs.length - 1]
            if (lastMsg?.role === 'assistant') {
              msgs[msgs.length - 1] = { ...lastMsg, content: assistantContent }
            } else {
              msgs.push({
                id: crypto.randomUUID(),
                role: 'assistant',
                content: assistantContent,
                timestamp: new Date().toISOString(),
              })
            }
            return { ...p, messages: msgs }
          })
        }
      }
    }
    fetchProject()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-cyan animate-pulse">加载中...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">项目不存在</div>
      </div>
    )
  }

  const renderMainContent = () => {
    switch (mode) {
      case 'orchestrate':
        return (
          <>
            <ToolPalette />
            <div className="flex-1 flex flex-col overflow-hidden">
              <WorkflowEditor />
              {showChat && (
                <div className="border-t border-dark-border" style={{ height: '240px', flexShrink: 0 }}>
                  <ChatPanel messages={project.messages} onSend={handleSend} />
                </div>
              )}
              <button
                onClick={() => setShowChat(!showChat)}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-600 hover:text-gray-300 bg-dark-card/80 px-3 py-1 rounded-full border border-dark-border z-10"
              >
                {showChat ? '收起对话' : '展开对话'}
              </button>
            </div>
            <ConfigPanel />
          </>
        )
      case 'debug':
        return (
          <>
            <ToolPalette />
            <DebugView />
            <ConfigPanel />
          </>
        )
      case 'monitor':
        return (
          <>
            <ToolPalette />
            <MonitorView project={project} />
            <ConfigPanel />
          </>
        )
      case 'publish':
        return (
          <>
            <ToolPalette />
            <PublishView />
            <ConfigPanel />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar projectName={project.topic} />
      <div className="flex-1 flex overflow-hidden">
        {renderMainContent()}
      </div>
    </div>
  )
}
