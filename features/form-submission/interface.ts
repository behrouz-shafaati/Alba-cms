import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import {
  Content as FormContentComponent,
  Row as FormRowComponent,
  Column as FormColumnComponent,
  Block as FormBlockComponent,
} from '@/components/builder-form/types'
import { User } from '../user/interface'
import { Form } from '../form/interface'

export type FormContent = FormContentComponent

export type FormRow = FormRowComponent

export type FormColumn = FormColumnComponent

export type FormBlock = FormBlockComponent

export type FormSubmissionTranslationSchema = {
  /**
   * زبان متن
   */
  lang: string // "fa", "en", "de", ...
  /**
   * مقادیر دریافتی
   */
  values: Record<string, any> // چون فیلدها داینامیک هستن

  /**
   * همه ی مقدار ها داخل این فیلد ذخیره می شوند تا بتوان راحت جستجو انجام داد
   */
  searchText?: string
}

/**
 * اطلاعات پایه سربرگ که شامل فیلدهای اصلی سربرگ می‌باشد
 */
type FormSubmissionBase = {
  /**
   * فرم مربوطه
   */
  form: Id

  user: Id | null

  /**
   * محتوا
   */
  translations: [FormSubmissionTranslationSchema]

  /**
   * زبان فرستنده پیام
   */
  senderLocale: 'fa' | 'en'

  status: 'read' | 'unread'
}

/**
 * مدل سربرگ که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی مدل می‌باشد
 */
export type FormSubmission = Model &
  Omit<FormSubmissionBase, 'formId' | 'user'> & {
    form: Form
    user: User | null
  }

/**
 * مدل اسکیمای سربرگ برای پایگاه داده که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type FormSubmissionSchema = SchemaModel & FormSubmissionBase

/**
 * ساختار درخواست ارسال داده‌های سربرگ که شامل اطلاعات پایه سربرگ می‌باشد
 */
export type FormSubmissionInput = FormSubmissionBase
