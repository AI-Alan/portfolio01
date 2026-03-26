import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import connectDB from '@/lib/db'
import FocusArea from '@/models/FocusArea'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  await connectDB()
  try {
    const focusAreas = await FocusArea.find().sort({ order: 1 }).lean()
    return NextResponse.json(focusAreas, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  try {
    const body = await req.json()
    const focusArea = await FocusArea.create(body)
    revalidateTag('focus-areas-data')
    return NextResponse.json(focusArea, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
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
