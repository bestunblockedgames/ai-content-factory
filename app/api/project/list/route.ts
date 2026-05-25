import { NextRequest, NextResponse } from 'next/server'
import { listProjects, saveProject } from '@/lib/storage'
import { Project, ResearchResult, OutlineNode, ContentBlock, ChatMessage } from '@/types'

function generateResearch(topic: string): ResearchResult {
  const summaries = [
    `${topic}是当前热门话题，根据最新调研数据显示，相关领域市场规模持续增长，用户需求旺盛，技术迭代加速，竞争格局日趋激烈。`,
    `针对${topic}的深度调研发现，该领域在过去一年中增长了35%，主要驱动力来自技术创新和用户需求升级。行业专家预测未来三年将保持20%以上的复合增长率。`,
    `${topic}领域正在经历重大变革，AI技术的融入带来了全新的可能性。从用户体验到运营效率，各个环节都有显著提升空间。`,
  ]
  const keyPoints = [
    `${topic}市场规模预计2026年达到500亿，年增长率35%`,
    `用户群体以18-35岁为主，占比68%，移动端使用率超80%`,
    `核心技术栈：React/Next.js + AI + 云原生架构`,
    `主要竞争对手分析：头部玩家占据60%市场份额`,
    `2026年趋势：多模态交互、个性化推荐、实时协作`,
  ]
  const sources = [
    '艾瑞咨询2026行业报告',
    'Statista全球市场数据',
    '36氪深度调研',
    '知乎热门话题分析',
    '行业专家访谈记录',
  ]
  return {
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    keyPoints,
    sources,
  }
}

function generateOutline(topic: string): OutlineNode[] {
  const titles = [
    `${topic}的现状与背景`,
    `核心概念与原理`,
    `实战应用与案例`,
    `最佳实践与技巧`,
    `未来趋势与展望`,
  ]
  return titles.map((title, i) => ({
    id: `o${i + 1}`,
    title,
    level: 1,
    children: [],
  }))
}

function generateContent(topic: string): ContentBlock[] {
  return [
    { id: 'c1', type: 'heading', content: topic, order: 1 },
    { id: 'c2', type: 'paragraph', content: `本文将深入探讨${topic}的方方面面。从基础概念到实战应用，从最佳实践到未来趋势，帮助你全面了解这个领域。`, order: 2 },
    { id: 'c3', type: 'heading', content: '为什么关注这个话题', order: 3 },
    { id: 'c4', type: 'paragraph', content: `${topic}正在快速演进，掌握核心知识对职业发展至关重要。根据调研数据，相关岗位需求增长40%，薪资水平提升25%。`, order: 4 },
    { id: 'c5', type: 'list', content: `- 市场规模持续扩大\n- 技术迭代加速\n- 就业前景广阔\n- 创业机会丰富`, order: 5 },
  ]
}

function generateMessages(topic: string): ChatMessage[] {
  const now = Date.now()
  return [
    {
      id: 'msg-init-1',
      role: 'user',
      content: `帮我写一篇关于「${topic}」的文章`,
      timestamp: new Date(now - 60000).toISOString(),
    },
    {
      id: 'msg-init-2',
      role: 'assistant',
      content: `好的！我来帮你写一篇关于「${topic}」的深度文章。\n\n先进行一下调研...\n\n📊 调研发现：\n- 该领域市场规模持续增长\n- 用户需求旺盛，技术迭代加速\n- 2026年预计增长35%\n\n接下来我来构建文章大纲，你觉得这个方向怎么样？`,
      timestamp: new Date(now - 30000).toISOString(),
    },
  ]
}

export async function GET() {
  return NextResponse.json(listProjects())
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const topic = body.topic
  const now = new Date().toISOString()

  const project: Project = {
    id: crypto.randomUUID(),
    topic,
    stage: 'draft',
    research: generateResearch(topic),
    outline: generateOutline(topic),
    content: generateContent(topic),
    images: [],
    exports: [],
    messages: generateMessages(topic),
    createdAt: now,
    updatedAt: now,
  }

  saveProject(project)
  return NextResponse.json(project)
}
