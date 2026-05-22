import { NextRequest } from 'next/server'
import { loadProject, saveProject } from '@/lib/storage'
import { streamChat } from '@/lib/ai'
import { ChatMessage } from '@/types'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const project = loadProject(body.projectId)
  if (!project) {
    return new Response('Project not found', { status: 404 })
  }

  const userMsg: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: body.message,
    timestamp: new Date().toISOString(),
  }
  project.messages.push(userMsg)

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const chatMessages = project.messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      let fullResponse = ''
      try {
        for await (const chunk of streamChat(chatMessages, '你是一个AI内容创作助手。')) {
          fullResponse += chunk
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
        }

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date().toISOString(),
        }
        project.messages.push(assistantMsg)
        saveProject(project)

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
      } catch (error) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
