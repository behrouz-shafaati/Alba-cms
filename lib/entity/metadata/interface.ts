import { SchemaModel } from '@/lib/entity/core/interface'

export type MetadataScope = 'setting'

export type MetadataSchema = SchemaModel & {
  scope: MetadataScope
  key: string
  value: Record<string, any>
}
