import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import { User } from '../user/interface'
import { Category } from '../category/interface'
import { Tag } from '../tag/interface'

export type PostTranslationSchema = {
  /**
   * زبان مطلب
   */
  lang: string // "fa", "en", "de", ...
  /**
   * عنوان مطلب
   */
  title: string
  /**
   * عنوان سئو مطلب
   */
  seoTitle: string
  /**
   * Meta Description
   */
  metaDescription: string
  /**
   * خلاصه‌ای از متن مطلب
   */
  excerpt: string
  /**
   * Schema LD
   */
  jsonLd: string

  /**
   * محتوای مطلب
   */
  contentJson: string

  /**
   * زمان مطالعه به دقیقه
   */
  readingTime: number
}
/**
 * اطلاعات پایه مطلب که شامل فیلدهای اصلی مطلب می‌باشد
 */
type PostBase = {
  /**
   * آدرس یکتای مطلب
   */
  slug: string

  /**
   * زیان های مختلف مطلب
   */
  translations: [PostTranslationSchema]

  /**
   * نوع مطلب
   */
  type: 'article' | 'video'
  /**
   * وضعیت فعال بودن مطلب (در صورت فعال بودن true)
   */
  status: 'published' | 'draft'

  // example: 'pen/مطلب-یک'
  href: string

  /**
   * تاریخ انتشار
   */
  publishedAt: Date

  primaryVideo: string
  primaryVideoEmbedUrl: string
}
type Post_FK_Schema = {
  /**
   * ایجاد کننده مطلب
   */
  user?: Id

  /**
   * نویسنده مطلب
   */
  author?: Id

  /**
   * تصویر مطلب
   */
  image?: Id
  /**
   * دسته‌بندی اصلی مطلب
   */
  mainCategory?: Id

  /**
   * دسته‌بندی مطلب
   */
  categories?: Id[]

  /**
   * برچسب های مطلب
   */
  tags?: Id[]
}
type Post_FK_Populate = {
  /**
   * ایجاد کننده مطلب
   */
  user: User

  /**
   * نویسنده مطلب
   */
  author: User

  /**
   * تصویر مطلب
   */
  image?: File
  /**
   * دسته‌بندی اصلی مطلب
   */
  mainCategory?: Category

  /**
   * دسته‌بندی مطلب
   */
  categories?: Category[]

  /**
   * برچسب های مطلب
   */
  tags?: Tag[]
}

/**
 *
 */
export type Post = Model & PostBase & Post_FK_Populate

/**
 * مدل اسکیمای مطلب برای پایگاه داده که شامل اطلاعات پایه مطلب و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type PostSchema = SchemaModel & PostBase & Post_FK_Schema

/**
 * ساختار درخواست ارسال داده‌های مطلب که شامل اطلاعات پایه مطلب می‌باشد
 */
export type PostInput = PostBase & Post_FK_Schema
