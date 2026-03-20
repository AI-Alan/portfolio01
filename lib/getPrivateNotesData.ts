import { unstable_cache } from 'next/cache'
import connectDB from '@/lib/db'
import PrivateNote from '@/models/PrivateNote'

export interface PrivateNoteItem {
  _id: string
  title: string
  topic: string
  content: string
  keywords: string[]
  enabled: boolean
}

const getCachedPrivateNotesData = unstable_cache(
  async (): Promise<PrivateNoteItem[]> => {
    await connectDB()
    const notes = await PrivateNote.find({ enabled: true }).sort({ updatedAt: -1 }).lean()
    return notes.map((item: any) => ({
      _id: String(item._id),
      title: item.title,
      topic: item.topic,
      content: item.content,
      keywords: item.keywords ?? [],
      enabled: Boolean(item.enabled),
    }))
  },
  ['private-notes-data'],
  { revalidate: 300, tags: ['private-notes-data'] }
)

export async function getPrivateNotesData() {
  return getCachedPrivateNotesData()
}
