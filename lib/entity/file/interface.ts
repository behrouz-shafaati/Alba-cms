import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

export type FileTranslationSchema = {
  /**
   * زبان مطلب
   */
  lang: string // "fa", "en", "de", ...
  /**
   * عنوان دسته بندی
   */
  title: string

  /**
   * توضیحات مربوط به دسته‌بندی
   */
  description: string

  alt: string
}

export type File = Model & {
  /**
   * محتوا
   */
  translations: [FileTranslationSchema]
  extension: string
  patchSmall: string
  patchMedium: string
  patchLarge: string
  /**
   * آدرس تصویر بهینه شده موبایل
   */
  srcSmall: string
  /**
   * آدرس تصویر بهینه شده دسکتاپ
   */
  srcMedium: string
  /**
   * آدرس تصویر با اندازه اصلی
   */
  srcLarge: string
  /**
   * لینکی که با کلیک به روی عکس به آن می رویم
   */
  href: string
  mimeType: string
  size: number
  width: number
  height: number
  previewPath: string
  main: boolean
  attachedTo: [{ feature: string; id: string }]
  /**
   * نحوه ی باز شدن لینک
   */
  target: string
  /**
   * کاربر سازنده
   */
  user: Id
}
export type SchemaFile = File & SchemaModel

export type FileDetailsPayload = {
  id: Id
  translations: [FileTranslationSchema]
  href: string
  target: string
  main: boolean
}

export type FileDetails = FileDetailsPayload & {
  locale: string
  patch: string
  src: string
  mimeType: string
  size: number
  previewPath: string
  attachedTo: [{ feature: string; id: string }]
}
