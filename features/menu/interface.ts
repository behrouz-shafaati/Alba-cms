import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import { User } from '../user/interface'

export type MenuItem = {
  id: string
  label: string
  url: string
  icon: string
  subMenu: MenuItem[]
}

export type MenuTranslationSchema = {
  /**
   * زبان مطلب
   */
  lang: string // "fa", "en", "de", ...

  /**
   * عنوان فهرست
   */
  title: string

  /**
   * آیتم های مربوط به فهرست
   */
  items: MenuItem[]
}

/**
 * اطلاعات پایه فهرست که شامل فیلدهای اصلی فهرست می‌باشد
 */
type MenuBase = {
  /**
   * محتوا
   */
  translations: [MenuTranslationSchema]

  /**
   * کاربر سازنده
   */
  user: Id
}

/**
 * مدل فهرست که شامل اطلاعات پایه فهرست و ویژگی‌های اضافی مدل می‌باشد
 */
export type Menu = Model & MenuBase

/**
 * مدل اسکیمای فهرست برای پایگاه داده که شامل اطلاعات پایه فهرست و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type MenuSchema = SchemaModel & MenuBase

/**
 * ساختار درخواست ارسال داده‌های فهرست که شامل اطلاعات پایه فهرست می‌باشد
 */
export type MenuInput = MenuBase
