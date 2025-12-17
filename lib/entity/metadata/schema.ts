import mongoose, { model, Schema } from 'mongoose'
import { MetadataSchema as T } from './interface'

const MetadataSchema = new Schema<T>(
  {
    // 🎯 نوع metadata
    scope: {
      type: String,
      enum: ['setting'],
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      default: null,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// ==================== Indexes ====================

// Unique slug per type (فقط برای غیر حذف شده‌ها)
// Partial Unique Index
MetadataSchema.index({ type: 1, key: 1 }, { unique: true })

// ==================== Middlewares ====================
// MetadataSchema.pre(['findOne', 'find'], function (next: any) {
//   this.where({ deleted: false })
//   next()
// })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

MetadataSchema.set('toObject', {
  transform,
})

MetadataSchema.set('toJSON', {
  transform,
})
export default mongoose.models.metadata || model<T>('metadata', MetadataSchema)
