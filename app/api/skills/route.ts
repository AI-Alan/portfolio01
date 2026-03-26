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

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const id = body?._id
    if (!id) return NextResponse.json({ error: 'Skill id is required' }, { status: 400 })
    delete body._id
    delete body.__v
    const skill = await Skill.findByIdAndUpdate(id, body, { new: true })
    if (!skill) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    revalidateTag('skills-data')
    return NextResponse.json({ success: true, data: skill })
  } catch {
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  return PUT(req)
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'GET, POST, PUT, PATCH, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
