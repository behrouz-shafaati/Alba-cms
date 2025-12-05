import mongoose, { Schema, model } from 'mongoose'
import { SchemaFile } from './interface'

const FileTranslationSchema = new Schema(
  {
    lang: { type: String, required: false, default: null }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    description: { type: String, default: '' },
    alt: String,
  },
  { _id: false }
)

const fileSchema = new Schema<SchemaFile>(
  {
    translations: [FileTranslationSchema], // 👈 لیست ترجمه‌ها
    patchSmall: String,
    patchLarge: String,
    patchMedium: String,
    srcSmall: String,
    srcMedium: String,
    srcLarge: String,
    href: String,
    width: String,
    height: String,
    target: String,
    previewPath: String,
    mimeType: String,
    size: Number,
    main: { type: Boolean, default: false },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    attachedTo: [{ feature: String, id: String, _id: false }],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Middleware to exclude deleted documents
fileSchema.pre('find', function (next) {
  this.where({ deleted: false })
  next()
})

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id.toHexString()
  ret.extension = ret.mimeType.split('/')[1]
  delete ret._id
  delete ret.__v
  delete ret.deleted

  // 👇 ساخت blurDataURL برای تصاویر WebP کوچک
  // فرض می‌کنیم patchSmall یا srcSmall مسیر فایل کوچک است
  if (ret.patchSmall) {
    // تبدیل مسیر به base64 WebP
    try {
      const fs = require('fs')

      // مسیر واقعی روی سرور
      const filePath = ret.patchSmall
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath)
        const base64 = buffer.toString('base64')
        const blurDataURL = `data:image/webp;base64,${base64}`
        ret.blurDataURL = blurDataURL
      } else {
        ret.blurDataURL = null
      }
    } catch (err) {
      ret.blurDataURL = null
    }
  } else {
    ret.blurDataURL = null
  }
}

fileSchema.set('toObject', { transform, virtuals: true })

fileSchema.set('toJSON', { transform, virtuals: true })

export default mongoose.models?.file || model<SchemaFile>('file', fileSchema)
