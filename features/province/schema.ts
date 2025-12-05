import mongoose, { model, Schema } from 'mongoose';
import { ProvinceSchema } from './interface';

const provinceSchema = new Schema<ProvinceSchema>(
  {
    countryId: {
      type: Schema.Types.ObjectId,
      ref: 'country',
      required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, default: '' },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// provinceSchema
//   .pre('findOne', function (next: any) {
//     this.populate('parentId');
//     next();
//   })
//   .pre('find', function (next: any) {
//     this.populate('parentId');
//     next();
//   });

provinceSchema.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
  },
});

provinceSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});
export default mongoose.models?.province ||
  model<ProvinceSchema>('province', provinceSchema);
