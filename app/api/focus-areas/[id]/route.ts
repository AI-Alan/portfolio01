import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import FocusArea from '@/models/FocusArea'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB()
  try {
    const body = await req.json()
    const focusArea = await FocusArea.findByIdAndUpdate(params.id, body, { new: true })
    if (!focusArea) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(focusArea)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB()
  try {
    const focusArea = await FocusArea.findByIdAndDelete(params.id)
    if (!focusArea) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
