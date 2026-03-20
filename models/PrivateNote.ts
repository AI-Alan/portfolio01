import mongoose, { Schema, Document } from 'mongoose'

export interface IPrivateNote extends Document {
  title: string
  topic: string
  content: string
  keywords: string[]
  enabled: boolean
}

const PrivateNoteSchema = new Schema<IPrivateNote>(
  {
    title: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true, index: true },
    content: { type: String, required: true, trim: true },
    keywords: { type: [String], default: [] },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.PrivateNote || mongoose.model<IPrivateNote>('PrivateNote', PrivateNoteSchema)
