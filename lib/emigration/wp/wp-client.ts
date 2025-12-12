/**
 * کلاینت ارتباط با API وردپرس
 * src/lib/migration/wp-client.ts
 */

import { decodeUnicodeMessage } from '@/lib/utils/decode-unicode'
import { WPClientConfig } from './interface'

export interface WPUser {
  wpId: number
  userName: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  mobile: string | null
  roles: string[]
  registeredAt: string
}

export class WPClient {
  private baseUrl: string
  private apiKey: string
  private timeout: number
  private retryAttempts: number
  private retryDelay: number

  constructor(config: WPClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '') // حذف / انتهایی
    this.apiKey = config.apiKey
    this.timeout = config.timeout || 30000
    this.retryAttempts = config.retryAttempts || 3
    this.retryDelay = config.retryDelay || 1000
  }

  /**
   * ساخت URL کامل endpoint
   */
  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number>
  ): string {
    const url = new URL(`${this.baseUrl}/wp-json/alba-migration/v1${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    return url.toString()
  }

  /**
   * ارسال درخواست با retry خودکار
   */
  private async request<T>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params)
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        console.log('[WPClient] Fetching:', url)

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Albacms-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })

        console.log('[WPClient] Status:', response.status)

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('[WPClient] Error:', decodeUnicodeMessage(errorText))
          throw new Error(
            `HTTP ${response.status}: ${decodeUnicodeMessage(errorText)}`
          )
        }

        const data = await response.json()
        console.log('[WPClient] Data received:', JSON.stringify(data))

        return data as T
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // اگر آخرین تلاش نیست، صبر کن و دوباره امتحان کن
        if (attempt < this.retryAttempts) {
          const delay = this.retryDelay * attempt // Exponential backoff ساده
          await this.sleep(delay)
        }
      }
    }

    throw lastError || new Error('Unknown error in WPClient')
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<T> {
    return this.request<T>(endpoint, params)
  }

  /**
   * تابع کمکی برای تاخیر
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * دریافت تعداد کل کاربران
   */
  async getUsersCount(): Promise<number> {
    const result = await this.request<{ totalUserCount: number }>(
      '/users/count'
    )
    return result.totalUserCount
  }

  /**
   * دریافت لیست همه ID های کاربران
   */
  async getAllUserIds(): Promise<number[]> {
    const result = await this.request<{ ids: number[] }>('/users/ids')
    return result.ids
  }

  /**
   * دریافت لیست کاربران با pagination
   */
  async getUsers(page: number = 1, perPage: number = 100): Promise<WPUser[]> {
    return this.request<WPUser[]>('/users', { page, per_page: perPage })
  }

  /**
   * دریافت یک کاربر خاص
   */
  async getUser(wpId: number): Promise<WPUser> {
    return this.request<WPUser>(`/users/${wpId}`)
  }

  /**
   * دریافت چند کاربر به صورت همزمان (با محدودیت concurrency)
   */
  async getUsersBatch(
    wpIds: number[],
    concurrency: number = 5,
    onProgress?: (completed: number, total: number) => void
  ): Promise<Map<number, WPUser | Error>> {
    const results = new Map<number, WPUser | Error>()
    let completed = 0

    // تقسیم به گروه‌های همزمان
    for (let i = 0; i < wpIds.length; i += concurrency) {
      const batch = wpIds.slice(i, i + concurrency)

      const batchResults = await Promise.allSettled(
        batch.map((id) => this.getUser(id))
      )

      batchResults.forEach((result, index) => {
        const wpId = batch[index]
        if (result.status === 'fulfilled') {
          results.set(wpId, result.value)
        } else {
          results.set(
            wpId,
            new Error(result.reason?.message || 'Unknown error')
          )
        }
        completed++
      })

      if (onProgress) {
        onProgress(completed, wpIds.length)
      }

      // Rate limiting - کمی صبر بین batch ها
      if (i + concurrency < wpIds.length) {
        await this.sleep(100)
      }
    }

    return results
  }
  /**
   * دریافت چند قخصس به صورت همزمان (با محدودیت concurrency)
   */
  async getBatch(
    wpIds: number[],
    baseUrl: 'users' | 'taxonomies' | 'posts',
    concurrency: number = 5,
    onProgress?: (completed: number, total: number) => void
  ): Promise<Map<number, any | Error>> {
    const results = new Map<number, any | Error>()
    let completed = 0

    // تقسیم به گروه‌های همزمان
    for (let i = 0; i < wpIds.length; i += concurrency) {
      const batch = wpIds.slice(i, i + concurrency)

      const batchResults = await Promise.allSettled(
        batch.map((id) => {
          console.log(`Fetching ${baseUrl} with ID:`, id)
          return this.request<any>(`/${baseUrl}/${id}`)
        })
      )

      batchResults.forEach((result, index) => {
        const wpId = batch[index]
        if (result.status === 'fulfilled') {
          results.set(wpId, result.value)
        } else {
          results.set(
            wpId,
            new Error(result.reason?.message || 'Unknown error')
          )
        }
        completed++
      })

      if (onProgress) {
        onProgress(completed, wpIds.length)
      }

      // Rate limiting - کمی صبر بین batch ها
      if (i + concurrency < wpIds.length) {
        await this.sleep(100)
      }
    }

    return results
  }

  /**
   * تست اتصال
   */
  async testConnection(): Promise<{
    success: boolean
    message: string
    userCount?: number
  }> {
    try {
      const userCount = await this.getUsersCount()
      console.log('WPClient testConnection user count wp response:', userCount)
      return {
        success: true,
        message: `اتصال برقرار شد. تعداد کاربران: ${userCount}`,
        userCount: userCount,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'خطای ناشناخته',
      }
    }
  }
}

// ✅ Factory function برای ساخت client از environment variables
export function createWPClient({
  baseUrl,
  apiKey,
  timeout = 30000,
  retryAttempts = 3,
}: {
  baseUrl?: string
  apiKey?: string
  timeout?: number
  retryAttempts?: number
} = {}): WPClient {
  if (!baseUrl || !apiKey) {
    throw new Error('WP_API_BASE_URL و WP_API_KEY باید  تنظیم شوند')
  }

  return new WPClient({
    baseUrl,
    apiKey,
    timeout: timeout,
    retryAttempts: retryAttempts,
  })
}
