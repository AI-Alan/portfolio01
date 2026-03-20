import { unstable_cache } from 'next/cache'
import connectDB from '@/lib/db'
import Skill from '@/models/Skill'
import type { Skill as SkillType } from '@/types'

const getCachedSkillsData = unstable_cache(
  async (): Promise<SkillType[]> => {
    await connectDB()
    const skills = await Skill.find().sort({ category: 1, level: -1 }).lean()
    return skills.map((item: any) => ({
      _id: String(item._id),
      name: item.name,
      category: item.category,
      level: item.level,
      icon: item.icon,
      color: item.color,
    }))
  },
  ['skills-data'],
  { revalidate: 3600, tags: ['skills-data'] }
)

export async function getSkillsData() {
  return getCachedSkillsData()
}
