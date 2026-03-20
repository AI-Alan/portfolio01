import mongoose, { Schema, Document } from 'mongoose'
export interface IExperience extends Document {
  title: string; organization: string; type: string; startDate: string; endDate?: string; current: boolean; description: string; tags?: string[]; location?: string
}
const ExperienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  type: { type: String, enum: ['Education', 'Work', 'Internship', 'Project', 'Achievement'], default: 'Project' },
  startDate: { type: String, required: true },
  endDate: String,
  current: { type: Boolean, default: false },
  description: { type: String, required: true },
  tags: [String],
  location: String,
}, { timestamps: true })
export default mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema)
