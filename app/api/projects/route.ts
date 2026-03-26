import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import connectDB from '@/lib/db'
import Project from '@/models/Project'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const query: Record<string, unknown> = {}
    if (category && category !== 'All') query.category = category
    if (featured === 'true') query.featured = true

    const projects = await Project.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json(
      { success: true, data: projects },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const project = await Project.create(body)
    revalidateTag('projects-data')
    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'GET, POST, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
