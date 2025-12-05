import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import {
  Content as TemplateContentComponent,
  Row as TemplateRowComponent,
  Column as TemplateColumnComponent,
  Block as TemplateBlockComponent,
} from '@/components/builder-template-part/types'

export type TemplateContent = TemplateContentComponent

export type TemplateRow = TemplateRowComponent

export type TemplateColumn = TemplateColumnComponent

export type TemplateBlock = TemplateBlockComponent
/**
 * اطلاعات پایه سربرگ که شامل فیلدهای اصلی سربرگ می‌باشد
 */
type TemplateBase = {
  /**
   * عنوان سربرگ
   */
  title: string
  /**
   * Parent Template
   */
  parent: Id | null
  user: Id

  /**
   * محتوای سربرگ
   */
  content: TemplateContent
  templateFor: [string]

  status: 'active' | 'deactive'
}

/**
 * مدل سربرگ که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی مدل می‌باشد
 */
export type Template = Model & TemplateBase

/**
 * مدل اسکیمای سربرگ برای پایگاه داده که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type TemplateSchema = SchemaModel & TemplateBase

/**
 * ساختار درخواست ارسال داده‌های سربرگ که شامل اطلاعات پایه سربرگ می‌باشد
 */
export type TemplateInput = TemplateBase
