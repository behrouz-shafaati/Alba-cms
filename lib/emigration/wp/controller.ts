import MigrationLog from './schema'
import emigrationWpService from './service'
import coreController from '@/lib/entity/core/controller'
import {
  EntityType,
  MigrationStats,
  MigrationStatus,
  TestConnectionProps,
  WpMigrationLog,
} from './interface'
import { WPDatabase } from './wp-connection'

class controller extends coreController {
  private entityType: EntityType
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the emigrationWpController class extended of the main parent class baseController.
   *
   * @param service - emigrationWpService
   *emigrationWpCtrl
   * @beta
   */
  constructor(service: any) {
    super(service)
  }

  setEntityType(entityType: EntityType) {
    this.entityType = entityType
  }

  async testConnection({
    host,
    port,
    user,
    password = '',
    database,
    tablePrefix,
  }: TestConnectionProps): Promise<{
    success: boolean
    reportedHost?: any
    recentPosts?: any[]
  }> {
    const wp = new WPDatabase({
      host,
      port,
      user,
      password,
      database,
      tablePrefix,
    })

    let reportedHost = undefined,
      recentPosts = undefined,
      success = false

    try {
      // اتصال
      await wp.connect()

      // تست
      success = await wp.testConnection()

      if (success) {
        // نمایش آمار کامل
        reportedHost = await wp.getStats()

        // نمونه: گرفتن ۵ پست اخیر
        console.log('\n📝 ۵ پست اخیر:')
        recentPosts = await wp.query(`
        SELECT ID, post_title, post_author, post_date
        FROM ${wp.table('posts')}
        WHERE post_type = 'post' AND post_status = 'publish'
        ORDER BY post_date DESC
        LIMIT 5
      `)

        recentPosts.forEach((post: any) => {
          console.log(`   [${post.ID}] ${post.post_title}`)
        })
      }
    } catch (error) {
      console.error('❌ خطا:', error)
      return {
        success: false,
        reportedHost,
        recentPosts,
      }
    } finally {
      await wp.disconnect()
      return {
        success,
        reportedHost,
        recentPosts,
      }
    }
  }

  // گرفتن MongoDB ID از روی WP ID
  async getMongoId(
    entityType: EntityType,
    wpId: number
  ): Promise<string | null> {
    const log = await this.findOne({
      filters: { entityType, wpId, status: 'success' },
    })
    return log?.mongoId || null
  }

  // لیست موارد ناموفق
  async getFailedItems(
    entityType: EntityType,
    limit = 100
  ): Promise<WpMigrationLog[]> {
    return this.find({
      filters: { entityType, status: 'failed' },
      pagination: { page: 1, perPage: limit },
    }).data
  }

  /**
   * ثبت شروع مهاجرت (pending) - بدون metadata
   */
  async initPending(wpIds: number[]): Promise<number> {
    const items: any[] = wpIds.map((wpId) => ({ wpId }))
    return this.initPendingWithMetadata(items)
  }

  /**
   * ✅ ثبت شروع مهاجرت (pending) - با metadata
   */
  async initPendingWithMetadata(items: any[]): Promise<number> {
    const operations = items.map(({ wpId, metadata }) => ({
      updateOne: {
        filter: { entityType: this.entityType, wpId },
        update: {
          $setOnInsert: {
            entityType: this.entityType,
            wpId,
            status: 'pending',
            attempts: 0,
          },
          // metadata را همیشه آپدیت کن (حتی اگر رکورد وجود داشت)
          $set: metadata ? { metadata } : {},
        },
        upsert: true,
      },
    }))

    const result = await wpEmigrationCtrl.bulkWrite(operations, {
      ordered: false,
    })
    return result.upsertedCount + result.modifiedCount
  }

  /**
   * ✅ ثبت موفقیت با metadata
   */
  async logSuccess(
    wpId: number,
    mongoId: string,
    metadata?: any
  ): Promise<void> {
    const updateData: Record<string, unknown> = {
      status: 'success',
      mongoId,
      errorMessage: null,
    }

    if (metadata) {
      updateData.metadata = metadata
    }

    await wpEmigrationCtrl.findOneAndUpdate({
      filters: { entityType: this.entityType, wpId },
      params: {
        $set: updateData,
        $inc: { attempts: 1 },
      },
      options: { upsert: true },
    })
  }

