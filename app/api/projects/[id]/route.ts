import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import connectDB from '@/lib/db'
import Project from '@/models/Project'
import { isAuthenticated } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const project = await Project.findById(params.id).lean()
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(
      { success: true, data: project },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const project = await Project.findByIdAndUpdate(params.id, body, { new: true })
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    revalidateTag('projects-data')
    return NextResponse.json({ success: true, data: project })
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    await Project.findByIdAndDelete(params.id)
    revalidateTag('projects-data')
    return NextResponse.json({ success: true, message: 'Project deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
