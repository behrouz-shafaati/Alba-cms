import { WPClient } from '../wp-client'
import { MigrationOptions, WPClientConfig } from '../interface'
import { GetPostIdsResponse } from './types'

// تنظیمات پیش‌فرض
const DEFAULT_OPTIONS: MigrationOptions = {
  batchSize: 100,
  concurrency: 5,
  dryRun: false,
  verbose: false,
  maxRetries: 3,
  skipExisting: true,
}

export class WPPostClient extends WPClient {
  constructor(config: WPClientConfig) {
    console.log('#2394876 config in wp post client:', config)
    super(config)
  }

  async getPostCount() {
    return this.get(`/posts/count`)
  }

  async getPostIds(): Promise<GetPostIdsResponse> {
    const result = await this.get<GetPostIdsResponse>(`/posts/ids`)
    return result
  }

  async getPostById(id: number) {
    return this.get(`/posts/${id}`)
  }

  async getPostsBatch(ids: number[]) {
    return this.getBatch(ids, 'posts')
  }
}

export function createWPPostClient({
  baseUrl,
  apiKey,
  timeout = 30000,
  retryAttempts = 3,
}: {
  baseUrl?: string
  apiKey?: string
  timeout?: number
  retryAttempts?: number
} = {}): WPPostClient {
  if (!baseUrl || !apiKey) {
    throw new Error('WP_API_BASE_URL و WP_API_KEY باید  تنظیم شوند')
  }

  return new WPPostClient({
    baseUrl,
    apiKey,
    timeout: timeout,
    retryAttempts: retryAttempts,
  })
}
