import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from '@xyflow/react'
import { WorkflowNode, WorkflowEdge, WorkflowNodeData, WorkflowState, ToolType } from '@/types/workflow'
import { Stage } from '@/types'

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

const toolConfigs: Record<ToolType, { label: string; code?: string; endpoint?: string }> = {
  search: { label: '网络搜索' },
  knowledge: { label: '知识库检索' },
  http: { label: 'HTTP 请求', endpoint: 'https://api.example.com' },
  code: { label: '代码执行', code: 'console.log("hello")' },
  python: { label: 'Python 执行', code: 'print("hello")' },
  sql: { label: 'SQL 查询' },
  llm: { label: 'LLM 推理' },
}

const llmConfigs = [
  { label: 'AI 调研分析', systemPrompt: '你是专业的调研分析师，负责搜索和整理信息。', temperature: 0.3 },
  { label: 'AI 大纲生成', systemPrompt: '你是资深内容策划，负责生成文章大纲。', temperature: 0.5 },
  { label: 'AI 初稿撰写', systemPrompt: '你是专业撰稿人，负责撰写深度文章。', temperature: 0.7 },
  { label: 'AI 内容润色', systemPrompt: '你是文字编辑，负责优化文章质量和可读性。', temperature: 0.6 },
  { label: 'AI 标题优化', systemPrompt: '你是标题党专家，负责生成吸引眼球的标题。', temperature: 0.8 },
  { label: 'AI SEO优化', systemPrompt: '你是SEO专家，负责优化关键词和结构。', temperature: 0.4 },
]

function generateWorkflowFromProject(projectId: string, stage: Stage, topic: string) {
  const rand = seededRandom(hashStr(projectId))
  const nodeCount = Math.floor(rand() * 4) + 6
  const nodes: WorkflowNode[] = []
  const edges: WorkflowEdge[] = []

  nodes.push({
    id: 'start-1',
    type: 'start',
    position: { x: 30, y: 250 },
    data: { label: '输入主题' },
  })

  const toolTypes: ToolType[] = ['search', 'knowledge', 'code', 'python', 'sql', 'http']
  const stageTools: Record<Stage, ToolType[]> = {
    research: ['search', 'knowledge'],
    outline: ['knowledge', 'code'],
    draft: ['code', 'python'],
    images: ['code', 'http'],
    publish: ['http', 'code'],
  }
  const selectedTools = stageTools[stage] || ['search', 'knowledge']

  const toolNodeIds: string[] = []
  selectedTools.forEach((toolType, i) => {
    const id = `tool-${toolType}-${i}`
    toolNodeIds.push(id)
    const cfg = toolConfigs[toolType]
    nodes.push({
      id,
      type: 'tool',
      position: { x: 220, y: 80 + i * 200 },
      data: {
        label: cfg.label,
        toolType,
        endpoint: cfg.endpoint,
        code: cfg.code,
      },
    })
  })

  const llmCount = Math.min(Math.floor(rand() * 3) + 2, llmConfigs.length)
  const shuffledLlms = [...llmConfigs].sort(() => rand() - 0.5).slice(0, llmCount)
  const llmNodeIds: string[] = []

  shuffledLlms.forEach((cfg, i) => {
    const id = `llm-${i}`
    llmNodeIds.push(id)
    nodes.push({
      id,
      type: 'llm',
      position: { x: 480 + i * 260, y: 150 + (i % 2) * 120 },
      data: {
        label: cfg.label,
        model: 'claude-sonnet-4-20250514',
        temperature: cfg.temperature,
        topP: 1,
        maxTokens: 4096,
        systemPrompt: cfg.systemPrompt,
      },
    })
  })

  const extraToolCount = Math.floor(rand() * 2) + 1
  const extraToolIds: string[] = []
  for (let i = 0; i < extraToolCount; i++) {
    const toolType = toolTypes[Math.floor(rand() * toolTypes.length)]
    const id = `tool-extra-${i}`
    extraToolIds.push(id)
    const cfg = toolConfigs[toolType]
    nodes.push({
      id,
      type: 'tool',
      position: { x: 480 + llmCount * 260 + 60, y: 60 + i * 200 },
      data: {
        label: cfg.label + ' (后处理)',
        toolType,
        endpoint: cfg.endpoint,
        code: cfg.code,
      },
    })
  }

  nodes.push({
    id: 'end-1',
    type: 'end',
    position: { x: 480 + llmCount * 260 + (extraToolCount > 0 ? 300 : 100), y: 250 },
    data: { label: '完成', outputFormat: 'markdown' },
  })

  edges.push({
    id: 'e-start-t0',
    source: 'start-1',
    target: toolNodeIds[0] || llmNodeIds[0],
    animated: true,
  })
  if (toolNodeIds.length > 1) {
    edges.push({
      id: 'e-start-t1',
      source: 'start-1',
      target: toolNodeIds[1],
      animated: true,
    })
  }

  toolNodeIds.forEach((tid, i) => {
    const nextTarget = i === 0 ? llmNodeIds[0] : llmNodeIds[0]
    edges.push({
      id: `e-${tid}-llm0`,
      source: tid,
      target: nextTarget,
      animated: true,
    })
  })

  llmNodeIds.forEach((lid, i) => {
    if (i < llmNodeIds.length - 1) {
      edges.push({
        id: `e-${lid}-${llmNodeIds[i + 1]}`,
        source: lid,
        target: llmNodeIds[i + 1],
        animated: true,
      })
    }
  })

  if (extraToolIds.length > 0) {
    const lastLlm = llmNodeIds[llmNodeIds.length - 1]
    edges.push({
      id: `e-${lastLlm}-${extraToolIds[0]}`,
      source: lastLlm,
      target: extraToolIds[0],
      animated: true,
    })
    extraToolIds.forEach((tid, i) => {
      if (i < extraToolIds.length - 1) {
        edges.push({
          id: `e-${tid}-${extraToolIds[i + 1]}`,
          source: tid,
          target: extraToolIds[i + 1],
          animated: true,
        })
      }
    })
    edges.push({
      id: `e-${extraToolIds[extraToolIds.length - 1]}-end`,
      source: extraToolIds[extraToolIds.length - 1],
      target: 'end-1',
      animated: true,
    })
  } else {
    const lastLlm = llmNodeIds[llmNodeIds.length - 1]
    edges.push({
      id: `e-${lastLlm}-end`,
      source: lastLlm,
      target: 'end-1',
      animated: true,
    })
  }

  if (rand() > 0.5 && llmNodeIds.length > 1) {
    const fromLlm = llmNodeIds[Math.floor(rand() * (llmNodeIds.length - 1))]
    const toNode = extraToolIds.length > 0 ? extraToolIds[0] : 'end-1'
    if (fromLlm !== toNode) {
      edges.push({
        id: `e-extra-${fromLlm}`,
        source: fromLlm,
        target: toNode,
        animated: true,
        label: '快捷通道',
      })
    }
  }

  return { nodes, edges }
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  mode: 'orchestrate',

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes as NodeChange<WorkflowNode>[], state.nodes) as WorkflowNode[],
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes as EdgeChange<WorkflowEdge>[], state.edges),
    })),

  selectNode: (id) => set({ selectedNodeId: id }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  setMode: (mode) => set({ mode }),

  loadProjectWorkflow: (projectId: string, stage: Stage, topic: string) => {
    const { nodes, edges } = generateWorkflowFromProject(projectId, stage, topic)
    set({ nodes, edges, selectedNodeId: null })
  },
}))
