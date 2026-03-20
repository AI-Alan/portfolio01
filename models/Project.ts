import mongoose, { Schema, Document } from 'mongoose'

export interface IProject extends Document {
  title: string
  description: string
  longDescription?: string
  tags: string[]
  category: string
  github?: string
  demo?: string
  image?: string
  featured: boolean
  techStack: string[]
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    tags: [{ type: String }],
    category: {
      type: String,
      enum: ['AI', 'ML', 'Robotics', 'Web', 'CV', 'Other'],
      default: 'Other',
    },
    github: { type: String },
    demo: { type: String },
    image: { type: String },
    featured: { type: Boolean, default: false },
    techStack: [{ type: String }],
  },
  { timestamps: true }
)

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
