import mongoose, { Schema, Document } from 'mongoose'
export interface ISkill extends Document {
  name: string; category: string; level: number; icon?: string; color?: string
}
const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  category: { type: String, enum: ['AI/ML', 'Web Dev', 'Robotics', 'Computer Vision', 'Languages', 'Tools'], default: 'Tools' },
  level: { type: Number, min: 0, max: 100, default: 80 },
  icon: String, color: String,
})
export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema)
