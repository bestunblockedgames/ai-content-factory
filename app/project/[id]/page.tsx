'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { PipelineBar } from '@/components/pipeline/PipelineBar'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { PreviewPanel } from '@/components/preview/PreviewPanel'
import { Project, Stage, STAGES } from '@/types'

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProject = useCallback(async () => {
    const res = await fetch(`/api/project/${projectId}`)
    if (res.ok) {
      setProject(await res.json())
    }
    setLoading(false)
  }, [projectId])

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
    setProject((p) => p ? { ...p, messages: [...p.messages, userMsg] } : p)

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

  const handleRunStage = async (stage: Stage) => {
    if (!project) return
    const res = await fetch(`/api/stages/${stage}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    })
    if (res.ok) {
      const updated = await res.json()
      setProject(updated)
    }
  }

  const completedStages = STAGES.filter((s) => {
    const idx = STAGES.indexOf(s)
    const currentIdx = STAGES.indexOf(project?.stage || 'research')
    return idx < currentIdx
  })

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title={project.topic} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
          <div className="w-[30%] min-w-[300px]">
            <ChatPanel
              messages={project.messages}
              onSend={handleSend}
            />
          </div>
          <div className="flex-1">
            <PreviewPanel
              content={project.content}
              topic={project.topic}
            />
          </div>
        </div>
        <div className="border-t border-dark-border">
          <PipelineBar
            currentStage={project.stage}
            completedStages={completedStages}
            onStageClick={handleRunStage}
          />
        </div>
      </div>
    </div>
  )
}
