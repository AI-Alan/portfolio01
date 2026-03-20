import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Experience from '@/models/Experience'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const exp = await Experience.find().sort({ current: -1, startDate: -1 })
    return NextResponse.json({ success: true, data: exp })
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
    return NextResponse.json({ success: true, data: exp }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    await Experience.findByIdAndDelete(id)
    return NextResponse.json({ success: true, message: 'Deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
