import settingsCtrl from './controller'
import { Settings } from './interface'

class SiteSettingsSingleton {
  private static instance: Settings | null = null

  static async getInstance() {
    if (SiteSettingsSingleton.instance) return SiteSettingsSingleton.instance

    const settingsFromDB = await settingsCtrl.find({
      filters: { type: 'site-settings' },
    })
    SiteSettingsSingleton.instance = settingsFromDB?.data[0] ?? {}
    return SiteSettingsSingleton.instance
  }

  /**
   * Update the cached instance with new data
   * @param newSettings Optional new settings to set.
   *                    If not provided, fetch from DB
   */
  static async updateInstance() {
    // fetch from DB
    const settingsFromDB = await settingsCtrl.find({
      filters: { type: 'site-settings' },
    })
    SiteSettingsSingleton.instance = settingsFromDB.data[0] ?? {}

    return SiteSettingsSingleton.instance
  }
}

export default SiteSettingsSingleton