  /**
   * ✅ ثبت شکست با metadata
   */
  async logFailure(wpId: number, error: string, metadata?: any): Promise<void> {
    const updateData: Record<string, unknown> = {
      status: 'failed',
      errorMessage: error,
    }

    if (metadata) {
      updateData.metadata = metadata
    }

    await wpEmigrationCtrl.findOneAndUpdate({
      filters: { entityType: this.entityType, wpId },
      params: {
        $set: updateData,
        $inc: { attempts: 1 },
      },
      options: { upsert: true },
    })
  }

  /**
   * ✅ ثبت رد شده با metadata
   */
  async logSkipped(
    wpId: number,
    reason: string,
    metadata?: any
  ): Promise<void> {
    const updateData: Record<string, unknown> = {
      status: 'skipped',
      errorMessage: reason,
    }

    if (metadata) {
      updateData.metadata = metadata
    }

    await wpEmigrationCtrl.findOneAndUpdate({
      filters: { entityType: this.entityType, wpId },
      params: {
        $set: updateData,
        $inc: { attempts: 1 },
      },
      options: { upsert: true },
    })
  }

  /**
   * دریافت وضعیت یک رکورد
   */
  async getStatus(wpId: number): Promise<MigrationStatus | null> {
    const doc = await wpEmigrationCtrl.findOne({
      filters: { entityType: this.entityType, wpId },
    })

    return doc?.status || null
  }

  /**
   * ✅ دریافت لاگ کامل یک رکورد (شامل metadata)
   */
  async getLog(wpId: number): Promise<WpMigrationLog | null> {
    return wpEmigrationCtrl.findOne({
      filters: { entityType: this.entityType, wpId },
    })
  }

  /**
   * ✅ جستجو بر اساس email در metadata
   */
  async findByEmail(email: string): Promise<WpMigrationLog | null> {
    return wpEmigrationCtrl.findOne({
      filters: {
        entityType: this.entityType,
        'metadata.email': email.toLowerCase(),
      },
    })
  }

  /**
   * ✅ جستجو بر اساس userName در metadata
   */
  async findByUserName(userName: string): Promise<WpMigrationLog | null> {
    return wpEmigrationCtrl.findOne({
      filters: {
        entityType: this.entityType,
        'metadata.userName': userName.toLowerCase(),
      },
    })
  }

  /**
   * دریافت لیست ID های pending
   */
  async getPendingWpIds(limit?: number): Promise<number[]> {
    const result = await wpEmigrationCtrl.find({
      filters: { entityType: this.entityType, status: 'pending' },
      pagination: { page: 1, perPage: limit || 1000 },
    })
    return result?.data.map((d) => d.wpId)
  }

  /**
   * ✅ دریافت لیست کامل pending ها با metadata
   */
  async getPendingWithMetadata(
    limit?: number
  ): Promise<Array<{ wpId: number; metadata?: MigrationMetadata }>> {
    const result = await wpEmigrationCtrl.find({
      filters: { entityType: this.entityType, status: 'pending' },
      pagination: { page: 1, perPage: limit || 1000 },
    })

    return result?.data.map((d) => ({
      wpId: d.wpId,
      metadata: d.metadata,
    }))
  }

  /**
   * دریافت لیست ID های failed (برای retry)
   */
  async getFailedWpIds(maxAttempts: number = 3): Promise<number[]> {
    const result = await wpEmigrationCtrl.find({
      filters: {
        entityType: this.entityType,
        status: 'failed',
        attempts: { $lt: maxAttempts },
      },
      pagination: { page: 1, perPage: 1000 },
    })

    return result?.data.map((d) => d.wpId)
  }

  /**
   * ✅ دریافت لیست failed با metadata و error
   */
  async getFailedWithDetails(maxAttempts: number = 3): Promise<
    Array<{
      wpId: number
      metadata?: any
      errorMessage?: string
      attempts: number
    }>
  > {
    const result = await wpEmigrationCtrl.findAll({
      filters: {
        entityType: this.entityType,
        status: 'failed',
        attempts: { $lt: maxAttempts },
      },
    })

    return result?.data.map((d) => ({
      wpId: d.wpId,
      metadata: d.metadata,
      errorMessage: d.errorMessage,
      attempts: d.attempts,
    }))
  }

  /**
   * بررسی اینکه آیا قبلاً با موفقیت منتقل شده
   */
  async isAlreadyMigrated(wpId: number): Promise<boolean> {
    const doc = await wpEmigrationCtrl.findOne({
      filters: { entityType: this.entityType, wpId, status: 'success' },
    })

    return !!doc
  }

