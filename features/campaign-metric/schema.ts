import mongoose, { model, Schema } from 'mongoose'
import { CampaignMetricSchema } from './interface'

const campaignMetricSchema = new Schema<CampaignMetricSchema>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    slotId: {
      type: String,
    },

    type: { type: String, enum: ['impression', 'click'] },
    locale: { type: String, enum: ['fa'] },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

campaignMetricSchema.pre(['find', 'findOne'], function (next: any) {
  this.where({ deleted: false })
  next()
})

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

campaignMetricSchema.set('toObject', {
  transform,
})

campaignMetricSchema.set('toJSON', {
  transform,
})
export default mongoose.models.campaign_metric ||
  model<CampaignMetricSchema>('campaign_metric', campaignMetricSchema)
