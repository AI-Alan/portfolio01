'use client'
import { useState, useEffect } from 'react'

export interface ProfileData {
  name: string
  tagline: string
  bio: string
  email: string
  github?: string
  linkedin?: string
  twitter?: string
  resumeUrl?: string
  profileImage?: string
  location?: string
  availableForWork: boolean
  heroTypingTexts: string[]
  // About section stats
  projectsCount: string
  technologiesCount: string
  yearOfStudy: string
  coffeeCups: string
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'Aman Kumar Yadav',
  tagline: 'AI / ML Engineer & Intelligent Systems Developer',
  bio: '',
  email: '',
  github: '',
  linkedin: '',
  twitter: '',
  resumeUrl: '',
  location: 'India',
  availableForWork: true,
  heroTypingTexts: [
    'AI / ML Engineer',
    'Computer Vision Developer',
    'Full-Stack Developer',
  ],
  projectsCount: '0',
  technologiesCount: '0',
  yearOfStudy: '—',
  coffeeCups: '∞',
}

let profileCache: ProfileData | null = null
let profileRequest: Promise<ProfileData> | null = null

async function fetchProfileData(): Promise<ProfileData> {
  if (profileCache) return profileCache
  if (profileRequest) return profileRequest

  profileRequest = fetch('/api/profile')
    .then((r) => r.json())
    .then((data) => (data?.profile ? data.profile : DEFAULT_PROFILE))
    .catch(() => DEFAULT_PROFILE)
    .then((profile) => {
      profileCache = profile
      return profile
    })
    .finally(() => {
      profileRequest = null
    })

  return profileRequest
}

export function useProfileData() {
  const [profile, setProfile] = useState<ProfileData>(profileCache ?? DEFAULT_PROFILE)
  const [loading, setLoading] = useState(!profileCache)

  useEffect(() => {
    fetchProfileData()
      .then(setProfile)
      .finally(() => setLoading(false))
  }, [])

  return { profile, loading }
}