  /**
   * ریست کردن failed ها به pending
   */
  async resetFailed(): Promise<number> {
    const result = await wpEmigrationCtrl.updateMany({
      filters: { entityType: this.entityType, status: 'failed' },
      params: { $set: { status: 'pending', errorMessage: null } },
    })

    return result.totalDocuments
  }

  /**
   * ریست کردن یک رکورد خاص به pending
   */
  async resetToPending(wpId: number): Promise<boolean> {
    const result = await wpEmigrationCtrl.findOneAndUpdate({
      filters: { entityType: this.entityType, wpId },
      params: { $set: { status: 'pending', errorMessage: null } },
    })

    return result.totalDocuments > 0
  }

  /**
   * دریافت آمار کلی مهاجرت
   */
  async getStats(): Promise<MigrationStats> {
    const pipeline = [
      { $match: { entityType: this.entityType } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]

    const results = await wpEmigrationCtrl.aggregate(pipeline)

    const stats: MigrationStats = {
      total: 0,
      pending: 0,
      success: 0,
      failed: 0,
      skipped: 0,
      successRate: 0,
    }

    results.forEach((r) => {
      const status = r._id as MigrationStatus
      stats[status] = r.count
      stats.total += r.count
    })

    if (stats.total > 0) {
      stats.successRate =
        Math.round((stats.success / stats.total) * 100 * 100) / 100
    }

    return stats
  }

  /**
   * ✅ دریافت آخرین لاگ‌ها با جزئیات
   */
  async getRecentLogs(
    limit: number = 50,
    status?: MigrationStatus
  ): Promise<WpMigrationLog[]> {
    const filter: Record<string, unknown> = { entityType: this.entityType }
    if (status) {
      filter.status = status
    }

    return wpEmigrationCtrl.find({
      filters: filter,
      pagination: { page: 1, perPage: limit },
      sort: { updatedAt: -1 },
    })?.data
  }

  /**
   * ✅ جستجوی پیشرفته در لاگ‌ها
   */
  async searchLogs(options: {
    status?: MigrationStatus
    search?: string // جستجو در email یا userName
    page?: number
    limit?: number
  }): Promise<{
    logs: WpMigrationLog[]
    total: number
    page: number
    totalPages: number
  }> {
    const { status, search, page = 1, limit = 50 } = options

    const filter: Record<string, unknown> = { entityType: this.entityType }

    if (status) {
      filter.status = status
    }

    if (search) {
      filter.$or = [
        { 'metadata.email': { $regex: search, $options: 'i' } },
        { 'metadata.userName': { $regex: search, $options: 'i' } },
        { 'metadata.firstName': { $regex: search, $options: 'i' } },
        { 'metadata.lastName': { $regex: search, $options: 'i' } },
      ]
    }

    const total = await wpEmigrationCtrl.countAll({ filters: filter })
    const totalPages = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const logs = await wpEmigrationCtrl.find({
      filters: filter,
      pagination: { page, perPage: limit },
      sort: { updatedAt: -1 },
    })?.data

    return { logs, total, page, totalPages }
  }

  /**
   * حذف همه لاگ‌های این نوع موجودیت
   */
  async clearAll(): Promise<number> {
    const result = await wpEmigrationCtrl.deleteMany({
      filters: { entityType: this.entityType },
    })

    return result.deletedCount
  }

  /**
   * دریافت نگاشت wpId به mongoId برای موارد موفق
   */
  async getIdMapping(): Promise<Map<number, string>> {
    const docs = await wpEmigrationCtrl.findAll({
      filters: {
        entityType: this.entityType,
        status: 'success',
        mongoId: { $ne: null },
      },
    })

    const map = new Map<number, string>()
    docs.data.forEach((d) => {
      if (d.mongoId) {
        map.set(d.wpId, d.mongoId)
      }
    })

    return map
  }

  /**
   * ✅ بررسی تکراری بودن email
   */
  async isEmailMigrated(
    email: string
  ): Promise<{ exists: boolean; wpId?: number; mongoId?: string }> {
    const doc = await wpEmigrationCtrl.findOne({
      filters: {
        entityType: this.entityType,
        status: 'success',
        'metadata.email': email.toLowerCase(),
      },
    })

    if (doc) {
      return {
        exists: true,
        wpId: doc?.wpId,
        mongoId: doc?.mongoId || undefined,
      }
    }

    return { exists: false }
  }
}

const wpEmigrationCtrl = new controller(new emigrationWpService(MigrationLog))
export default wpEmigrationCtrl
