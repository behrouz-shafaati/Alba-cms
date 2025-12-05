import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

/**
 * اطلاعات پایه کمپین تبلیغاتی که شامل فیلدهای اصلی کمپین تبلیغاتی می‌باشد
 */
type CampaignMetricBase = {
  campaignId: Id
  slotId: string
  locale: 'fa'
  type: 'impression' | 'click'
  /**
   * تعداد نمایش
   */
  // impressions: number
}

/**
 * مدل کمپین تبلیغاتی که شامل اطلاعات پایه کمپین تبلیغاتی و ویژگی‌های اضافی مدل می‌باشد
 */
export type CampaignMetric = Model & CampaignMetricBase

/**
 * مدل اسکیمای کمپین تبلیغاتی برای پایگاه داده که شامل اطلاعات پایه کمپین تبلیغاتی و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type CampaignMetricSchema = SchemaModel & CampaignMetricBase
