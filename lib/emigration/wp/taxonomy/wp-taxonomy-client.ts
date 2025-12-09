import { WPClient } from '../wp-client'
import { MigrationOptions, WPClientConfig } from '../interface'

// تنظیمات پیش‌فرض
const DEFAULT_OPTIONS: MigrationOptions = {
  batchSize: 100,
  concurrency: 5,
  dryRun: false,
  verbose: false,
  maxRetries: 3,
  skipExisting: true,
}

export class WPTaxonomyClient extends WPClient {
  constructor(config: WPClientConfig) {
    super(config)
  }

  async getTaxonomyCount() {
    return this.get(`/taxonomies/count`)
  }

  async getTaxonomyIds(): Promise<number[]> {
    const result = await this.get<{ ids: number[] }>(`/taxonomies/ids`)
    return result.ids
  }

  async getTaxonomyById(id: number) {
    return this.get(`/taxonomies/${id}`)
  }

  async getTaxonomiesBatch(ids: number[]) {
    return this.getBatch(ids, 'taxonomies')
  }

  async getHierarchy(tax: string) {
    return this.get(`/taxonomies/hierarchy?taxonomy=${tax}`)
  }
}

export function createWPTaxonomyClient({
  baseUrl,
  apiKey,
  timeout = 30000,
  retryAttempts = 3,
}: {
  baseUrl?: string
  apiKey?: string
  timeout?: number
  retryAttempts?: number
} = {}): WPTaxonomyClient {
  if (!baseUrl || !apiKey) {
    throw new Error('WP_API_BASE_URL و WP_API_KEY باید  تنظیم شوند')
  }

  return new WPTaxonomyClient({
    baseUrl,
    apiKey,
    timeout: timeout,
    retryAttempts: retryAttempts,
  })
}
