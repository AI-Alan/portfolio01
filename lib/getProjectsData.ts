import { unstable_cache } from 'next/cache'
import connectDB from '@/lib/db'
import Project from '@/models/Project'
import type { Project as ProjectType } from '@/types'

const getCachedProjectsData = unstable_cache(
  async (): Promise<ProjectType[]> => {
    await connectDB()
    const projects = await Project.find().sort({ createdAt: -1 }).lean()
    return projects.map((item: any) => ({
      _id: String(item._id),
      title: item.title,
      description: item.description,
      longDescription: item.longDescription,
      tags: item.tags ?? [],
      category: item.category,
      github: item.github,
      demo: item.demo,
      image: item.image,
      featured: Boolean(item.featured),
      techStack: item.techStack ?? [],
      createdAt: item.createdAt?.toISOString?.() ?? '',
      updatedAt: item.updatedAt?.toISOString?.() ?? '',
    }))
  },
  ['projects-data'],
  { revalidate: 1800, tags: ['projects-data'] }
)

export async function getProjectsData() {
  return getCachedProjectsData()
}
