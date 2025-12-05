import { Id, Model } from '@/lib/entity/core/interface';

export type ShippingAddress = Model & {
  userId: string;
  name: string;
  companyName: string;
  country: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  email: string;
  mobile: string;
  isDefault: boolean;
};

export type ShippingAddressSchema = Model & {
  userId: Id;
  name: string;
  companyName: string;
  countryId: Id;
  provinceId: Id;
  cityId: Id;
  address: string;
  postalCode: string;
  email: string;
  mobile: string;
  isDefault: boolean;
};

export type ShippingAddressPayload = Omit<ShippingAddress, 'id'>;
