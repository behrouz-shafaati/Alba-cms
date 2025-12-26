import mongoose, { model, Schema } from 'mongoose'
import { PostSchema } from './interface'
import { createPostHref } from './utils'

const PostTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    title: { type: String, default: '' },
    seoTitle: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    jsonLd: { type: String, default: '' },
    contentJson: { type: String, default: '' },
    readingTime: { type: Number, default: 0 },
  },
  { _id: false }
)

const postSchema = new Schema<PostSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: 'file',
      default: null,
      required: false,
    },
    slug: { type: String, required: true },
    translations: [PostTranslationSchema], // 👈 لیست ترجمه‌ها
    mainCategory: {
      type: Schema.Types.ObjectId,
      ref: 'taxonomy',
      default: null,
      required: false,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'taxonomy',
        default: [],
      },
    ],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'taxonomy',
        default: [],
      },
    ],
    primaryVideo: {
      type: String,
    },
    primaryVideoEmbedUrl: {
      type: String,
    },
    type: {
      type: String,
      enum: ['article', 'video'],
      default: 'article',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedAt: { type: Date, default: null }, // تاریخ انتشار
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Partial Unique Index
postSchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: { deleted: false },
  }
)

postSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next: any) {
  this.populate('image')
    .populate('user')
    .populate('author')
    .populate('tags')
    .populate('mainCategory')
    .populate('categories')
  // .populate('commentsCount')
  // this.populate({
  //   path: 'tags',
  //   select: 'title slug -_id', // فقط name و slug رو بیار بدون _id
  // })
  next()
})

const transform = (doc: any, ret: any, options: any) => {
  const category = ret?.categories[0] || { slug: '' }
  ret.id = ret._id?.toHexString()
  // ret.link = `${category.slug}/${ret.slug}`
  ret.href = createPostHref(ret)
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

postSchema.set('toObject', {
  transform,
  virtuals: true,
})

postSchema.set('toJSON', {
  transform,
  virtuals: true,
})

export default mongoose.models.post || model<PostSchema>('post', postSchema)
