import { Id, Model, SchemaModel } from '@/lib/entity/core/interface';

export type Province = Model & {
  countryId: string;
  name: string;
  slug: string;
  active: boolean;
};

export type ProvinceSchema = SchemaModel & {
  countryId: Id;
  name: string;
  slug: string;
  active: boolean;
};

export type ProvincePayload = ProvinceSchema;
