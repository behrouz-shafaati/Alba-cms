import {
  createWPPostCommentClient,
  WPPostCommentClient,
} from './wp-post-comment-client'
import wpEmigrationCtrl from '../controller'
import { MigrationOptions, MigrationRunResult, WPUser } from '../interface'
import { WPImageMigrationHelper } from '@/lib/html-to-tiptap/helpers/ImageMigrationHelper'
import { HtmlToTiptapConverter } from '@/lib/html-to-tiptap/HtmlToTiptapConverter'
import {
  GetPostCommentIdsResponse,
  WpPostComment,
  WpPostCommentStatus,
} from './types'
import postCtrl from '@/features/post/controller'
import { PostComment } from '@/features/post-comment/interface'
import userCtrl from '@/features/user/controller'
import { LinkReplacerConfig } from '@/lib/utils/replaceInternalLinks'
import replaceLinksInDocument from '@/lib/utils/replaceInternalLinksInTipTap'
import { sanitizeTipTapContent } from '@/lib/utils/sanitizeTipTapContent'
import postCommentCtrl from '@/features/post-comment/controller'
import extractExcerptFromContentJson from '@/lib/utils/extractExcerptFromContentJson'

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

type PostCommentItem = {
  id: number
}

export default class PostCommentMigration {
  private wpClient: WPPostCommentClient
  private newBaseUrl: string
  private oldDomain: string
  private logService: typeof wpEmigrationCtrl
  private locale = 'fa'

  private options: MigrationOptions
  private logger: (message: string) => void

