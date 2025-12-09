import { createWPTaxonomyClient, WPTaxonomyClient } from './wp-taxonomy-client'
import wpEmigrationCtrl from '../controller'
import { MigrationOptions, MigrationRunResult, WPUser } from '../interface'
import taxonomyController from '@/lib/entity/taxonomy/controller'
import { Taxonomy } from '@/lib/entity/taxonomy/interface'

// تنظیمات پیش‌فرض
const DEFAULT_OPTIONS: MigrationOptions = {
  batchSize: 100,
  concurrency: 5,
  dryRun: false,
  verbose: false,
  maxRetries: 3,
  skipExisting: true,
}

export class TaxonomyMigration {
  private wpClient: WPTaxonomyClient
  private logService: typeof wpEmigrationCtrl

  private options: MigrationOptions
  private logger: (message: string) => void

  constructor(
    connectionData: { baseUrl: string; apiKey: string },
    options: MigrationOptions
  ) {
    this.wpClient = createWPTaxonomyClient(connectionData)
    this.logService = wpEmigrationCtrl
    this.logService.setEntityType('taxonomy')
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.logger = this.options.verbose ? console.log : () => {} // No-op if not verbose
  }

  async startMigration() {
    const startedAt = new Date()
    const errors: Array<{ wpId: number; error: string }> = []
    let processed = 0
    let success = 0
    let failed = 0
    let skipped = 0

    this.logger('🚀 شروع مهاجرت taxonomies...')
    this.logger(`تنظیمات: ${JSON.stringify(this.options, null, 2)}`)

    // ۱. دریافت همه ID ها از وردپرس
    this.logger('📋 دریافت لیست تاکسونومی از وردپرس...')
    const allWpIds = await this.wpClient.getTaxonomyIds()
    this.logger(`تعداد کل تاکسونومی در وردپرس: ${allWpIds.length}`)

    // ۲. فیلتر کردن موارد pending و failed
    const alreadySuccess = await this.logService.getIdMapping()
    const pendingIds = allWpIds.filter((id) => !alreadySuccess.has(id))

    // اضافه کردن failed ها برای retry
    const failedIds = await this.logService.getFailedWpIds(
      this.options.maxRetries
    )

    const idsToProcess = [...new Set([...pendingIds, ...failedIds])]

    this.logger(`تاکسونومی‌ها برای پردازش: ${idsToProcess.length}`)
    this.logger(`  - جدید: ${pendingIds.length}`)
    this.logger(`  - Retry: ${failedIds.length}`)

    if (idsToProcess.length === 0) {
      this.logger('✅ همه تاکسونومی‌ها قبلاً منتقل شده‌اند!')
      return this.buildResult(
        startedAt,
        processed,
        success,
        failed,
        skipped,
        errors
      )
    }

    // ۳. پردازش batch به batch
    for (let i = 0; i < idsToProcess.length; i += this.options.batchSize) {
      const batchIds = idsToProcess.slice(i, i + this.options.batchSize)
      const batchNumber = Math.floor(i / this.options.batchSize) + 1
      const totalBatches = Math.ceil(
        idsToProcess.length / this.options.batchSize
      )

      // دریافت اطلاعات تاکسونومی‌ها از WP
      const wpTaxonomiesMap = await this.wpClient.getBatch(
        batchIds,
        'taxonomies',
        this.options.concurrency,
        (completed, total) => {
          if (this.options.verbose) {
            process.stdout.write(`\r  دریافت از WP: ${completed}/${total}`)
          }
        }
      )

      if (this.options.verbose) {
        console.log('') // New line after progress
      }

      // پردازش هر تاکسونومی
      for (const [wpId, taxonomyOrError] of wpTaxonomiesMap) {
        if (taxonomyOrError instanceof Error) {
          // خطا در دریافت از WP
          await this.logService.logFailure(wpId, taxonomyOrError.message)
          errors.push({ wpId, error: taxonomyOrError.message })
          failed++
        } else {
          // مهاجرت کاربر
          const result = await this.migrateOneTaxonomy(taxonomyOrError)

          if (result.status === 'success') {
            success++
          } else if (result.status === 'failed') {
            failed++
            if (result.error) {
              errors.push({ wpId, error: result.error })
            }
          } else if (result.status === 'skipped') {
            skipped++
          }
        }
        processed++
      }
    }

    return
    for (const item of items) {
      try {
        const original = await this.wpClient.getTaxonomyById(item.id)

        const saved = await this.saveTerm(original)

        await this.logService.logServiceuccess({
          itemId: original.wpId,
          metadata: {
            name: original.name,
            taxonomy: original.taxonomy,
          },
        })
      } catch (error: any) {
        await this.logService.logFailure({
          itemId: item.id,
          error: error.message ?? 'Unknown error',
        })
      }
    }
  }

