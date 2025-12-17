/**
 * Server Actions برای مهاجرت دیدگاه
 * src/lib/migration/actions/taxonomy-migration-actions.ts
 */

'use server'

import { createUserMigration } from '../users/migrate-users'
import {
  MigrationStats,
  MigrationRunResult,
  MigrationOptions,
  WpMigrationLog,
} from '../interface'
import wpEmigrationCtrl from '../controller'
import { State } from '@/types'
import { HtmlToTiptapConverter } from '@/lib/html-to-tiptap/HtmlToTiptapConverter'
import { WPImageMigrationHelper } from '@/lib/html-to-tiptap/helpers/ImageMigrationHelper'
import PostCommentMigration from './post-comment-migration'

// ========================
// تایپ‌های Response
// ========================

interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

interface TestConnectionResult {
  connected: boolean
  message: string
  userCount?: number
}

interface LogsResult {
  logs: WpMigrationLog[]
  total: number
  page: number
  totalPages: number
}

// ========================
// شروع مهاجرت
// ========================

export async function startPostCommentMigration(
  prevState: State,
  formData: FormData,
  options?: Partial<MigrationOptions>
): Promise<ActionResponse<MigrationRunResult>> {
  const values: { baseUrl: string; apiKey: string; newBaseUrl: string } =
    Object.fromEntries(formData)
  try {
    const migration = new PostCommentMigration(values, {
      newBaseUrl: values.newDomain,
      verbose: true,
      ...options,
    })

    const result = await migration.startMigration()

    return {
      success: true,
      data: result,
      values,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'خطای ناشناخته',
      values,
    }
  }
}

// ========================
// Dry Run (تست بدون ذخیره)
// ========================

export async function dryRunUserMigration(
  options?: Partial<MigrationOptions>
): Promise<ActionResponse<MigrationRunResult>> {
  try {
    const migration = createUserMigration({
      verbose: true,
      dryRun: true,
      ...options,
    })

    const result = await migration.startMigration()

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'خطای ناشناخته',
    }
  }
}

// ========================
// Retry موارد Failed
// ========================

export async function retryFailedUsers(
  options?: Partial<MigrationOptions>
): Promise<ActionResponse<MigrationRunResult>> {
  try {
    const migration = createUserMigration({
      verbose: true,
      ...options,
    })

    const result = await migration.retryFailed()

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'خطای ناشناخته',
    }
  }
}

// ========================
// دریافت آمار
// ========================

export async function getUserMigrationStats(): Promise<
  ActionResponse<MigrationStats>
> {
  try {
    const stats = await wpEmigrationCtrl.getStats()

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'خطای ناشناخته',
    }
  }
}

// ========================
// دریافت لاگ‌ها
// ========================

export async function getMigrationLogs(options: {
  status?: 'pending' | 'success' | 'failed' | 'skipped'
  search?: string
  page?: number
  limit?: number
}): Promise<ActionResponse<LogsResult>> {
  try {
    const result = await wpEmigrationCtrl.searchLogs(options)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'خطای ناشناخته',
    }
  }
}

// ========================
// ریست موارد Failed به Pending
// ========================

export async function resetFailedToPending(): Promise<
  ActionResponse<{ count: number }>
> {
  try {
    const count = await wpEmigrationCtrl.resetFailed()

    return {
      success: true,
      data: { count },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'خطای ناشناخته',
    }
  }
}

// ========================
// ریست یک رکورد خاص
// ========================

export async function resetUserMigration(
  wpId: number
): Promise<ActionResponse<{ reset: boolean }>> {
  try {
    const reset = await wpEmigrationCtrl.resetToPending(wpId)

    return {
      success: true,
      data: { reset },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'خطای ناشناخته',
    }
  }
}

// ========================
// پاک کردن همه لاگ‌ها (خطرناک!)
// ========================

export async function clearAllMigrationLogs(): Promise<
  ActionResponse<{ deleted: number }>
> {
  try {
    const deleted = await wpEmigrationCtrl.clearAll()

    return {
      success: true,
      data: { deleted },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'خطای ناشناخته',
    }
  }
}

export async function startConvertHtymlToJson(
  htmlContent: string
): Promise<ActionResponse<{ jsonContent: string }>> {
  const imageMigeration = new WPImageMigrationHelper()
  const converter = new HtmlToTiptapConverter({
    defaultDir: 'rtl',
    logErrors: true,
    skipImages: false,
    imageMigrationHelper: imageMigeration,
  })

  try {
    const result = await converter.convert(htmlContent)
    if (result.success) {
      return {
        success: true,
        data: { jsonContent: JSON.stringify(result.document) },
      }
    } else {
      return {
        success: false,
        message: 'Conversion failed',
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'خطای ناشناخته',
    }
  }
}
