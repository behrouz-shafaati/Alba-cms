// ====== تنظیمات مهاجرت ======

export const MIGRATION_CONFIG = {
  // تنظیمات مهاجرت
  migration: {
    batchSize: 50, // تعداد رکورد در هر batch
    concurrency: 5, // تعداد عملیات همزمان
    retryAttempts: 3, // تعداد تلاش مجدد
    retryDelay: 1000, // تأخیر بین retry (ms)
  },

  // نگاشت نقش‌ها از وردپرس به سیستم جدید
  roleMapping: {
    administrator: ['super_admin'],
    editor: ['content_editor'],
    author: ['author'],
    contributor: ['contributor'],
    subscriber: ['subscriber'],
  } as Record<string, string[]>,

  // نقش پیش‌فرض
  defaultRoles: ['subscriber'],
}