  async saveTerm(term: any) {
    const parent = term.parent
      ? await Taxonomy.findOne({ wpId: term.parent })
      : null

    const ancestors =
      term.ancestors && term.ancestors.length
        ? await Taxonomy.find({ wpId: { $in: term.ancestors } })
        : []

    return Taxonomy.findOneAndUpdate(
      { wpId: term.wpId },
      {
        name: term.name,
        slug: term.slug,
        taxonomy: term.taxonomy,
        type: term.albaType,
        description: term.description,
        meta: term.meta,
        translations: term.translations,
        parent: parent ? parent._id : null,
        ancestors: ancestors.map((a) => a._id),
      },
      { upsert: true, new: true }
    )
  }

  /**
   * ساخت نتیجه
   */
  private buildResult(
    startedAt: Date,
    processed: number,
    success: number,
    failed: number,
    skipped: number,
    errors: Array<{ wpId: number; error: string }>
  ): MigrationRunResult {
    const finishedAt = new Date()
    return {
      startedAt,
      finishedAt,
      duration: finishedAt.getTime() - startedAt.getTime(),
      processed,
      success,
      failed,
      skipped,
      errors: errors.slice(0, 100), // حداکثر ۱۰۰ خطا
    }
  }

  /**
   * ساخت metadata برای لاگ
   */
  private buildMetadata(wpUser: WPUser): any {
    return {
      userName: wpUser.userName?.toLowerCase(),
      email: wpUser.email?.toLowerCase(),
      firstName: wpUser.firstName || undefined,
      lastName: wpUser.lastName || undefined,
      mobile: wpUser.mobile || undefined,
      roles: wpUser.roles,
    }
  }

  /**
   * بررسی وجود کاربر در MongoDB
   */
  private async checkExisting(
    wpTaxonomy: WPUser
  ): Promise<{ exists: boolean; mongoId?: string; reason?: string }> {
    const taxonomyCtrl = new taxonomyController('category')
    // بررسی با slug
    const bySlug = await taxonomyCtrl.findOne({
      filters: { slug: wpTaxonomy.slug.toLowerCase() },
    })
    if (bySlug) {
      return {
        exists: true,
        mongoId: bySlug?.id.toString(),
        reason: 'slug duplicate',
      }
    }

    // بررسی با wpId (اگر قبلاً منتقل شده)
    const byWpId = await taxonomyCtrl.findOne({
      filters: { 'metadata.wpId': wpTaxonomy.wpId },
    })
    if (byWpId) {
      return {
        exists: true,
        mongoId: byWpId?.id.toString(),
        reason: 'wpId duplicate',
      }
    }

    return { exists: false }
  }

  /**
   * تبدیل کاربر WP به فرمت MongoDB
   */
  private transformTaxonomy(wpTaxonomy: WPUser): Partial<Taxonomy> {
    return {
      type: wpTaxonomy.albaType,
      parent: wpTaxonomy.parent,
      ancestors: wpTaxonomy.ancestors,
      level: 0,
      slug: wpTaxonomy.slug,
      translations: {
        lang: 'fa',
        title: wpTaxonomy.name,
        description: wpTaxonomy.description,
      },
      image: wpTaxonomy.thumbnail,
      icon: '',
      status: 'active',
      user: null,
      metadata: { wpId: wpTaxonomy.wpId }, // ذخیره ID اصلی برای مراجعات بعدی
      count: 0,
      createdAt: new Date(wpTaxonomy.registeredAt),
      updatedAt: new Date(),
    }
  }

  /**
   * مهاجرت یک تاکسونومی
   */
  private async migrateOneTaxonomy(
    wpTaxonomy: WPUser
  ): Promise<MigrationResult> {
    //   const metadata = this.buildMetadata(wpTaxonomy)

    try {
      // بررسی وجود قبلی
      if (this.options.skipExisting) {
        const existing = await this.checkExisting(wpTaxonomy)
        if (existing.exists) {
          await this.logService.logSkipped(
            wpTaxonomy.wpId,
            existing.reason || 'already exists',
            wpTaxonomy
          )
          return {
            wpId: wpTaxonomy.wpId,
            status: 'skipped',
            mongoId: existing.mongoId,
            skippedReason: existing.reason,
          }
        }
      }

      // Dry Run - فقط لاگ کن
      if (this.options.dryRun) {
        this.logger(`[DRY RUN] Would migrate: ${wpTaxonomy.slug}`)
        return {
          wpId: wpTaxonomy.wpId,
          status: 'success',
          mongoId: 'dry-run-id',
        }
      }

      // تبدیل و ذخیره
      const taxonomyCtrl = new taxonomyController('category')

      return
      const taxonomyData = this.transformTaxonomy(wpTaxonomy)
      const newTaxonomy = await taxonomyCtrl.create({ params: taxonomyData })

      const mongoId = newUser.id.toString()
      await this.logService.logSuccess(wpUser.wpId, mongoId, metadata)

      this.logger(`✓ Migrated: ${wpUser.email} -> ${mongoId}`)

      return {
        wpId: wpUser.wpId,
        status: 'success',
        mongoId,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      await this.logService.logFailure(wpUser.wpId, errorMessage, metadata)

      this.logger(`✗ Failed: ${wpUser.email} - ${errorMessage}`)

      return {
        wpId: wpUser.wpId,
        status: 'failed',
        error: errorMessage,
      }
    }
  }
}
