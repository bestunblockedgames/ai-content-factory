'use client'

import { ToolItem, ToolType } from '@/types/workflow'

const tools: ToolItem[] = [
  { type: 'llm', label: 'LLM', icon: '⚙', category: 'ai', description: '大语言模型推理', defaultConfig: { model: 'claude-sonnet-4-20250514', temperature: 0.7 } },
  { type: 'search', label: '网络搜索', icon: '🔍', category: 'data', description: '搜索互联网信息', defaultConfig: {} },
  { type: 'http', label: 'HTTP 请求', icon: '🌐', category: 'data', description: '调用外部 API', defaultConfig: {} },
  { type: 'code', label: '代码执行', icon: '💻', category: 'code', description: '执行 JavaScript 代码', defaultConfig: {} },
  { type: 'knowledge', label: '知识库', icon: '📚', category: 'data', description: '检索知识库文档', defaultConfig: {} },
  { type: 'sql', label: 'SQL 查询', icon: '📊', category: 'data', description: '查询数据库', defaultConfig: {} },
  { type: 'python', label: 'Python', icon: '🐍', category: 'code', description: '执行 Python 脚本', defaultConfig: {} },
  { type: 'custom', label: '自定义节点', icon: '✦', category: 'logic', description: '可配置的自定义逻辑', defaultConfig: {} },
]

const categories = [
  { key: 'ai' as const, label: 'AI' },
  { key: 'data' as const, label: '数据' },
  { key: 'code' as const, label: '代码' },
  { key: 'logic' as const, label: '逻辑' },
]

export function ToolPalette() {
  const onDragStart = (event: React.DragEvent, tool: ToolItem) => {
    event.dataTransfer.setData('application/reactflow-type', tool.type === 'llm' ? 'llm' : tool.type === 'custom' ? 'custom' : 'tool')
    event.dataTransfer.setData('application/reactflow-data', JSON.stringify(tool))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-56 h-full border-r border-dark-border bg-dark-card/50 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-border">
        <h3 className="text-sm font-semibold text-gray-300">组件库</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map((cat) => (
          <div key={cat.key}>
            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">{cat.label}</div>
            <div className="space-y-1.5">
              {tools
                .filter((t) => t.category === cat.key)
                .map((tool) => (
                  <div
                    key={tool.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, tool)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-dark-bg/60 border border-dark-border hover:border-neon-cyan/40 cursor-grab active:cursor-grabbing transition-colors group"
                  >
                    <span className="text-base">{tool.icon}</span>
                    <div>
                      <div className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                        {tool.label}
                      </div>
                      <div className="text-[10px] text-gray-600">{tool.description}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
