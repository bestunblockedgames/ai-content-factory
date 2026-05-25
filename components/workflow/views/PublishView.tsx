'use client'

import { useState } from 'react'

const platforms = [
  { id: 'wechat', name: '微信公众号', icon: '💬', status: 'ready', color: 'text-green-400' },
  { id: 'zhihu', name: '知乎专栏', icon: '📖', status: 'ready', color: 'text-green-400' },
  { id: 'xiaohongshu', name: '小红书', icon: '📕', status: 'ready', color: 'text-green-400' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', status: 'ready', color: 'text-green-400' },
  { id: 'juejin', name: '掘金', icon: '⛏️', status: 'config', color: 'text-yellow-400' },
  { id: 'csdn', name: 'CSDN', icon: '💻', status: 'config', color: 'text-yellow-400' },
]

export function PublishView() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['wechat', 'zhihu'])
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState<string[]>([])

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handlePublish = () => {
    setPublishing(true)
    setTimeout(() => {
      setPublished(selectedPlatforms)
      setPublishing(false)
    }, 2000)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">发布到多平台</h2>
          <p className="text-sm text-gray-500 mt-1">选择要发布的平台，一键同步内容</p>
        </div>
        <button
          onClick={handlePublish}
          disabled={selectedPlatforms.length === 0 || publishing}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedPlatforms.length === 0 || publishing
              ? 'bg-dark-border text-gray-600 cursor-not-allowed'
              : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20'
          }`}
        >
          {publishing ? '发布中...' : `发布到 ${selectedPlatforms.length} 个平台`}
        </button>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id)
          const isPublished = published.includes(platform.id)
          return (
            <div
              key={platform.id}
              onClick={() => !publishing && togglePlatform(platform.id)}
              className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-neon-cyan/5 border-neon-cyan/40 shadow-[0_0_15px_rgba(0,245,212,0.1)]'
                  : 'bg-dark-card/60 border-dark-border hover:border-gray-600'
              } ${publishing ? 'pointer-events-none opacity-60' : ''}`}
            >
              {isPublished && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
              )}
              <div className="text-2xl mb-2">{platform.icon}</div>
              <div className="text-sm font-medium text-gray-200">{platform.name}</div>
              <div className={`text-xs mt-1 ${platform.color}`}>
                {isPublished ? '已发布' : platform.status === 'ready' ? '已授权' : '需配置'}
              </div>
              {isSelected && !isPublished && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-md bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/40">
                  <span className="text-neon-cyan text-xs">✓</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Preview */}
      <div className="bg-dark-card/60 border border-dark-border rounded-xl">
        <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300">内容预览</h3>
          <div className="flex gap-2">
            {selectedPlatforms.map((id) => {
              const p = platforms.find((pl) => pl.id === id)
              return (
                <span key={id} className="text-xs px-2 py-1 rounded bg-dark-bg text-gray-400">
                  {p?.icon} {p?.name}
                </span>
              )
            })}
          </div>
        </div>
        <div className="p-4">
          <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
            <div className="text-sm text-gray-300 mb-2">AI写作助手完全指南：如何用AI提升内容创作效率</div>
            <div className="text-xs text-gray-500 line-clamp-4">
              在信息爆炸的时代，内容创作者面临着前所未有的挑战：每天需要产出大量高质量内容，同时保持原创性和一致性。AI写作助手的出现，为这个问题提供了一个优雅的解决方案...
            </div>
            <div className="text-xs text-gray-600 mt-3">预计阅读时间: 12分钟 | 字数: 4,520</div>
          </div>
        </div>
      </div>

      {/* Publish History */}
      {published.length > 0 && (
        <div className="bg-dark-card/60 border border-dark-border rounded-xl">
          <div className="px-4 py-3 border-b border-dark-border">
            <h3 className="text-sm font-semibold text-gray-300">发布历史</h3>
          </div>
          <div className="divide-y divide-dark-border">
            {published.map((id) => {
              const p = platforms.find((pl) => pl.id === id)
              return (
                <div key={id} className="px-4 py-3 flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm text-gray-300">{p?.icon} {p?.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">刚刚发布</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
