'use server'

import { getSettings } from '@/features/settings/controller'

export async function getSettingsAction(key: string = '') {
  return getSettings(key)
}
