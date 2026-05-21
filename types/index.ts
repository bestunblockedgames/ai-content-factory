export type Stage = 'research' | 'outline' | 'draft' | 'images' | 'publish'

export const STAGES: Stage[] = ['research', 'outline', 'draft', 'images', 'publish']

export const STAGE_LABELS: Record<Stage, string> = {
  research: '调研',
  outline: '大纲',
  draft: '初稿',
  images: '配图',
  publish: '发布',
}

export interface ResearchResult {
  summary: string
  keyPoints: string[]
  sources: string[]
}

export interface OutlineNode {
  id: string
  title: string
  level: number
  children: OutlineNode[]
}

export interface ContentBlock {
  id: string
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'image'
  content: string
  order: number
}

export interface ImageSuggestion {
  id: string
  description: string
  placement: string
  style: string
}

export interface PlatformExport {
  platform: 'wechat' | 'zhihu' | 'twitter' | 'xiaohongshu'
  content: string
  formattedAt: Date
}

export interface Project {
  id: string
  topic: string
  stage: Stage
  research: ResearchResult | null
  outline: OutlineNode[] | null
  content: ContentBlock[]
  images: ImageSuggestion[]
  exports: PlatformExport[]
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}
