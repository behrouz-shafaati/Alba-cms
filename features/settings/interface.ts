import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import { File } from '@/lib/entity/file/interface'
import {
  CampaignTranslation,
  FallbackBehaviorType,
} from '../campaign/interface'

type UserSettings = {
  defaultRoles: string[]
}

type InfoTranslation = {
  lang: string
  /**
   *   عنوان سایت
   */
  site_title: string

  /**
   *   معرفی کوتاه
   */
  site_introduction: string
}

type PageTranslation = {
  /**
   * شناسه برگه خانه
   */
  homePageId: Id

  /**
   * شناسه برگه قوانین سایت
   */
  termsPageId: Id

  /**
   * شناسه برگه حریم خصوصی
   */
  privacyPageId: Id
}

/**
 * اطلاعات پایه تنظیمات که شامل فیلدهای اصلی تنظیمات می‌باشد
 */
type SettingsBase = {
  /**
   * کلید واژه تک داکیومنت مربوط به تنظیمات
   */
  type: 'site-settings'

  /**
   *   آدرس سایت
   */
  site_url: string

  infoTranslations: InfoTranslation[]
  pageTranslations: PageTranslation[]
  user: UserSettings

  /**
   *   معرفی کوتاه
   */
  favicon: File

  /**
   * نمایش دیدگاه‌ها فقط بعد از تأیید/بررسی
   */
  commentApprovalRequired: boolean

  /**
   * تایید مالکیت ایمیل کاربران
   */
  emailVerificationRequired: boolean

  /**
   * تایید مالکیت شماره موبایل
   */
  mobileVerificationRequired: boolean

  /**
   *
   */
  mail_host: string
  /**
   *
   */
  mail_port: string
  /**
   *
   */
  mail_username: string
  /**
   *
   */
  mail_password: string
  /**
   *
   */
  farazsms: Farazsms
  /**
   *
   */
  desktopHeaderHeight: number
  /**
   *
   */
  tabletHeaderHeight: number
  /**
   *
   */
  mobileHeaderHeight: number

  /**
   *
   */
  ad: {
    fallbackBehavior: FallbackBehaviorType
    targetUrl: string
    translations: [CampaignTranslation]
  }

  /**
   * شناسه فوتر اصلی
   */
  footerMenuId: string

  /**
   * تنظیمات مربوط به مطلب
   */
  theme: {
    primaryColor: String
    backgroundColor: String
    darkMode: Boolean
  }

  /**
   * اطلاعات مربوط به ادغام با سایر سرویس دهندگان
   */
  integrations: {
    googleAnalyticsId: String
  }
}

type Farazsms = {
  /**
   *
   */
  farazsms_apiKey: string
  /**
   *
   */
  farazsms_verifyPatternCode: string
  /**
   *
   */
  farazsms_from_number: string
}

/**
 * مدل تنظیمات که شامل اطلاعات پایه تنظیمات و ویژگی‌های اضافی مدل می‌باشد
 */
export type Settings = Model & SettingsBase

/**
 * مدل اسکیمای تنظیمات برای پایگاه داده که شامل اطلاعات پایه تنظیمات و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type SettingsSchema = SchemaModel & SettingsBase

/**
 * ساختار درخواست ارسال داده‌های تنظیمات که شامل اطلاعات پایه تنظیمات می‌باشد
 */
export type SettingsInput = SettingsBase
