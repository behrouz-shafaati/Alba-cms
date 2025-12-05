import { Id } from '@/lib/entity/core/interface'
import { Document } from 'mongoose'

export type VerificationPurpose =
  | 'signup'
  | 'login'
  | 'password_reset'
  | 'email_change'
  | 'phone_change'
  | 'two_factor_auth'
  | 'other'

export type VerificationChannel =
  | 'sms'
  | 'email'
  | 'whatsapp'
  | 'voice'
  | 'other'

export interface IVerificationCode extends Document {
  user: Id
  // اطلاعات اصلی
  targetEmail?: string | null // اگر برای ایمیل است
  targetPhone?: string | null // اگر برای موبایل است (E.164 recommended)
  hashedCode: string // هشِ کد
  salt: string // salt برای هش
  codeLength: number

  // مشخصه‌ها
  purpose: VerificationPurpose
  channel: VerificationChannel

  // وضعیت
  used: boolean
  attempts: number // تلاش‌های ناموفق برای وارد کردن کد
  maxAttempts: number // محدودیت پیش‌فرض

  // زمان‌ها
  expiresAt: Date
  createdAt: Date
  updatedAt: Date

  // متادیتا برای لاگ/محدودسازی
  ip?: string | null
  userAgent?: string | null
  metadata?: Record<string, any>

  // متدهای instance
  isExpired(): boolean
  compareCode(plain: string): boolean
  deleted: boolean
}
