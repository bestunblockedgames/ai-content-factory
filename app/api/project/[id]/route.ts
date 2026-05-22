import { NextRequest, NextResponse } from 'next/server'
import { loadProject, saveProject } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = loadProject(params.id)
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
  return NextResponse.json(project)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const project = loadProject(params.id)
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
  const updated = { ...project, ...body, updatedAt: new Date().toISOString() }
  saveProject(updated)
  return NextResponse.json(updated)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { deleteProject } = await import('@/lib/storage')
  deleteProject(params.id)
  return NextResponse.json({ ok: true })
}
