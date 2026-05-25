'use client'

import { useWorkflowStore } from '@/store/useWorkflowStore'
import { LLMNodeData, ToolNodeData } from '@/types/workflow'

const models = [
  'claude-sonnet-4-20250514',
  'claude-haiku-4-5-20251001',
  'gpt-4o',
  'gpt-4o-mini',
]

export function ConfigPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId)
  const nodes = useWorkflowStore((s) => s.nodes)
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  if (!selectedNode) {
    return (
      <div className="w-72 h-full border-l border-dark-border bg-dark-card/50 flex items-center justify-center">
        <p className="text-sm text-gray-600">选择节点查看配置</p>
      </div>
    )
  }

  const update = (key: string, value: unknown) => {
    updateNodeData(selectedNode.id, { [key]: value })
  }

  if (selectedNode.type === 'llm') {
    const d = selectedNode.data as unknown as LLMNodeData
    return (
      <div className="w-72 h-full border-l border-dark-border bg-dark-card/50 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-dark-border">
          <h3 className="text-sm font-semibold text-gray-300">LLM 配置</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Field label="节点名称">
            <input value={d.label || ''} onChange={(e) => update('label', e.target.value)} className="input-field" />
          </Field>
          <Field label="模型">
            <select value={d.model || ''} onChange={(e) => update('model', e.target.value)} className="input-field">
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label={`温度: ${d.temperature ?? 0.7}`}>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={d.temperature ?? 0.7}
              onChange={(e) => update('temperature', parseFloat(e.target.value))}
              className="w-full accent-neon-cyan"
            />
          </Field>
          <Field label="System Prompt">
            <textarea
              value={d.systemPrompt || ''}
              onChange={(e) => update('systemPrompt', e.target.value)}
              rows={4}
              className="input-field resize-none"
            />
          </Field>
        </div>
      </div>
    )
  }

  if (selectedNode.type === 'tool') {
    const d = selectedNode.data as unknown as ToolNodeData
    return (
      <div className="w-72 h-full border-l border-dark-border bg-dark-card/50 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-dark-border">
          <h3 className="text-sm font-semibold text-gray-300">工具配置</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Field label="节点名称">
            <input value={d.label || ''} onChange={(e) => update('label', e.target.value)} className="input-field" />
          </Field>
          <Field label="工具类型">
            <div className="text-xs text-neon-cyan font-mono">{d.toolType}</div>
          </Field>
          {d.toolType === 'http' && (
            <Field label="端点 URL">
              <input value={d.endpoint || ''} onChange={(e) => update('endpoint', e.target.value)} className="input-field" placeholder="https://api.example.com" />
            </Field>
          )}
          {(d.toolType === 'code' || d.toolType === 'python') && (
            <Field label="代码">
              <textarea
                value={d.code || ''}
                onChange={(e) => update('code', e.target.value)}
                rows={6}
                className="input-field font-mono text-xs resize-none"
                placeholder={d.toolType === 'python' ? 'print("hello")' : 'console.log("hello")'}
              />
            </Field>
          )}
        </div>
      </div>
    )
  }

  if (selectedNode.type === 'custom') {
    const d = selectedNode.data as unknown as ToolNodeData
    return (
      <div className="w-72 h-full border-l border-dark-border bg-dark-card/50 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-dark-border">
          <h3 className="text-sm font-semibold text-gray-300">自定义节点配置</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Field label="节点名称">
            <input value={d.label || ''} onChange={(e) => update('label', e.target.value)} className="input-field" />
          </Field>
          <Field label="描述">
            <textarea
              value={d.description || ''}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="描述此节点的用途..."
            />
          </Field>
          <Field label="自定义参数">
            <textarea
              value={JSON.stringify(d.params || {}, null, 2)}
              onChange={(e) => {
                try {
                  update('params', JSON.parse(e.target.value))
                } catch {}
              }}
              rows={6}
              className="input-field font-mono text-xs resize-none"
              placeholder={'{"key": "value"}'}
            />
          </Field>
        </div>
      </div>
    )
  }

  // Start/End nodes
  return (
    <div className="w-72 h-full border-l border-dark-border bg-dark-card/50 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-border">
        <h3 className="text-sm font-semibold text-gray-300">
          {selectedNode.type === 'start' ? '开始节点' : '结束节点'}配置
        </h3>
      </div>
      <div className="flex-1 p-4 space-y-4">
        <Field label="节点名称">
          <input
            value={(selectedNode.data as { label?: string }).label || ''}
            onChange={(e) => update('label', e.target.value)}
            className="input-field"
          />
        </Field>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
