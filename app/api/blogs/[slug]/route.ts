import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Blog from '@/models/Blog'
import { isAuthenticated } from '@/lib/auth'
import { calculateReadTime } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB()
    const blog = await Blog.findOne({ slug: params.slug })
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: blog })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    if (body.content) body.readTime = calculateReadTime(body.content)
    const blog = await Blog.findOneAndUpdate({ slug: params.slug }, body, { new: true })
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: blog })
  } catch {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    await Blog.findOneAndDelete({ slug: params.slug })
    return NextResponse.json({ success: true, message: 'Blog deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}
