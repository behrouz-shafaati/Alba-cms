import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

export type CategoryTranslationSchema = {
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
}

/**
 * اطلاعات پایه دسته‌بندی که شامل فیلدهای اصلی دسته‌بندی می‌باشد
 */
type CategoryBase = {
  /**
   * شیء والد دسته‌بندی (اختیاری، می‌تواند هر نوع داده‌ای باشد)
   */
  parent: Category | null

  /**
   * عنوان دسته
   */
  slug: string
  /**
   * آیکون دسته
   */
  icon: string

  /**
   * محتوا
   */
  translations: [CategoryTranslationSchema]

  /**
   * شناسه تصویر دسته‌بندی
   */
  image: File

  /**
   * وضعیت فعال بودن دسته‌بندی (در صورت فعال بودن true)
   */
  status: 'active' | 'inactive'

  /**
   * کاربر سازنده
   */
  user: Id
}

/**
 * مدل دسته‌بندی که شامل اطلاعات پایه دسته‌بندی و ویژگی‌های اضافی مدل می‌باشد
 */
export type Category = Model & CategoryBase

/**
 * مدل اسکیمای دسته‌بندی برای پایگاه داده که شامل اطلاعات پایه دسته‌بندی و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type CategorySchema = SchemaModel &
  Omit<CategoryBase, 'parent' | 'file'> & { parent: Id; file: Id }

/**
 * ساختار درخواست ارسال داده‌های دسته‌بندی که شامل اطلاعات پایه دسته‌بندی می‌باشد
 */
export type CategoryInput = CategoryBase