  constructor(
    connectionData: { baseUrl: string; apiKey: string },
    options: MigrationOptions
  ) {
    this.newBaseUrl = options.newBaseUrl
    this.oldDomain = connectionData.baseUrl.replace(/\/+$/, '')
    this.wpClient = createWPPostCommentClient(connectionData)
    this.logService = wpEmigrationCtrl
    this.logService.setEntityType('post_comment')
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
    let allWpPostComments: GetPostCommentIdsResponse =
      await this.wpClient.getPostCommentIds()
    console.log('#2394ss876 allWpPostComments :', allWpPostComments)
    const allWpIds = allWpPostComments.ids //استخراج ids
    console.log('#2394یب876 allWpIds for post comments :', allWpIds)
    this.logger(`تعداد کل دیدگاه در وردپرس: ${allWpIds.length}`)

    // اگر داخل logService‌ نباشد یعنی هیچ تلاشی برای دریافت آن انجام نشده
    this.logger(`فیلتر دیدگاه‌های منتقل شده یا در حال پردازش...`)
    // ۲. فیلتر کردن موارد pending و failed
    const alreadySuccess = await this.logService.getIdMapping()
    const pendingIds = allWpIds.filter((id) => !alreadySuccess.has(id))

    // اضافه کردن failed ها برای retry
    const failedIds = await this.logService.getFailedWpIds(
      this.options.maxRetries
    )

    const idsToProcess = [...new Set([...pendingIds, ...failedIds])]

    this.logger(`دیدگاه‌ها برای پردازش: ${idsToProcess.length}`)
    this.logger(`  - جدید: ${pendingIds.length}`)
    this.logger(`  - Retry: ${failedIds.length}`)

    if (idsToProcess.length === 0) {
      this.logger('✅ همه دیدگاه‌ها قبلاً منتقل شده‌اند!')
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

      // دریافت اطلاعات دیدگاه‌ها از WP
      const wpPostCommentsMap = await this.wpClient.getBatch(
        batchIds,
        'post_comments',
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

      // پردازش هر دیدگاه‌
      for (const [wpId, postCommentOrError] of wpPostCommentsMap) {
        console.log('#234897 postCommentOrError:', postCommentOrError)
        if (postCommentOrError.success) {
          const wpPostComment: WpPostComment = postCommentOrError.data

          // مهاجرت دیدگاه
          console.log(
            `start post migrate with id ${wpPostComment?.wpId} and post_id ${wpPostComment?.post_wpId}`
          )
          const result = await this.migrateOnePostComment(wpPostComment)

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
            postCommentOrError?.message || '_no_message_'
          )
          errors.push({ wpId, error: postCommentOrError.message })
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
   * نگاشت وضعیت دیدگاه‌ از وردپرس به Alba
   */
  mapToAlbaPostCommentStatus(
    wpPostCommentStatus: WpPostCommentStatus
  ): PostCommentStatus {
    const mapping: Record<WpPostCommentStatus, PostCommentStatus> = {
      approved: 'approved',
      pending: 'pending',
    }

    return mapping[wpPostCommentStatus] ?? 'draft'
  }

  /**
   * بررسی وجود postComment در MongoDB
   */
  private async checkExisting(
    wpPostComment: WpPostComment
  ): Promise<{ exists: boolean; mongoId?: string; reason?: string }> {
    // بررسی با wpId (اگر قبلاً منتقل شده)
    const byWpId = await postCommentCtrl.findOne({
      filters: { 'metadata.wpId': wpPostComment.wpId },
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
  private async transformWpPostComment(
    wpPostComment: WpPostComment
  ): Promise<Partial<PostComment | null>> {
    const postStatus = this.mapToAlbaPostCommentStatus(wpPostComment.status)
    const imageMigeration = new WPImageMigrationHelper()
    const HtmlToTiptapjsonConverter = new HtmlToTiptapConverter({
      defaultDir: 'rtl',
      logErrors: true,
      skipImages: false,
      imageMigrationHelper: imageMigeration,
    })
    let contentJson = {}
    let parentPostCOmmentId = null,
      post,
      author = null

    const linkReplacerConfig: LinkReplacerConfig = {
      newBaseUrl: this.newBaseUrl,
      oldDomains: [this.oldDomain],
    }
    contentJson = await HtmlToTiptapjsonConverter.convert(wpPostComment.content)
    if (contentJson.success && this.newBaseUrl != '') {
      contentJson = replaceLinksInDocument(
        contentJson.document,
        linkReplacerConfig
      )
    }
    // console.log('# html constnet before conver: ', contentJson)
    contentJson = sanitizeTipTapContent(contentJson?.document ?? contentJson)
    // console.log('# contentJson before conver: ', contentJson)

    // set relatred post
    if (wpPostComment?.post_wpId) {
      post = await postCtrl.findOne({
        filters: { 'metadata.wpId': wpPostComment.post_wpId },
      })
    }

    // set parent post comment
    if (wpPostComment?.parent_wpId) {
      const parentPostCOmment = await postCommentCtrl.findOne({
        filters: { 'metadata.wpId': wpPostComment.parent_wpId },
      })
      if (parentPostCOmment) parentPostCOmmentId = parentPostCOmment?.id || null
    }

    console.log('#234876 wpPostComment?.user_wpId:', wpPostComment?.user_wpId)

    // set author
    if (wpPostComment?.user_wpId) {
      const userResult = await userCtrl.findOne({
        filters: { 'metadata.wpId': wpPostComment?.user_wpId },
      })
      if (userResult) author = userResult
    }

    const excerpt = extractExcerptFromContentJson(
      JSON.stringify(contentJson),
      50
    )

    const translations = [
      {
        lang: 'fa', // "fa", "en", "de", ...
        excerpt: excerpt || '',
        contentJson: JSON.stringify(contentJson) || {},
      },
    ]

    if (!post) return null

    return {
      lang: this.locale,
      post: post?.id,
      parent: parentPostCOmmentId,
      user: null,
      author: author?.id,
      authorName: author ? author?.name : wpPostComment?.author_name,
      slug: decodeURI(wpPostComment?.slug),
      locale: this.locale,
      translations,
      status: postStatus,
      metadata: { wpId: wpPostComment.wpId }, // ذخیره ID اصلی برای مراجعات بعدی
      createdAt: new Date(wpPostComment.date),
      updatedAt: new Date(),
    }
  }

  /**
   * مهاجرت یک دیدگاه
   */
  private async migrateOnePostComment(
    wpPostComment: WpPostComment
  ): Promise<MigrationResult> {
    //   const metadata = this.buildMetadata(wpPostComment)
    const metadata = wpPostComment
    let newPostComment
    try {
      // بررسی وجود قبلی
      if (this.options.skipExisting) {
        const existing = await this.checkExisting(wpPostComment)
        if (existing.exists) {
          await this.logService.logSkipped(
            wpPostComment.wpId,
            existing.reason || 'already exists',
            wpPostComment
          )
          return {
            wpId: wpPostComment.wpId,
            status: 'skipped',
            mongoId: existing.mongoId,
            skippedReason: existing.reason,
          }
        }
      }

      // Dry Run - فقط لاگ کن
      if (this.options.dryRun) {
        this.logger(`[DRY RUN] Would migrate: ${wpPostComment.wpId}`)
        return {
          wpId: wpPostComment.wpId,
          status: 'success',
          mongoId: 'dry-run-id',
        }
      }

      // تبدیل و ذخیره
      const postPayload = await this.transformWpPostComment(wpPostComment)
      console.log('#2340789 post comment transformed:', postPayload)
      if (!postPayload) {
        return {
          wpId: wpPostComment.wpId,
          status: 'failed',
          error: '#32476 Bad content',
        }
      }
      newPostComment = await postCommentCtrl.create({
        params: { ...postPayload, locale: 'fa' },
      })

      const mongoId = newPostComment.id.toString()
      await this.logService.logSuccess(wpPostComment.wpId, mongoId, metadata)

      this.logger(`✓ Migrated: ${newPostComment.slug} -> ${mongoId}`)

      return {
        wpId: wpPostComment.wpId,
        status: 'success',
        mongoId,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      await this.logService.logFailure(
        wpPostComment?.wpId,
        errorMessage,
        metadata
      )

      this.logger(`✗ Failed: ${wpPostComment.wpId} - ${errorMessage}`)

      return {
        wpId: wpPostComment.wpId,
        status: 'failed',
        error: errorMessage,
      }
    }
  }
}
