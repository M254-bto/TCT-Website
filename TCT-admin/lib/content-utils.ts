import fs from 'fs'
import path from 'path'

// ─── Environment ──────────────────────────────────────────────────────────────

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER ?? 'M254-bto'
const GITHUB_REPO = process.env.GITHUB_REPO ?? 'TCT-Website'
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? 'main'
// Path prefix inside the repo where TCT/content lives
const CONTENT_PREFIX = 'TCT/content'

// Local-only (dev): path to the TCT content folder on disk
const LOCAL_CONTENT_DIR = path.resolve(
  process.cwd(),
  process.env.CONTENT_DIR ?? '../TCT/content'
)

const isProd = Boolean(GITHUB_TOKEN)

// ─── GitHub Contents API helpers ─────────────────────────────────────────────

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

async function ghGetDir(
  repoPath: string
): Promise<{ name: string; path: string; sha: string; type: string }[]> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${repoPath}?ref=${GITHUB_BRANCH}`
  const res = await fetch(url, { headers: ghHeaders(), cache: 'no-store' })
  if (!res.ok) throw new Error(`GitHub GET dir ${repoPath} → ${res.status}`)
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

async function ghDelete(repoPath: string, sha: string, message: string): Promise<void> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${repoPath}`
  const res = await fetch(url, {
    method: 'DELETE',
    headers: ghHeaders(),
    body: JSON.stringify({ message, sha, branch: GITHUB_BRANCH }),
  })
  if (!res.ok) throw new Error(`GitHub DELETE ${repoPath} → ${res.status}`)
}

// ─── Shared utilities ─────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ─── JSON CRUD ────────────────────────────────────────────────────────────────

export async function readJson<T>(filename: string): Promise<T> {
  if (!isProd) {
    const raw = fs.readFileSync(path.join(LOCAL_CONTENT_DIR, filename), 'utf8')
    return JSON.parse(raw) as T
  }
  const { content } = await ghGet(`${CONTENT_PREFIX}/${filename}`)
  return JSON.parse(Buffer.from(content, 'base64').toString('utf8')) as T
}

export async function writeJson(filename: string, data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2) + '\n'
  if (!isProd) {
    fs.writeFileSync(path.join(LOCAL_CONTENT_DIR, filename), json, 'utf8')
    return
  }
  const repoPath = `${CONTENT_PREFIX}/${filename}`
  let sha: string | undefined
  try {
    sha = (await ghGet(repoPath)).sha
  } catch {
    // File does not exist yet — create it (no sha needed)
  }
  await ghPut(repoPath, Buffer.from(json).toString('base64'), `chore: update ${filename}`, sha)
}


