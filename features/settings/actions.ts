'use server'

import { getSettings } from '@/features/settings/controller'
import { unstable_cache } from 'next/cache'

export async function getSettingsAction(key: string = '') {
  const cacheKey = ['settings', key || 'all']

  try {
    return await unstable_cache(
      async () => {
        return getSettings(key)
      },
      cacheKey,
      {
        tags: ['settings'],
      }
    )()
  } catch (err) {
    // fallback امن: اگر cache fail شد
    console.warn(
      '[getSettingsAction] unstable_cache failed, fallback to direct call',
      err
    )
    return getSettings(key)
  }
}
