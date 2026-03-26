import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import connectDB from '@/lib/db'
import Experience from '@/models/Experience'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const exp = await Experience.find().sort({ current: -1, startDate: -1 }).lean()
    return NextResponse.json(
      { success: true, data: exp },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const exp = await Experience.create(body)
    revalidateTag('experience-data')
    return NextResponse.json({ success: true, data: exp }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const id = body?._id
    if (!id) return NextResponse.json({ error: 'Experience id is required' }, { status: 400 })
    delete body._id
    delete body.__v
    const exp = await Experience.findByIdAndUpdate(id, body, { new: true })
    if (!exp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    revalidateTag('experience-data')
    return NextResponse.json({ success: true, data: exp })
  } catch {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  return PUT(req)
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    await Experience.findByIdAndDelete(id)
    revalidateTag('experience-data')
    return NextResponse.json({ success: true, message: 'Deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
