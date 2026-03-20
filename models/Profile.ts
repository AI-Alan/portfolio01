import mongoose, { Schema, Document } from 'mongoose'

export interface IProfile extends Document {
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
  updatedAt: Date
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true, default: 'Aman Kumar Yadav' },
    tagline: { type: String, default: 'AI / ML Engineer & Intelligent Systems Developer' },
    bio: { type: String, default: '' },
    email: { type: String, default: '' },
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    resumeUrl: { type: String },
    profileImage: { type: String },
    location: { type: String, default: 'India' },
    availableForWork: { type: Boolean, default: true },
    heroTypingTexts: {
      type: [String],
      default: [
        'AI / ML Engineer',
        'Intelligent Systems Developer',
        'Computer Vision Enthusiast',
        'Robotics & ROS Developer',
        'Full-Stack Developer',
      ],
    },
    projectsCount: { type: String, default: '0' },
    technologiesCount: { type: String, default: '0' },
    yearOfStudy: { type: String, default: '1st' },
    coffeeCups: { type: String, default: '∞' },
  },
  { timestamps: true }
)

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema)
