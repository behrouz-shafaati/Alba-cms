import mongoose, { model, Schema } from 'mongoose';
import { CitySchema } from './interface';

const citySchema = new Schema<CitySchema>(
  {
    countryId: {
      type: Schema.Types.ObjectId,
      ref: 'country',
      required: true,
    },
    provinceId: {
      type: Schema.Types.ObjectId,
      ref: 'province',
      required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, default: '' },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

citySchema
  .pre('findOne', function (next: any) {
    this.populate('countryId provinceId');
    next();
  })
  .pre('find', function (next: any) {
    this.populate('countryId provinceId');
    next();
  });

citySchema.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
  },
});

citySchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    ret.parent = ret.parentId;
    delete ret.parentId;
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});
export default mongoose.models?.city || model<CitySchema>('city', citySchema);
