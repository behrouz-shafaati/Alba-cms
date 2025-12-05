import mongoose, { model, Schema } from 'mongoose'
import { PageSchema } from './interface'

const PageTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    content: {
      type: Schema.Types.Mixed, // whole page structure as JSON
      required: true,
    },
    description: { type: String, default: '' },
  },
  { _id: false }
)

const pageSchema = new Schema<PageSchema>(
  {
    slug: { type: String, required: false, default: null },
    translations: [PageTranslationSchema], // 👈 لیست ترجمه‌ها
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Partial Unique Index
pageSchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: { deleted: false },
  }
)

// pageSchema
//   .pre('findOne', function (next: any) {
//     this.populate('user')
//     next()
//   })
//   .pre('find', function (next: any) {
//     this.populate('user')
//     next()
//   })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

pageSchema.set('toObject', {
  transform,
})

pageSchema.set('toJSON', {
  transform,
})
export default mongoose.models.page || model<PageSchema>('page', pageSchema)
