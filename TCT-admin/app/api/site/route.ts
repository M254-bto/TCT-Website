import { NextRequest, NextResponse } from 'next/server'
import { readJson, writeJson } from '@/lib/content-utils'

export async function GET() {
  try {
    return NextResponse.json(readJson('site.json'))
  } catch {
    return NextResponse.json({ error: 'Read failed' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    writeJson('site.json', body)
    return NextResponse.json(body)
  } catch {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
