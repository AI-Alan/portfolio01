import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import FocusArea from '@/models/FocusArea'

export async function GET() {
  await connectDB()
  try {
    const focusAreas = await FocusArea.find().sort({ order: 1 })
    return NextResponse.json(focusAreas)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const focusArea = await FocusArea.create(body)
    return NextResponse.json(focusArea, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
