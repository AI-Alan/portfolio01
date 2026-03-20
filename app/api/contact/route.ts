import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Contact from '@/models/Contact'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const messages = await Contact.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: messages })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { name, email, subject, message } = body
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    const contact = await Contact.create({ name, email, subject, message })
    return NextResponse.json({ success: true, data: contact }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
