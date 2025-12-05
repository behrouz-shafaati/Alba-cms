import mongoose, { model, Schema } from 'mongoose'
import { MenuSchema, MenuItem } from './interface'

// MenuItem sub-schema
const MenuItemSchema = new Schema<MenuItem>({
  label: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: false },
  subMenu: [
    /* 🔧 Recursive reference */
  ],
})

MenuItemSchema.add({
  subMenu: [MenuItemSchema],
})

const MenuTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    items: [MenuItemSchema],
  },
  { _id: false }
)

const menuSchema = new Schema<MenuSchema>(
  {
    translations: [MenuTranslationSchema], // 👈 لیست ترجمه‌ها
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

function transformMenuItem(item: any): any {
  const transformed = {
    ...item,
    id: item._id?.toString(),
  }

  delete transformed._id
  delete transformed.__v

  if (Array.isArray(item.subMenu)) {
    transformed.subMenu = item.subMenu.map(transformMenuItem)
  }

  return transformed
}

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted

  if (Array.isArray(ret.items)) {
    ret.items = ret.items.map(transformMenuItem)
  }
}

menuSchema.set('toObject', {
  transform,
})

menuSchema.set('toJSON', {
  transform,
})
export default mongoose.models.menu || model<MenuSchema>('menu', menuSchema)
