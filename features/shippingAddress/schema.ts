import mongoose, { model, Schema } from 'mongoose';
import { ShippingAddressSchema } from './interface';

const shippingAddressSchema = new Schema<ShippingAddressSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    name: { type: String, required: true },
    companyName: { type: String, default: '' },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: 'country',
      default: null,
    },
    provinceId: {
      type: Schema.Types.ObjectId,
      ref: 'province',
      default: null,
    },
    cityId: {
      type: Schema.Types.ObjectId,
      ref: 'city',
      default: null,
    },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    email: { type: String, default: '' },
    mobile: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

shippingAddressSchema
  .pre('findOne', function (next: any) {
    this.populate('countryId provinceId cityId');
    next();
  })
  .pre('find', function (next: any) {
    this.populate('countryId provinceId cityId');
    next();
  });

shippingAddressSchema.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();

    ret.country = ret.countryId;
    ret.province = ret.provinceId;
    ret.city = ret.cityId;
    ret.countryId = ret.countryId.id;
    ret.provinceId = ret.provinceId.id;
    ret.cityId = ret.cityId.id;

    delete ret._id;
    delete ret.__v;
  },
});

shippingAddressSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();

    ret.country = ret.countryId;
    ret.province = ret.provinceId;
    ret.city = ret.cityId;
    ret.countryId = ret.countryId.id;
    ret.provinceId = ret.provinceId.id;
    ret.cityId = ret.cityId.id;

    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});
export default mongoose.models?.shippingAddress ||
  model<ShippingAddressSchema>('shippingAddress', shippingAddressSchema);
