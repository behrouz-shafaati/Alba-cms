import { createWPPostClient, WPPostClient } from './wp-post-client'
import wpEmigrationCtrl from '../controller'
import { MigrationOptions, MigrationRunResult, WPUser } from '../interface'
import taxonomyController from '@/lib/entity/taxonomy/controller'
import { WPImageMigrationHelper } from '@/lib/html-to-tiptap/helpers/ImageMigrationHelper'
import { HtmlToTiptapConverter } from '@/lib/html-to-tiptap/HtmlToTiptapConverter'
import { GetPostIdsResponse, WpPost, WpPostStatus } from './types'
import postCtrl from '@/features/post/controller'
import { Post, PostStatus } from '@/features/post/interface'
import categoryCtrl from '@/features/category/controller'
import tagCtrl from '@/features/tag/controller'
import contentJson2PlainText from '@/lib/utils/contentJson2PlainText'
import getReadingTime from '@/lib/utils/getReadingTime'
import userCtrl from '@/features/user/controller'
import replaceLinksInHtml from '@/lib/utils/replaceInternalLinksInHtml'
import { LinkReplacerConfig } from '@/lib/utils/replaceInternalLinks'
import replaceLinksInDocument from '@/lib/utils/replaceInternalLinksInTipTap'
import { sanitizeTipTapContent } from '@/lib/utils/sanitizeTipTapContent'

// تنظیمات پیش‌فرض
const DEFAULT_OPTIONS: MigrationOptions = {
  newBaseUrl: '',
  batchSize: 100,
  concurrency: 5,
  dryRun: false,
  verbose: false,
  maxRetries: 3,
  skipExisting: true,
}

type PostItem = {
  id: number
}

export default class PostMigration {
  private wpClient: WPPostClient
  private newBaseUrl: string
  private oldDomain: string
  private logService: typeof wpEmigrationCtrl

  private options: MigrationOptions
  private logger: (message: string) => void

