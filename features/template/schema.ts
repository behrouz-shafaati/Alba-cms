import mongoose, { model, Schema } from 'mongoose'
import { TemplateSchema } from './interface'

const templateSchema = new Schema<TemplateSchema>(
  {
    title: { type: String, required: false },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'template',
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    content: {
      type: Schema.Types.Mixed, // whole Template structure as JSON
      required: true,
    },
    templateFor: [{ type: String, required: false, unique: false }],
    status: {
      type: String,
      enum: ['deactive', 'active'],
      default: 'active',
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// templateSchema
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

templateSchema.set('toObject', {
  transform,
})

templateSchema.set('toJSON', {
  transform,
})
export default mongoose.models.Template ||
  model<TemplateSchema>('Template', templateSchema)
