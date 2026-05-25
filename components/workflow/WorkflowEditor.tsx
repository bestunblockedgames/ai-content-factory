'use client'

import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useWorkflowStore } from '@/store/useWorkflowStore'
import { nodeTypes } from './nodes'
import { AnimatedEdge } from './edges/AnimatedEdge'
import { ToolItem } from '@/types/workflow'
import { WorkflowNode } from '@/types/workflow'

const edgeTypes = { animated: AnimatedEdge }

function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()

  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange)
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange)
  const selectNode = useWorkflowStore((s) => s.selectNode)
  const addNode = useWorkflowStore((s) => s.addNode)

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow-type')
      const rawData = event.dataTransfer.getData('application/reactflow-data')
      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const toolData: ToolItem | null = rawData ? JSON.parse(rawData) : null
      const id = `${type}-${Date.now()}`

      const newNode: WorkflowNode = {
        id,
        type,
        position,
        data:
          type === 'llm'
            ? {
                label: 'LLM 节点',
                model: 'claude-sonnet-4-20250514',
                temperature: 0.7,
                topP: 1,
                maxTokens: 4096,
                systemPrompt: '你是一个AI内容创作助手。',
              }
            : type === 'start'
              ? { label: '开始' }
              : type === 'end'
                ? { label: '结束', outputFormat: 'markdown' }
                : {
                    label: toolData?.label || '工具',
                    toolType: toolData?.type || 'search',
                    endpoint: '',
                    parameters: {},
                    code: '',
                  },
      }

      addNode(newNode)
    },
    [screenToFlowPosition, addNode]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: WorkflowNode) => {
      selectNode(node.id)
    },
    [selectNode]
  )

  const onPaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        proOptions={{ hideAttribution: true }}
        style={{ background: '#0a0a0f' }}
        defaultEdgeOptions={{ type: 'animated', animated: true }}
      >
        <Background color="#1a1f2e" gap={20} size={1} />
        <Controls
          style={{
            background: '#1a1f2e',
            borderColor: '#2a3040',
            borderRadius: '8px',
          }}
        />
        <MiniMap
          nodeColor="#2a3040"
          maskColor="rgba(0,0,0,0.7)"
          style={{
            background: '#0f1419',
            border: '1px solid #2a3040',
            borderRadius: '8px',
          }}
        />
      </ReactFlow>
    </div>
  )
}

export function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  )
}
