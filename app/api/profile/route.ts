import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import connectDB from '@/lib/db'
import Profile from '@/models/Profile'
import { isAuthenticated } from '@/lib/auth'

// GET /api/profile — public
export async function GET() {
  try {
    await connectDB()
    let profile = await Profile.findOne()
    if (!profile) {
      // Auto-create default profile on first access
      profile = await Profile.create({})
    }
    return NextResponse.json(
      { success: true, profile },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PUT /api/profile — admin only
export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    await connectDB()
    const data = await req.json()

    // Never allow overriding the _id
    delete data._id
    delete data.__v

    let profile = await Profile.findOne()
    if (!profile) {
      profile = await Profile.create(data)
    } else {
      Object.assign(profile, data)
      await profile.save()
    }
    revalidateTag('profile-data')
    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
