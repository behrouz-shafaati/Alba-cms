import { WPClient } from '../wp-client'
import { MigrationOptions, WPClientConfig } from '../interface'
import { GetPostCommentIdsResponse } from './types'

// تنظیمات پیش‌فرض
const DEFAULT_OPTIONS: MigrationOptions = {
  batchSize: 100,
  concurrency: 5,
  dryRun: false,
  verbose: false,
  maxRetries: 3,
  skipExisting: true,
}

export class WPPostCommentClient extends WPClient {
  constructor(config: WPClientConfig) {
    console.log('#2394876 config in wp post_comments client:', config)
    super(config)
  }

  async getPostCommentCount() {
    return this.get(`/post_comments/count`)
  }

  async getPostCommentIds(): Promise<GetPostCommentIdsResponse> {
    const result = await this.get<GetPostCommentIdsResponse>(
      `/post_comments/ids`
    )
    return result
  }

  async getPostCommentById(id: number) {
    return this.get(`/post_comments/${id}`)
  }

  async getPostCommentsBatch(ids: number[]) {
    return this.getBatch(ids, 'post_comments')
  }
}

export function createWPPostCommentClient({
  baseUrl,
  apiKey,
  timeout = 30000,
  retryAttempts = 3,
}: {
  baseUrl?: string
  apiKey?: string
  timeout?: number
  retryAttempts?: number
} = {}): WPPostCommentClient {
  if (!baseUrl || !apiKey) {
    throw new Error('WP_API_BASE_URL و WP_API_KEY باید  تنظیم شوند')
  }

  return new WPPostCommentClient({
    baseUrl,
    apiKey,
    timeout: timeout,
    retryAttempts: retryAttempts,
  })
}
