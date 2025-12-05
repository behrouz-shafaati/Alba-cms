import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import {
  Content as PageContentComponent,
  Row as PageRowComponent,
  Column as PageColumnComponent,
  Block as PageBlockComponent,
} from '@/components/builder-canvas/types'

export type PageContent = PageContentComponent

export type PageRow = PageRowComponent

export type PageColumn = PageColumnComponent

export type PageBlock = PageBlockComponent

export type PageTranslationSchema = {
  /**
   * زبان مطلب
   */
  lang: string // "fa", "en", "de", ...
  /**
   * عنوان برگه
   */
  title: string

  /**
   * محتوای برگه
   */
  content: PageContent
}

/**
 * اطلاعات پایه برگه که شامل فیلدهای اصلی برگه می‌باشد
 */
type PageBase = {
  user: Id
  type: 'page' | 'template'
  header: string

  slug: string

  /**
   * محتوا
   */
  translations: [PageTranslationSchema]
  status: 'draft' | 'published'
}

/**
 * مدل برگه که شامل اطلاعات پایه برگه و ویژگی‌های اضافی مدل می‌باشد
 */
export type Page = Model & PageBase

/**
 * مدل اسکیمای برگه برای پایگاه داده که شامل اطلاعات پایه برگه و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type PageSchema = SchemaModel & PageBase

/**
 * ساختار درخواست ارسال داده‌های برگه که شامل اطلاعات پایه برگه می‌باشد
 */
export type PageInput = PageBase
