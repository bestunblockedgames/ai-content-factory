import { NextRequest, NextResponse } from 'next/server'
import { listProjects, saveProject } from '@/lib/storage'
import { Project } from '@/types'

export async function GET() {
  return NextResponse.json(listProjects())
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const project: Project = {
    id: crypto.randomUUID(),
    topic: body.topic,
    stage: 'research',
    research: null,
    outline: null,
    content: [],
    images: [],
    exports: [],
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  saveProject(project)
  return NextResponse.json(project)
}
