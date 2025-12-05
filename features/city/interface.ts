import { Id, Model, SchemaModel } from '@/lib/entity/core/interface';

export type City = Model & {
  countryId: string;
  provinceId: string;
  name: string;
  slug: string;
  active: boolean;
};

export type CitySchema = SchemaModel & {
  countryId: Id;
  provinceId: Id;
  name: string;
  slug: string;
  active: boolean;
};

export type CityPayload = CitySchema;
