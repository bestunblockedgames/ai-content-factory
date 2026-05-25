import { Node, Edge } from '@xyflow/react'
import { Stage } from './index'

export type ToolType = 'llm' | 'search' | 'http' | 'code' | 'knowledge' | 'sql' | 'python' | 'custom'

export interface ToolItem {
  type: ToolType
  label: string
  icon: string
  category: 'ai' | 'data' | 'code' | 'logic'
  description: string
  defaultConfig: Record<string, unknown>
}

export interface LLMNodeData extends Record<string, unknown> {
  label: string
  model: string
  temperature: number
  topP: number
  maxTokens: number
  systemPrompt: string
}

export interface ToolNodeData extends Record<string, unknown> {
  label: string
  toolType: ToolType
  endpoint?: string
  parameters?: Record<string, string>
  code?: string
  description?: string
  params?: Record<string, string>
}

export interface StartNodeData extends Record<string, unknown> {
  label: string
}

export interface EndNodeData extends Record<string, unknown> {
  label: string
  outputFormat: string
}

export type WorkflowNodeData = LLMNodeData | ToolNodeData | StartNodeData | EndNodeData

export type WorkflowNode = Node<WorkflowNodeData>
export type WorkflowEdge = Edge

export interface WorkflowState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string | null
  mode: 'orchestrate' | 'debug' | 'monitor' | 'publish'

  setNodes: (nodes: WorkflowNode[]) => void
  setEdges: (edges: WorkflowEdge[]) => void
  onNodesChange: (changes: unknown[]) => void
  onEdgesChange: (changes: unknown[]) => void
  selectNode: (id: string | null) => void
  addNode: (node: WorkflowNode) => void
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void
  deleteNode: (id: string) => void
  setMode: (mode: WorkflowState['mode']) => void
  loadProjectWorkflow: (projectId: string, stage: Stage, topic: string) => void
}
