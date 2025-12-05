import { Id, Model, SchemaModel } from '@/lib/entity/core/interface';

export type Country = Model & {
  name: string;
  code: string;
  name_fa: string;
  image: File | null;
  active: boolean;
};

export type CountrySchema = Country &
  SchemaModel & {
    image: Id | null;
  };

export type CountryPayload = CountrySchema;
