import mongoose, { model, Schema } from 'mongoose'
import {
  FormSubmissionSchema,
  FormSubmissionTranslationSchema,
} from './interface'

const TranslationSchema = new Schema<FormSubmissionTranslationSchema>(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    values: {
      type: Schema.Types.Mixed, // شیء داینامیک شامل فیلدها و مقادیرشان
      required: true,
    },
    searchText: {
      type: String, // برای جستجو بین همه‌ی فیلدها
      index: true,
    },
  },
  { _id: false }
)

const formSubmissionSchema = new Schema<FormSubmissionSchema>(
  {
    form: {
      type: Schema.Types.ObjectId,
      ref: 'form',
      default: null,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    senderLocale: { type: String, required: true }, // "fa", "en", "de", ...
    translations: [TranslationSchema],
    status: { type: String, enum: ['read', 'unread'], default: 'unread' },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// formSchema
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

formSubmissionSchema.set('toObject', {
  transform,
})

formSubmissionSchema.set('toJSON', {
  transform,
})
export default mongoose.models.FormSubmission ||
  model<FormSubmissionSchema>('FormSubmission', formSubmissionSchema)