  constructor(
    connectionData: { baseUrl: string; apiKey: string },
    options: MigrationOptions
  ) {
    this.newBaseUrl = options.newBaseUrl
    this.oldDomain = connectionData.baseUrl.replace(/\/+$/, '')
    this.wpClient = createWPPostClient(connectionData)
    this.logService = wpEmigrationCtrl
    this.logService.setEntityType('post')
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

    this.logger('🚀 شروع مهاجرت مطالب...')
    this.logger(`تنظیمات: ${JSON.stringify(this.options, null, 2)}`)

    // ۱. دریافت همه ID ها از وردپرس
    this.logger('📋 دریافت لیست مطالب از وردپرس...')
    let allWpPosts: GetPostIdsResponse = await this.wpClient.getPostIds()
    console.log('#2394ss876 allWpPosts :', allWpPosts)
    const allWpIds = allWpPosts.data.ids //استخراج ids
    console.log('#2394876 allWpIds :', allWpIds)
    this.logger(`تعداد کل تاکسونومی در وردپرس: ${allWpIds.length}`)

    // اگر داخل logService‌ نباشد یعنی هیچ تلاشی برای دریافت آن انجام نشده
    this.logger(`فیلتر تاکسونومی‌های منتقل شده یا در حال پردازش...`)
    // ۲. فیلتر کردن موارد pending و failed
    const alreadySuccess = await this.logService.getIdMapping()
    const pendingIds = allWpIds.filter((id) => !alreadySuccess.has(id))

    // اضافه کردن failed ها برای retry
    const failedIds = await this.logService.getFailedWpIds(
      this.options.maxRetries
    )

    const idsToProcess = [...new Set([...pendingIds, ...failedIds])]

    this.logger(`پست ها برای پردازش: ${idsToProcess.length}`)
    this.logger(`  - جدید: ${pendingIds.length}`)
    this.logger(`  - Retry: ${failedIds.length}`)

    if (idsToProcess.length === 0) {
      this.logger('✅ همه پست ها قبلاً منتقل شده‌اند!')
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

      // دریافت اطلاعات پست ها از WP
      const wpTaxonomiesMap = await this.wpClient.getBatch(
        batchIds,
        'posts',
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

      // پردازش هر پست
      for (const [wpId, postOrError] of wpTaxonomiesMap) {
        if (postOrError.success) {
          const wpPost = postOrError.data

          // مهاجرت تاکسونومی
          console.log(
            `start post migrate with id ${wpPost?.wpId} and type ${wpPost?.post_type}`
          )
          const result = await this.migrateOnePost(wpPost)

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
        } else {
          await this.logService.logFailure(
            wpId,
            postOrError?.message || '_no_message_'
          )
          errors.push({ wpId, error: postOrError.message })
          failed++
        }
        processed++
      }
    }

    const result = this.buildResult(
      startedAt,
      processed,
      success,
      failed,
      skipped,
      errors
    )
    this.logger(result)

    return result
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
   * نگاشت وضعیت پست از وردپرس به Alba
   */
  mapToAlbaPostStatus(wpPostStatus: WpPostStatus): PostStatus {
    const mapping: Record<WpPostStatus, PostStatus> = {
      publish: 'published',
      draft: 'draft',
      pending: 'draft', // در انتظار بررسی → پیش‌نویس
      private: 'published', // خصوصی → منتشرشده (با دسترسی محدود)
      future: 'draft', // زمان‌بندی شده → پیش‌نویس
      trash: 'draft', // زباله‌دان → پیش‌نویس
      'auto-draft': 'draft', // پیش‌نویس خودکار
      inherit: 'draft', // ارثی (برای revision ها)
    }

    return mapping[wpPostStatus] ?? 'draft'
  }

  /**
   * بررسی وجود taxonomy در MongoDB
   */
  private async checkExisting(
    wpPost: WpPost
  ): Promise<{ exists: boolean; mongoId?: string; reason?: string }> {
    // بررسی با slug
    const bySlug = await postCtrl.findOne({
      filters: { slug: wpPost.slug.toLowerCase() },
    })
    if (bySlug) {
      return {
        exists: true,
        mongoId: bySlug?.id.toString(),
        reason: 'slug duplicate',
      }
    }

    // بررسی با wpId (اگر قبلاً منتقل شده)
    const byWpId = await postCtrl.findOne({
      filters: { 'metadata.wpId': wpPost.wpId },
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
  // example input :
  private async transformWpPost(wpPost: WpPost): Promise<Partial<Post | null>> {
    const postStatus = this.mapToAlbaPostStatus(wpPost.status)
    const imageMigeration = new WPImageMigrationHelper()
    const HtmlToTiptapjsonConverter = new HtmlToTiptapConverter({
      defaultDir: 'rtl',
      logErrors: true,
      skipImages: false,
      imageMigrationHelper: imageMigeration,
    })
    let contentJson = {}
    let image,
      mainCategoryId,
      allCategoryIds,
      tagIds,
      author = null

    const linkReplacerConfig: LinkReplacerConfig = {
      newBaseUrl: this.newBaseUrl,
      oldDomains: [this.oldDomain],
    }
    const contentConvertResult = await HtmlToTiptapjsonConverter.convert(
      wpPost.content
    )
    if (contentConvertResult.success) {
      const convertedInternalLink = replaceLinksInDocument(
        contentConvertResult.document,
        linkReplacerConfig
      )
      contentJson = sanitizeTipTapContent(convertedInternalLink)
    }

    // set main image
    if (wpPost?.featured_image?.url) {
      image = await imageMigeration.migrateImage(
        wpPost?.featured_image?.url,
        wpPost?.featured_image?.alt
      )
    }

    // set main category
    let mainCategoryWpId = null
    if (wpPost?.categories?.primary_wpId) {
      // set main category
      mainCategoryWpId = wpPost?.categories?.primary_wpId
    } else {
      mainCategoryWpId = wpPost?.categories?.all_wpIds?.[0]
    }

    if (mainCategoryWpId) {
      const mainCategory = await categoryCtrl.findOne({
        filters: { 'metadata.wpId': mainCategoryWpId },
      })
      if (mainCategory) mainCategoryId = mainCategory?.id || null
    }

    // set all categories
    if (wpPost?.categories?.all_wpIds) {
      const allCategoriesResult = await categoryCtrl.findAll({
        filters: { 'metadata.wpId': wpPost?.categories?.all_wpIds },
      })
      allCategoryIds = allCategoriesResult.data.map((cat) => cat.id)
    }

    // set all tags
    if (wpPost?.tags_wpIds) {
      const allTagsResult = await tagCtrl.findAll({
        filters: { 'metadata.wpId': wpPost?.tags_wpIds },
      })
      tagIds = allTagsResult.data.map((tag) => tag.id)
    }

    console.log('#234876 wpPost?.author_wpId:', wpPost?.author_wpId)
    // set author
    if (wpPost?.author_wpId) {
      const userResult = await userCtrl.findOne({
        filters: { 'metadata.wpId': wpPost?.author_wpId },
      })
      console.log('#234876 user author Result:', userResult)
      if (userResult) author = userResult
    }
    const authorName = `${author?.firstName} ${author?.lastName}`

    const translations = [
      {
        lang: 'fa', // "fa", "en", "de", ...
        title: wpPost?.title,
        seoTitle: wpPost?.seo?.title || '',
        excerpt: wpPost?.excerpt || '',
        metaDescription: wpPost?.seo?.description || '',
        jsonLd: '',
        contentJson: JSON.stringify(contentJson) || '',
      },
    ]

    return {
      user: null,
      author: author?.id,
      authorName,
      image: image?.id || null,
      slug: decodeURI(wpPost?.slug),
      translations,
      mainCategory: mainCategoryId,
      categories: allCategoryIds,
      tags: tagIds,
      status: postStatus,
      metadata: { wpId: wpPost.wpId }, // ذخیره ID اصلی برای مراجعات بعدی
      publishedAt: new Date(wpPost.published_at),
      createdAt: new Date(wpPost.created_at),
      updatedAt: new Date(),
    }
  }

  /**
   * مهاجرت یک تاکسونومی
   */
  private async migrateOnePost(wpPost: WpPost): Promise<MigrationResult> {
    //   const metadata = this.buildMetadata(wpTaxonomy)
    const metadata = wpPost
    let newPost
    try {
      // بررسی وجود قبلی
      if (this.options.skipExisting) {
        const existing = await this.checkExisting(wpPost)
        if (existing.exists) {
          await this.logService.logSkipped(
            wpPost.wpId,
            existing.reason || 'already exists',
            wpPost
          )
          return {
            wpId: wpPost.wpId,
            status: 'skipped',
            mongoId: existing.mongoId,
            skippedReason: existing.reason,
          }
        }
      }

      // Dry Run - فقط لاگ کن
      if (this.options.dryRun) {
        this.logger(`[DRY RUN] Would migrate: ${wpPost.slug}`)
        return {
          wpId: wpPost.wpId,
          status: 'success',
          mongoId: 'dry-run-id',
        }
      }

      // تبدیل و ذخیره
      const postPayload = await this.transformWpPost(wpPost)

      newPost = await postCtrl.create({
        params: { ...postPayload, locale: 'fa' },
      })

      const mongoId = newPost.id.toString()
      await this.logService.logSuccess(wpPost.wpId, mongoId, metadata)

      this.logger(`✓ Migrated: ${newPost.slug} -> ${mongoId}`)

      return {
        wpId: wpPost.wpId,
        status: 'success',
        mongoId,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      await this.logService.logFailure(wpPost?.wpId, errorMessage, metadata)

      this.logger(`✗ Failed: ${wpPost.slug} - ${errorMessage}`)

      return {
        wpId: wpPost.wpId,
        status: 'failed',
        error: errorMessage,
      }
    }
  }
}
