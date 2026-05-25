'use client'

import { useState } from 'react'
import { useWorkflowStore } from '@/store/useWorkflowStore'

const mockLogs = [
  { time: '10:00:01', node: '开始', status: 'success', msg: '接收输入主题: AI写作助手完全指南' },
  { time: '10:00:02', node: '网络搜索', status: 'running', msg: '正在搜索: AI写作助手 2026 趋势...' },
  { time: '10:00:03', node: '网络搜索', status: 'success', msg: '搜索完成，找到 12 条相关结果' },
  { time: '10:00:04', node: '知识库检索', status: 'running', msg: '检索内部知识库...' },
  { time: '10:00:05', node: '知识库检索', status: 'success', msg: '匹配到 8 篇相关文档' },
  { time: '10:00:06', node: 'AI调研分析', status: 'running', msg: '调用 Claude Sonnet 分析调研数据...' },
  { time: '10:00:08', node: 'AI调研分析', status: 'success', msg: '调研报告生成完成 (2.1s, 1560 tokens)' },
  { time: '10:00:09', node: 'AI大纲生成', status: 'running', msg: '基于调研结果生成文章大纲...' },
  { time: '10:00:11', node: 'AI大纲生成', status: 'success', msg: '大纲生成完成: 5个主章节, 12个子章节' },
  { time: '10:00:12', node: 'AI初稿撰写', status: 'running', msg: '逐章节扩展内容...' },
  { time: '10:00:18', node: 'AI初稿撰写', status: 'success', msg: '初稿完成 (6.2s, 4520 tokens)' },
  { time: '10:00:19', node: '格式化输出', status: 'running', msg: '格式化 Markdown...' },
  { time: '10:00:19', node: '格式化输出', status: 'success', msg: '格式化完成' },
  { time: '10:00:20', node: '完成', status: 'success', msg: '全部流程执行完毕' },
]

export function DebugView() {
  const nodes = useWorkflowStore((s) => s.nodes)
  const [selectedLog, setSelectedLog] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left: execution log */}
      <div className="flex-1 flex flex-col border-r border-dark-border">
        <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300">执行日志</h3>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`text-xs px-3 py-1 rounded-md border transition-colors ${
              isRunning
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30 hover:bg-neon-cyan/20'
            }`}
          >
            {isRunning ? '停止调试' : '开始调试'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs">
          {mockLogs.map((log, i) => (
            <div
              key={i}
              onClick={() => setSelectedLog(i)}
              className={`flex items-start gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                selectedLog === i ? 'bg-neon-cyan/10' : 'hover:bg-dark-border/30'
              }`}
            >
              <span className="text-gray-600 w-16 shrink-0">{log.time}</span>
              <span
                className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                  log.status === 'success' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                }`}
              />
              <span className="text-neon-cyan w-24 shrink-0">[{log.node}]</span>
              <span className="text-gray-400">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: node status panel */}
      <div className="w-72 flex flex-col">
        <div className="px-4 py-3 border-b border-dark-border">
          <h3 className="text-sm font-semibold text-gray-300">节点状态</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {nodes.map((node) => {
            const logIdx = mockLogs.findIndex((l) => l.node === (node.data as { label?: string }).label)
            const status = logIdx >= 0 ? mockLogs[logIdx].status : 'pending'
            return (
              <div
                key={node.id}
                className="px-3 py-2 rounded-lg bg-dark-bg/60 border border-dark-border"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">{(node.data as { label?: string }).label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      status === 'success'
                        ? 'bg-green-500/10 text-green-400'
                        : status === 'running'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-gray-500/10 text-gray-500'
                    }`}
                  >
                    {status === 'success' ? '完成' : status === 'running' ? '运行中' : '等待'}
                  </span>
                </div>
                <div className="text-[10px] text-gray-600 mt-1">Type: {node.type}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
