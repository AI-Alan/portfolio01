import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import connectDB from '@/lib/db'
import PrivateNote from '@/models/PrivateNote'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const notes = await PrivateNote.find().sort({ updatedAt: -1 }).lean()
    return NextResponse.json({ success: true, data: notes })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch private notes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const note = await PrivateNote.create(body)
    revalidateTag('private-notes-data')
    return NextResponse.json({ success: true, data: note }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create private note' }, { status: 500 })
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
