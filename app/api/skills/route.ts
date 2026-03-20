import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import connectDB from '@/lib/db'
import Skill from '@/models/Skill'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const skills = await Skill.find().sort({ category: 1, level: -1 }).lean()
    return NextResponse.json(
      { success: true, data: skills },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const skill = await Skill.create(body)
    revalidateTag('skills-data')
    return NextResponse.json({ success: true, data: skill }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}
