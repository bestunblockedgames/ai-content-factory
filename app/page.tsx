'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeonButton } from '@/components/ui/NeonButton'
import { Project } from '@/types'

const loadingSteps = [
  '正在分析主题...',
  '正在搜索互联网资料...',
  '正在检索知识库...',
  '正在整理调研数据...',
  '正在生成文章大纲...',
  '正在撰写引言章节...',
  '正在撰写核心章节...',
  '正在撰写总结章节...',
  '正在添加代码示例...',
  '正在生成配图建议...',
  '正在优化文章结构...',
  '正在检查语法错误...',
  '正在优化SEO关键词...',
  '正在生成多平台版本...',
  '正在最终审核...',
]

export default function HomePage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('/api/project/list')
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => {})
  }, [])

  const handleCreate = async () => {
    if (!topic.trim() || loading) return
    setLoading(true)
    setLoadingStep(0)

    stepTimer.current = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          if (stepTimer.current) clearInterval(stepTimer.current)
          return prev
        }
        return prev + 1
      })
    }, 3000)

    try {
      const res = await fetch('/api/project/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      })
      const project = await res.json()

      await new Promise((r) => setTimeout(r, 50000))

      if (stepTimer.current) clearInterval(stepTimer.current)
      router.push(`/project/${project.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            AI <span className="text-neon-cyan">内容工厂</span>
          </h1>
          <p className="text-gray-500">输入主题，AI 自动完成调研、写作、配图、发布</p>
        </motion.div>

        <GlassCard className="mb-8">
          {loading ? (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-300">正在创建「{topic}」...</span>
              </div>
              <div className="space-y-2">
                {loadingSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        i < loadingStep
                          ? 'bg-neon-cyan/20 text-neon-cyan'
                          : i === loadingStep
                            ? 'bg-neon-cyan/10 text-neon-cyan animate-pulse'
                            : 'bg-dark-border text-gray-600'
                      }`}
                    >
                      {i < loadingStep ? '✓' : i + 1}
                    </span>
                    <span
                      className={`text-xs transition-colors ${
                        i <= loadingStep ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="输入你想写的主题..."
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-neon-cyan/50"
              />
              <NeonButton onClick={handleCreate} disabled={loading}>
                开始创作
              </NeonButton>
            </div>
          )}
        </GlassCard>

        {projects.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-4">最近项目</h2>
            <div className="grid gap-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/project/${p.id}`)}
                >
                  <GlassCard hover>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-200">{p.topic}</span>
                      <span className="text-xs text-gray-600">
                        {new Date(p.updatedAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
