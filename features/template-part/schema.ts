import mongoose, { model, Schema } from 'mongoose'
import { TemplatePartSchema } from './interface'

const templatePartSchema = new Schema<TemplatePartSchema>(
  {
    title: { type: String, required: false },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    content: {
      type: Schema.Types.Mixed, // whole TemplatePart structure as JSON
      required: true,
    },
    status: {
      type: String,
      enum: ['deactive', 'active'],
      default: 'active',
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// templatePartSchema
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

templatePartSchema.set('toObject', {
  transform,
})

templatePartSchema.set('toJSON', {
  transform,
})
export default mongoose.models.TemplatePart ||
  model<TemplatePartSchema>('TemplatePart', templatePartSchema)
