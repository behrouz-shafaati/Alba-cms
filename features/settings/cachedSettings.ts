import { unstable_cache } from 'next/cache'
import settingsCtrl from './controller'
import { Settings } from './interface'

const getCachedSettings = unstable_cache(
  async (): Promise<Settings> => {
    const settingsFromDB = await settingsCtrl.findAll({})
    return Object.fromEntries(settingsFromDB.data.map((s) => [s.key, s.value]))
  },
  ['site-settings'],
  {
    revalidate: 3600,
    tags: ['site-settings'],
  }
)

export default getCachedSettings
