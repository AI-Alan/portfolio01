import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import connectDB from '@/lib/db'
import Blog from '@/models/Blog'
import { isAuthenticated } from '@/lib/auth'
import { slugify, calculateReadTime } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const adminView = searchParams.get('admin') === 'true' && isAuthenticated(req)
    const query = adminView ? {} : { published: true }
    const blogs = await Blog.find(query).sort({ createdAt: -1 }).select('-content').lean()
    return NextResponse.json(
      { success: true, data: blogs },
      {
        headers: {
          'Cache-Control': adminView
            ? 'private, no-store'
            : 'public, s-maxage=1800, stale-while-revalidate=86400',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    body.slug = body.slug || slugify(body.title)
    body.readTime = calculateReadTime(body.content)
    const blog = await Blog.create(body)
    revalidateTag('blogs-data')
    return NextResponse.json({ success: true, data: blog }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}
