/**
 * Server Actions برای مهاجرت کاربران
 * src/lib/migration/actions/user-migration-actions.ts
 */

'use server'

import { createUserMigration } from '../users/migrate-users'
import { createWPClient } from '../wp-client'
import {
  MigrationStats,
  MigrationRunResult,
  MigrationOptions,
  WpMigrationLog,
} from '../interface'
import wpEmigrationCtrl from '../controller'
import { State } from '@/types'

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
// تست اتصال
// ========================

export async function testWPConnectionAction(
  prevState: State,
  formData: FormData
): Promise<ActionResponse<TestConnectionResult>> {
  const values = Object.fromEntries(formData)
  try {
    const client = createWPClient(values)
    const result = await client.testConnection()

    return {
      success: true,
      data: {
        connected: result.success,
        message: result.message,
        userCount: result.userCount,
      },
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
// شروع مهاجرت
// ========================

export async function startUserMigration(
  prevState: State,
  formData: FormData,
  options?: Partial<MigrationOptions>
): Promise<ActionResponse<MigrationRunResult>> {
  const values: { baseUrl: string; apiKey: string } =
    Object.fromEntries(formData)
  try {
    const migration = createUserMigration(values, {
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
