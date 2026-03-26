import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import connectDB from '@/lib/db'
import PrivateNote from '@/models/PrivateNote'
import { isAuthenticated } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const note = await PrivateNote.findByIdAndUpdate(params.id, body, { new: true })
    if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    revalidateTag('private-notes-data')
    return NextResponse.json({ success: true, data: note })
  } catch {
    return NextResponse.json({ error: 'Failed to update private note' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  return PUT(req, ctx)
}

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  return PUT(req, ctx)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    await PrivateNote.findByIdAndDelete(params.id)
    revalidateTag('private-notes-data')
    return NextResponse.json({ success: true, message: 'Private note deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete private note' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'PUT, PATCH, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'PUT, PATCH, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
