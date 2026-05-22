'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeonButton } from '@/components/ui/NeonButton'
import { Project } from '@/types'

export default function HomePage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/project/list')
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => {})
  }, [])

  const handleCreate = async () => {
    if (!topic.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/project/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      })
      const project = await res.json()
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
              {loading ? '创建中...' : '开始创作'}
            </NeonButton>
          </div>
        </GlassCard>

        {projects.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-4">最近项目</h2>
            <div className="grid gap-3">
              {projects.map((p) => (
                <GlassCard
                  key={p.id}
                  hover
                  className="cursor-pointer"
                  onClick={() => router.push(`/project/${p.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200">{p.topic}</span>
                    <span className="text-xs text-gray-600">
                      {new Date(p.updatedAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
