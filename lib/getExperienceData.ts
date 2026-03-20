import { unstable_cache } from 'next/cache'
import connectDB from '@/lib/db'
import Experience from '@/models/Experience'

export interface ExperienceItem {
  _id: string
  type: string
  title: string
  organization: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  tags?: string[]
  location?: string
}

const getCachedExperienceData = unstable_cache(
  async (): Promise<ExperienceItem[]> => {
    await connectDB()
    const exp = await Experience.find().sort({ current: -1, startDate: -1 }).lean()

    return exp.map((item: any) => ({
      _id: String(item._id),
      type: item.type,
      title: item.title,
      organization: item.organization,
      startDate: item.startDate,
      endDate: item.endDate,
      current: item.current,
      description: item.description,
      tags: item.tags,
      location: item.location,
    }))
  },
  ['experience-data'],
  {
    revalidate: 3600,
    tags: ['experience-data'],
  }
)

export async function getExperienceData() {
  return getCachedExperienceData()
}
