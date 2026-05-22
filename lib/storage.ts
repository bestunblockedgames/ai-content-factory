import fs from 'fs'
import path from 'path'
import { Project } from '@/types'

const DATA_DIR = path.join(process.cwd(), 'data', 'projects')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function saveProject(project: Project): void {
  ensureDir()
  const filePath = path.join(DATA_DIR, `${project.id}.json`)
  fs.writeFileSync(filePath, JSON.stringify(project, null, 2))
}

export function loadProject(id: string): Project | null {
  ensureDir()
  const filePath = path.join(DATA_DIR, `${id}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function listProjects(): Project[] {
  ensureDir()
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'))
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf-8')))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function deleteProject(id: string): void {
  ensureDir()
  const filePath = path.join(DATA_DIR, `${id}.json`)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}
