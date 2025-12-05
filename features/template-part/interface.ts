import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import {
  Content as TemplatePartContentComponent,
  Row as TemplatePartRowComponent,
  Column as TemplatePartColumnComponent,
  Block as TemplatePartBlockComponent,
} from '@/components/builder-template-part/types'

export type TemplatePartContent = TemplatePartContentComponent

export type TemplatePartRow = TemplatePartRowComponent

export type TemplatePartColumn = TemplatePartColumnComponent

export type TemplatePartBlock = TemplatePartBlockComponent
/**
 * اطلاعات پایه سربرگ که شامل فیلدهای اصلی سربرگ می‌باشد
 */
type TemplatePartBase = {
  /**
   * عنوان سربرگ
   */
  title: string

  user: Id

  /**
   * محتوای سربرگ
   */
  content: TemplatePartContent

  status: 'deactive' | 'active'
}

/**
 * مدل سربرگ که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی مدل می‌باشد
 */
export type TemplatePart = Model & TemplatePartBase

/**
 * مدل اسکیمای سربرگ برای پایگاه داده که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type TemplatePartSchema = SchemaModel & TemplatePartBase

/**
 * ساختار درخواست ارسال داده‌های سربرگ که شامل اطلاعات پایه سربرگ می‌باشد
 */
export type TemplatePartInput = TemplatePartBase
