import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

export type Banner = { aspect: string; file: File }
export type CampaignTranslationSchema = {
  /**
   * زبان مطلب
   */
  lang: string // "fa", "en", "de", ...
  /**
   * بنرها
   */
  banners: [{ aspect: string; file: Id }]
}
export type CampaignTranslation = {
  /**
   * زبان مطلب
   */
  lang: string // "fa", "en", "de", ...
  /**
   * بنرها
   */
  banners: [Banner]
}

/**
 * اطلاعات پایه کمپین تبلیغاتی که شامل فیلدهای اصلی کمپین تبلیغاتی می‌باشد
 */
type CampaignBase = {
  title: string
  description: string
  startAt: Date
  endAt: Date
  targetUrl: string
  goalSections: [{ label: string; value: string }]
  status: 'draft' | 'scheduled' | 'active' | 'inactive' | 'ended'

  /**
   * محتوا
   */
  translations: [CampaignTranslationSchema]

  placement:
    | 'all'
    | 'header'
    | 'sidebar'
    | 'footer'
    | 'home-hero'
    | 'content'
    | 'custom'
  priority: number
  total: {
    impressions: number
    clicks: number
  }

  /**
   * کاربر سازنده
   */
  user: Id
}

/**
 * مدل کمپین تبلیغاتی که شامل اطلاعات پایه کمپین تبلیغاتی و ویژگی‌های اضافی مدل می‌باشد
 */
export type Campaign = Model & CampaignBase

/**
 * مدل اسکیمای کمپین تبلیغاتی برای پایگاه داده که شامل اطلاعات پایه کمپین تبلیغاتی و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type CampaignSchema = SchemaModel &
  Omit<CampaignBase, 'translations'> & {
    translations: CampaignTranslationSchema
  }

/**
 * ساختار درخواست ارسال داده‌های کمپین تبلیغاتی که شامل اطلاعات پایه کمپین تبلیغاتی می‌باشد
 */
export type CampaignInput = CampaignBase

export type AdSlotProps = {
  id: string
  aspect: string
  placement: string
  linkedCampaign: string
  fallbackBehavior: FallbackBehaviorType
}

export type getBannerProps = {
  originPostSlug: string
  adSlots: AdSlotProps[]
  sendedAlready: string[] // banner Ids
  locale?: 'fa'
}

export type DetectCampaignProps = {
  goalSection: string
  placement?: string | null
  sendedAlready: string[]
  linkedCampaign?: string | null
  fallbackBehavior?: FallbackBehaviorType
}

/**
 * inherit	یعنی طبق تنظیمات کلی سایت رفتار کند.
 * default_banner	اگر تبلیغ نبود، بنر پیش‌فرض نشان دهد.
 * hide	یعنی هیچ بنری نمایش داده نشود.
 * random	از میان بنرهای موجود به‌صورت تصادفی یکی را نمایش دهد.
 */
export type FallbackBehaviorType =
  | 'inherit'
  | 'random'
  | 'default_banner'
  | 'hide'
