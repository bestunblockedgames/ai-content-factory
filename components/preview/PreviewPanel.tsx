'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { MarkdownRenderer } from './MarkdownRenderer'
import { ContentBlock } from '@/types'

interface PreviewPanelProps {
  content: ContentBlock[]
  topic: string
}

type Tab = 'preview' | 'wechat' | 'zhihu' | 'twitter'

const tabs: { key: Tab; label: string }[] = [
  { key: 'preview', label: '预览' },
  { key: 'wechat', label: '公众号' },
  { key: 'zhihu', label: '知乎' },
  { key: 'twitter', label: 'Twitter' },
]

export function PreviewPanel({ content, topic }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preview')

  const markdown = content
    .sort((a, b) => a.order - b.order)
    .map((block) => {
      switch (block.type) {
        case 'heading': return `## ${block.content}`
        case 'paragraph': return block.content
        case 'list': return block.content.split('\n').map(i => `- ${i}`).join('\n')
        case 'code': return `\`\`\`\n${block.content}\n\`\`\``
        default: return block.content
      }
    })
    .join('\n\n')

  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex items-center gap-1 border-b border-dark-border px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
              activeTab === tab.key
                ? 'bg-neon-cyan/20 text-neon-cyan'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {content.length === 0 ? (
              <div className="text-center text-gray-600 text-sm mt-8">
                {topic ? '开始创作后这里会显示预览' : '输入主题开始创作'}
              </div>
            ) : activeTab === 'preview' ? (
              <MarkdownRenderer content={markdown} />
            ) : (
              <div className="text-center text-gray-500 text-sm mt-8">
                {tabs.find(t => t.key === activeTab)?.label} 适配格式
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </GlassCard>
  )
}
