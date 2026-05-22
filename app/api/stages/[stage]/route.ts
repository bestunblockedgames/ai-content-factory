import { NextRequest, NextResponse } from 'next/server'
import { loadProject, saveProject } from '@/lib/storage'
import { runResearch, runOutline, runDraft, runImages } from '@/lib/stages'

const stageRunners: Record<string, (p: any) => Promise<any>> = {
  research: runResearch,
  outline: runOutline,
  draft: runDraft,
  images: runImages,
}

export async function POST(
  request: NextRequest,
  { params }: { params: { stage: string } }
) {
  const body = await request.json()
  const project = loadProject(body.projectId)
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const runner = stageRunners[params.stage]
  if (!runner) {
    return NextResponse.json({ error: 'Invalid stage' }, { status: 400 })
  }

  try {
    const updated = await runner(project)
    saveProject(updated)
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Stage execution failed' }, { status: 500 })
  }
}
