import mongoose, { model, Schema } from 'mongoose';
import { CountrySchema } from './interface';

const countrySchema = new Schema<CountrySchema>(
  {
    name: {
      type: String,
      required: true,
    },
    name_fa: { type: String, default: '' },
    code: { type: String, default: '' },
    image: { type: Schema.Types.ObjectId, ref: 'file' },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

countrySchema
  .pre('findOne', function (next: any) {
    this.populate('image');
    next();
  })
  .pre('find', function (next: any) {
    this.populate('image');
    next();
  });

countrySchema.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
  },
});

countrySchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});
export default mongoose.models?.country ||
  model<CountrySchema>('country', countrySchema);
