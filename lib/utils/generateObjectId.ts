import ObjectID from 'bson-objectid'

export function generateObjectId(): string {
  return ObjectID().toHexString()
}
