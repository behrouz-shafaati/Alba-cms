import mongoose, { model, Schema } from 'mongoose'
import { CategorySchema } from './interface'

const CategoryTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { _id: false }
)

const categorySchema = new Schema<CategorySchema>(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      default: null,
    },
    slug: { type: String, required: true },
    icon: { type: String, default: '' },
    translations: [CategoryTranslationSchema], // 👈 لیست ترجمه‌ها
    image: { type: Schema.Types.ObjectId, ref: 'file' },
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
categorySchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: { deleted: false },
  }
)

categorySchema
  .pre('save', function (next) {
    if (this.parent?.toString() === this._id?.toString()) {
      return next(new Error('A category cannot be its own parent.'))
    }
    next()
  })
  .pre('findOne', function (next: any) {
    this.populate('parent')
    this.populate('image')
    this.where({ deleted: false })
    next()
  })
  .pre('find', function (next: any) {
    this.populate('parent')
    this.populate('image')
    this.where({ deleted: false })
    next()
  })

// ایندکس‌ها برای بهبود عملکرد
categorySchema.index({ 'translations.title': 1 })
categorySchema.index({ status: 1 })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

categorySchema.set('toObject', {
  transform,
})

categorySchema.set('toJSON', {
  transform,
})
export default mongoose.models.category ||
  model<CategorySchema>('category', categorySchema)
