'use client'

import { useMemo } from 'react'
import { useWorkflowStore } from '@/store/useWorkflowStore'
import { Project } from '@/types'

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function hashStr(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function generateMonitorData(project: Project) {
  const rand = seededRandom(hashStr(project.id))
  const msgCount = project.messages.length
  const contentCount = project.content.length
  const baseExec = Math.floor(rand() * 80) + 40 + msgCount * 3
  const successRate = (rand() * 8 + 90).toFixed(1)
  const avgDuration = (rand() * 12 + 8).toFixed(1)
  const totalTokens = Math.floor(rand() * 500 + 200 + contentCount * 50)

  const metrics = [
    { label: '总执行次数', value: `${baseExec}`, trend: `+${Math.floor(rand() * 20 + 5)}%`, color: 'text-neon-cyan' },
    { label: '成功率', value: `${successRate}%`, trend: `+${(rand() * 3 + 0.5).toFixed(1)}%`, color: 'text-green-400' },
    { label: '平均耗时', value: `${avgDuration}s`, trend: `-${(rand() * 5 + 1).toFixed(1)}s`, color: 'text-neon-blue' },
    { label: '总Token消耗', value: `${totalTokens}K`, trend: `+${Math.floor(rand() * 25 + 5)}%`, color: 'text-neon-magenta' },
  ]

  const errorTypes = ['AI调研分析节点超时', '网络搜索API限流', '知识库连接失败', 'LLM响应超时', '输出格式解析错误']

  const executions = Array.from({ length: 5 }, (_, i) => {
    const h = Math.floor(rand() * 12 + 8)
    const m = Math.floor(rand() * 60)
    const s = Math.floor(rand() * 60)
    const failed = i === 2 && rand() > 0.6
    return {
      id: `exec-${project.id.substring(0, 3)}-${String(i + 1).padStart(3, '0')}`,
      status: failed ? 'failed' : 'success',
      duration: `${(rand() * 20 + 5).toFixed(1)}s`,
      tokens: Math.floor(rand() * 6000 + 1500),
      startTime: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
      nodes: 9,
      error: failed ? errorTypes[Math.floor(rand() * errorTypes.length)] : undefined,
    }
  })

  return { metrics, executions }
}

export function MonitorView({ project }: { project: Project }) {
  const nodes = useWorkflowStore((s) => s.nodes)

  const { metrics, executions } = useMemo(() => generateMonitorData(project), [project.id])

  const nodeStats = useMemo(() => {
    const rand = seededRandom(hashStr(project.id + '-nodes'))
    return nodes.map((node) => ({
      id: node.id,
      label: (node.data as { label?: string }).label || 'Unknown',
      latency: Math.floor(rand() * 3000) + 300,
      calls: Math.floor(rand() * 120) + 15,
      successRate: (rand() * 8 + 91).toFixed(1),
      barWidth: Math.floor(rand() * 55 + 45),
    }))
  }, [project.id, nodes])

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-dark-card/60 border border-dark-border rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-2">{m.label}</div>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold ${m.color}`}>{m.value}</span>
              <span className="text-xs text-green-400 mb-1">{m.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Node Performance */}
      <div className="bg-dark-card/60 border border-dark-border rounded-xl">
        <div className="px-4 py-3 border-b border-dark-border">
          <h3 className="text-sm font-semibold text-gray-300">节点性能统计</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {nodeStats.map((ns) => (
              <div key={ns.id} className="flex items-center gap-4">
                <div className="w-32 text-xs text-gray-400 truncate">{ns.label}</div>
                <div className="flex-1 h-2 bg-dark-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue"
                    style={{ width: `${ns.barWidth}%` }}
                  />
                </div>
                <div className="w-16 text-right text-xs text-gray-500">{ns.latency}ms</div>
                <div className="w-12 text-right text-xs text-gray-500">{ns.calls}次</div>
                <div className="w-14 text-right text-xs text-green-400">{ns.successRate}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Executions */}
      <div className="bg-dark-card/60 border border-dark-border rounded-xl">
        <div className="px-4 py-3 border-b border-dark-border">
          <h3 className="text-sm font-semibold text-gray-300">最近执行记录</h3>
        </div>
        <div className="divide-y divide-dark-border">
          {executions.map((exec) => (
            <div key={exec.id} className="px-4 py-3 flex items-center gap-4 hover:bg-dark-border/20 transition-colors">
              <span
                className={`w-2 h-2 rounded-full ${
                  exec.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-xs text-gray-400 font-mono w-28">{exec.id}</span>
              <span className="text-xs text-gray-500 w-20">{exec.startTime}</span>
              <span className="text-xs text-gray-300 w-16">{exec.duration}</span>
              <span className="text-xs text-neon-blue w-20">{exec.tokens.toLocaleString()} tokens</span>
              <span className="text-xs text-gray-500 w-16">{exec.nodes} 节点</span>
              {exec.error && <span className="text-xs text-red-400 flex-1">{exec.error}</span>}
              {!exec.error && <span className="text-xs text-green-400 flex-1">执行成功</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
