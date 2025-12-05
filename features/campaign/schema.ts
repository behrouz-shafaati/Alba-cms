import mongoose, { model, Schema } from 'mongoose'
import { CampaignSchema } from './interface'

const CampaignTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    banners: [
      {
        aspect: String,
        file: { type: Schema.Types.ObjectId, ref: 'file' },
      },
    ],
  },
  { _id: false }
)

const GoalSectionsSchema = new Schema(
  { label: String, value: String },
  { _id: false }
)

const campaignSchema = new Schema<CampaignSchema>(
  {
    title: {
      type: String,
      required: true,
    },
    goalSections: [GoalSectionsSchema],
    targetUrl: String,
    description: String,
    translations: [CampaignTranslationSchema], // 👈 لیست ترجمه‌ها
    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'active', 'inactive', 'ended'],
      default: 'draft',
    },
    placement: {
      type: String,
      enum: [
        'all',
        'header',
        'sidebar',
        'footer',
        'home-hero',
        'content',
        'custom',
      ],
      default: 'header',
    },
    priority: { type: Number, default: 0 },
    total: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
    },
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

campaignSchema.pre(['find', 'findOne'], function (next: any) {
  this.populate('translations.banners.file')
  next()
})

// ایندکس‌ها برای بهبود عملکرد
campaignSchema.index({ title: 1 })
campaignSchema.index({ status: 1 })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

campaignSchema.set('toObject', {
  transform,
})

campaignSchema.set('toJSON', {
  transform,
})
export default mongoose.models.campaign ||
  model<CampaignSchema>('campaign', campaignSchema)
