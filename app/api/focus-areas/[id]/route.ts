import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import connectDB from '@/lib/db'
import FocusArea from '@/models/FocusArea'
import { isAuthenticated } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  try {
    const body = await req.json()
    const focusArea = await FocusArea.findByIdAndUpdate(params.id, body, { new: true })
    if (!focusArea) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    revalidateTag('focus-areas-data')
    return NextResponse.json(focusArea)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  try {
    const focusArea = await FocusArea.findByIdAndDelete(params.id)
    if (!focusArea) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    revalidateTag('focus-areas-data')
    return NextResponse.json({ message: 'Deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
