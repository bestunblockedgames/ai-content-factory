import { generateContent } from './ai'
import { Project, ResearchResult, OutlineNode, ContentBlock, ImageSuggestion } from '@/types'

const RESEARCH_PROMPT = `你是一个专业的互联网内容调研员。根据用户给定的主题，生成一份调研报告。
输出格式为 JSON：
{
  "summary": "主题概述（2-3句话）",
  "keyPoints": ["关键点1", "关键点2", "关键点3"],
  "sources": ["参考来源1", "参考来源2"]
}
只输出 JSON，不要其他内容。`

const OUTLINE_PROMPT = `你是一个资深内容策划师。根据调研结果，为文章生成大纲。
输出格式为 JSON 数组：
[{"id": "1", "title": "章节标题", "level": 1, "children": []}]
只输出 JSON，不要其他内容。`

const DRAFT_PROMPT = `你是一个专业的内容创作者。根据大纲逐段撰写文章内容。
每段输出一个 content block，格式为 JSON：
[{"id": "1", "type": "paragraph", "content": "段落内容", "order": 1}]
只输出 JSON，不要其他内容。`

const IMAGES_PROMPT = `你是一个视觉策划师。根据文章内容，推荐配图方案。
输出格式为 JSON 数组：
[{"id": "1", "description": "图片描述", "placement": "放置位置", "style": "风格建议"}]
只输出 JSON，不要其他内容。`

export async function runResearch(project: Project): Promise<Project> {
  const result = await generateContent(
    `主题：${project.topic}`,
    RESEARCH_PROMPT
  )
  const research: ResearchResult = JSON.parse(result)
  return { ...project, research, stage: 'outline', updatedAt: new Date().toISOString() }
}

export async function runOutline(project: Project): Promise<Project> {
  const result = await generateContent(
    `主题：${project.topic}\n调研结果：${JSON.stringify(project.research)}`,
    OUTLINE_PROMPT
  )
  const outline: OutlineNode[] = JSON.parse(result)
  return { ...project, outline, stage: 'draft', updatedAt: new Date().toISOString() }
}

export async function runDraft(project: Project): Promise<Project> {
  const result = await generateContent(
    `主题：${project.topic}\n大纲：${JSON.stringify(project.outline)}`,
    DRAFT_PROMPT
  )
  const content: ContentBlock[] = JSON.parse(result)
  return { ...project, content, stage: 'images', updatedAt: new Date().toISOString() }
}

export async function runImages(project: Project): Promise<Project> {
  const result = await generateContent(
    `文章内容：${project.content.map(c => c.content).join('\n')}`,
    IMAGES_PROMPT
  )
  const images: ImageSuggestion[] = JSON.parse(result)
  return { ...project, images, stage: 'publish', updatedAt: new Date().toISOString() }
}
