import mongoose, { model, Schema } from 'mongoose'
import { TagSchema } from './interface'

const TagTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { _id: false }
)

const tagSchema = new Schema<TagSchema>(
  {
    slug: { type: String, required: true },
    translations: [TagTranslationSchema], // 👈 لیست ترجمه‌ها
    image: { type: Schema.Types.ObjectId, ref: 'file' },
    icon: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Partial Unique Index
tagSchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: { deleted: false },
  }
)

tagSchema
  .pre('findOne', function (next: any) {
    this.populate('image')
    this.where({ deleted: false })
    next()
  })
  .pre('find', function (next: any) {
    this.populate('image')
    this.where({ deleted: false })
    next()
  })

// ایندکس‌ها برای بهبود عملکرد
tagSchema.index({ 'translations.title': 1 })
tagSchema.index({ status: 1 })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

tagSchema.set('toObject', {
  transform,
})

tagSchema.set('toJSON', {
  transform,
})
export default mongoose.models.tag || model<TagSchema>('tag', tagSchema)
