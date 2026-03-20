import mongoose, { Schema, Document } from 'mongoose'

export interface IFocusArea extends Document {
  title: string
  description: string
  icon: string
  color: string
  order: number
}

const FocusAreaSchema = new Schema<IFocusArea>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'brain' }, // 'brain', 'eye', 'code', 'robot', etc.
    color: { type: String, default: 'var(--cyan)' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
)

export default mongoose.models.FocusArea || mongoose.model<IFocusArea>('FocusArea', FocusAreaSchema)
