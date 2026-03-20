import mongoose, { Schema, Document } from 'mongoose'

export interface IBlog extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  coverImage?: string
  published: boolean
  readTime: number
  createdAt: Date
  updatedAt: Date
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    coverImage: { type: String },
    published: { type: Boolean, default: false },
    readTime: { type: Number, default: 1 },
  },
  { timestamps: true }
)

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema)
