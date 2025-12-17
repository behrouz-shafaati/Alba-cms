import {
  CampaignTranslation,
  FallbackBehaviorType,
} from '@/features/campaign/interface'

/**
 * اطلاعات پایه تنظیمات که شامل فیلدهای اصلی تنظیمات می‌باشد
 */
export type AD = {
  fallbackBehavior: FallbackBehaviorType
  targetUrl: string
  translations: [CampaignTranslation]
}
