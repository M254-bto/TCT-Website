import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER ?? 'M254-bto'
const GITHUB_REPO = process.env.GITHUB_REPO ?? 'TCT-Website'
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? 'main'
const isProd = Boolean(GITHUB_TOKEN)

function ghHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

async function ghGet(repoPath: string): Promise<{ content: string; sha: string }> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${repoPath}?ref=${GITHUB_BRANCH}`
  const res = await fetch(url, { headers: ghHeaders(), cache: 'no-store' })
  if (!res.ok) throw new Error(`GitHub GET ${repoPath} → ${res.status}`)
  return res.json()
}

async function ghPut(
  repoPath: string,
  contentBase64: string,
  message: string,
  sha?: string
): Promise<void> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${repoPath}`
  const body: Record<string, unknown> = {
    message,
    content: contentBase64,
    branch: GITHUB_BRANCH,
  }
  if (sha) body.sha = sha
  const res = await fetch(url, { method: 'PUT', headers: ghHeaders(), body: JSON.stringify(body) })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub PUT ${repoPath} → ${res.status}: ${text}`)
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique name
    const ext = path.extname(file.name) || '.jpg'
    const nameWithoutExt = path.basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
    const uniqueName = `${nameWithoutExt}-${Date.now()}${ext}`

    const relativePath = `/images/${uniqueName}`

    if (!isProd) {
      // Local path
      const publicDir = path.resolve(process.cwd(), '../TCT/public/images')
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }
      fs.writeFileSync(path.join(publicDir, uniqueName), buffer)
    } else {
      // Production writing via GitHub API
      const repoPath = `TCT/public/images/${uniqueName}`
      let sha: string | undefined
      try {
        sha = (await ghGet(repoPath)).sha
      } catch {
        // File does not exist yet
      }
      await ghPut(repoPath, buffer.toString('base64'), `chore: upload image ${uniqueName}`, sha)
    }

    return NextResponse.json({ url: relativePath })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 })
  }
}
