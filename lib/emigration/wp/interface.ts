import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

// import { Role } from "@entity/role/interface";
/**
 * اطلاعات پایه کاربر که شامل فیلدهای اصلی و مشترک می‌باشد
 */
type WpConfigBase = {
  host: string
  port?: number
  user: string
  password: string
  database: string
  tablePrefix?: string // پیش‌فرض: wp_
}

/**
 * مدل کاربر که شامل اطلاعات پایه و ویژگی‌های اضافی می‌باشد
 */
export type WpConfig = Model & WpConfigBase

/**
 * مدل اسکیمای کاربر برای پایگاه داده که شناسه تصویر به صورت Id ذخیره می‌شود
 */
export type WpConfigSchema = SchemaModel & WpConfigBase

export type TestConnectionProps = {
  host: string // یا IP سرور
  port: number
  user: string // ← تغییر دهید
  password?: string // ← تغییر دهید
  database: string // ← تغییر دهید
  tablePrefix: string // اگر متفاوت است تغییر دهید
}

// ====== اینترفیس ====== مهاجرت لاگ ======
export type WpMigrationLog = {
  entityType: EntityType // نوع: user, post, ...
  wpId: number // ID در وردپرس
  mongoId?: Id // ID در MongoDB (بعد از موفقیت)
  status: MigrationStatus
  errorMessage?: string // پیام خطا (در صورت شکست)
  metadata?: Record<string, any> // اطلاعات اضافی
  attempts: number
  migratedAt?: Date
  createdAt: Date
  updatedAt: Date
} & SchemaModel

/**
 * تایپ‌های مربوط به داده‌های وردپرس
 */

// کاربر دریافتی از API وردپرس
export interface WPUser {
  wpId: number
  user_login: string
  user_email: string
  first_name: string
  last_name: string
  display_name: string
  mobile: string
  roles: string[]
  registered_at: string
  status: number
}

// پاسخ لیست کاربران
export interface WPUsersResponse {
  page: number
  per_page: number
  offset: number
  count: number
  results: WPUser[]
}

// پاسخ تعداد کاربران
export interface WPCountResponse {
  total: number
  by_role: Record<string, number>
}

// پاسخ لیست ID ها
export interface WPIdsResponse {
  total: number
  ids: number[]
}

// تنظیمات کلاینت
export interface WPClientConfig {
  baseUrl: string
  apiKey: string
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
}

/**
 * تایپ‌های مربوط به سیستم مهاجرت
 */

// وضعیت‌های ممکن برای هر رکورد
export type MigrationStatus = 'pending' | 'success' | 'failed' | 'skipped'

// نوع موجودیت (برای آینده)
export type EntityType = 'user' | 'post' | 'comment' | 'term'

// آمار مهاجرت
export interface MigrationStats {
  total: number
  pending: number
  success: number
  failed: number
  skipped: number
  successRate: number
}

// تنظیمات مهاجرت کاربران
export interface MigrationOptions {
  batchSize: number
  concurrency: number
  dryRun: boolean
  verbose: boolean
  maxRetries: number
  skipExisting: boolean
}

// نتیجه مهاجرت یک کاربر
export interface UserMigrationResult {
  wpId: number
  status: MigrationStatus
  mongoId?: string
  error?: string
  skippedReason?: string
}

// نتیجه کلی مهاجرت
export interface MigrationRunResult {
  startedAt: Date
  finishedAt: Date
  duration: number // میلی‌ثانیه
  processed: number
  success: number
  failed: number
  skipped: number
  errors: Array<{ wpId: number; error: string }>
}

// نگاشت نقش‌ها
export const WP_ROLE_MAP: Record<string, string[]> = {
  administrator: ['super_admin'],
  editor: ['content_editor'],
  author: ['author'],
  contributor: ['contributor'],
  subscriber: ['subscriber'],
}

// نقش پیش‌فرض برای نقش‌های ناشناخته
export const DEFAULT_ROLE = 'subscriber'
