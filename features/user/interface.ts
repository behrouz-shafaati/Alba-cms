import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import { ShippingAddress } from '../shippingAddress/interface'
import { File } from '@/lib/entity/file/interface'

type TranslationsUser = {
  lang: 'fa'
  about: string
}
// import { Role } from "@entity/role/interface";
/**
 * اطلاعات پایه کاربر که شامل فیلدهای اصلی و مشترک می‌باشد
 */
type UserBase = {
  /**
   * نقش‌های کاربر در سیستم (مثل ادمین، کاربر معمولی و غیره)
   */
  roles: string[]

  /**
   * توکن احراز هویت برای جلسات (اختیاری)
   */
  token?: string

  /**
   * شماره موبایل کاربر (اختیاری)
   */
  mobile?: string

  /**
   * وضعیت تأیید شماره موبایل (در صورت تأیید true)
   */
  mobileVerified: boolean

  /**
   * نام کاربری یکتای کاربر
   */
  userName: string

  /**
   * ایمیل کاربر
   */
  email: string

  /**
   * وضعیت تأیید ایمیل (در صورت تأیید true)
   */
  emailVerified: boolean

  /**
   * رمز عبور کاربر (هش شده)
   */
  password: string

  /**
   * توکن تجدید برای تمدید جلسات احراز هویت
   */
  refreshToken: string

  /**
   * نام کوچک کاربر
   */
  firstName: string

  /**
   * نام خانوادگی کاربر
   */
  lastName: string

  /**
   * نام کامل کاربر (محاسبه شده از نام کوچک و نام خانوادگی)
   */
  name: string

  /**
   * کشور کاربر
   */
  country: string

  /**
   * ایالت/استان کاربر
   */
  state: string

  /**
   * شهر کاربر
   */
  city: string

  /**
   * آدرس کامل کاربر
   */
  address: string

  /**
   * توضیحاتی درباره کاربر
   */
  about: string

  /**
   * شناسه تصویر پروفایل کاربر (به عنوان یک شناسه)
   */
  image?: Id

  /**
   * زبان ترجیحی کاربر
   */
  language: string

  /**
   * وضعیت حالت تاریک (در صورت فعال بودن true)
   */
  darkMode: boolean

  /**
   * وضعیت فعال بودن حساب کاربر (در صورت فعال بودن true)
   */
  active: boolean
  translations: [TranslationsUser]
}

/**
 * مدل کاربر که شامل اطلاعات پایه و ویژگی‌های اضافی می‌باشد
 */
export type User = Model &
  UserBase & {
    /**
     * فایل تصویر پروفایل کاربر
     */
    image?: File

    /**
     * آدرس‌های ارسال کاربر
     */
    shippingAddresses: ShippingAddress[]
  }

/**
 * مدل اسکیمای کاربر برای پایگاه داده که شناسه تصویر به صورت Id ذخیره می‌شود
 */
export type UserSchema = SchemaModel &
  UserBase & {
    /**
     * شناسه تصویر پروفایل کاربر
     */
    image?: Id
  }

/**
 * ساختار درخواست بررسی دسترسی کاربر به یک مسیر خاص
 */
export type HaveAccessPayload = {
  /**
   * شناسه کاربر (اختیاری)
   */
  userId?: Id

  /**
   * متد HTTP که درخواست می‌شود (POST, GET, PUT, DELETE)
   */
  method: 'POST' | 'GET' | 'PUT' | 'DELETE'

  /**
   * مسیر دسترسی که درخواست می‌شود
   */
  path: string
}

/**
 * ساختار درخواست تغییر رمز عبور کاربر
 */
export type ChangePassword = {
  /**
   * شناسه کاربر
   */
  userId: Id

  /**
   * رمز عبور قدیمی کاربر
   */
  oldPassword: string

  /**
   * رمز عبور جدید کاربر
   */
  newPassword: string
}
