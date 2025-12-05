import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import settingsSchema from './schema'
import settingsService from './service'
import { Settings } from './interface'
import userCtrl from '../user/controller'
import postCtrl from '../post/controller'
import postCommentCtrl from '../post-comment/controller'
import { getTranslation } from '@/lib/utils'
import SiteSettingsSingleton from './settingsSingleton'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the settingsController class extended of the main parent class baseController.
   *
   * @param service - settingsService
   *settingsCtrl
   * @beta
   */
  constructor(service: any) {
    super(service)
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {}
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value != 'string') continue
      if (
        key == 'userName' ||
        key == 'fullName' ||
        key == 'email' ||
        key == 'mobile'
      )
        filters[key] = { $regex: new RegExp(value, 'i') }
      if (key == 'query' && filters?.query == '') {
        delete filters.query
      } else if (key == 'query') {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ['$title', '$content'],
            },
            regex: filters.query,
            options: 'i',
          },
        }
        delete filters.query
      }

      if (key == 'id') {
        filters._id = value
        delete filters.id
      }
    }
    return filters
  }

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters)
    const result = await super.find(payload)
    return result
  }

  async create(payload: Create) {
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    const r = await super.findOneAndUpdate(payload)
    SiteSettingsSingleton.updateInstance()
  }
}

const settingsCtrl = new controller(new settingsService(settingsSchema))
export default settingsCtrl

type Key = 'site_title' | ''

/**
 * Fetch site settings and return either the full settings object
 * or a specific value by key.
 *
 * @param {string} [key=''] - The key of the setting to retrieve.
 * If omitted or empty, the full settings object is returned.
 * @returns {Promise<Record<string, unknown> | unknown | null>}
 * - If no key is provided, returns the full settings object.
 * - If a key is provided, returns the value for that key or null if not found.
 */
export const getSettings = async (
  key: Key = ''
): Promise<Record<string, unknown> | unknown | null | Settings> => {
  const settings: Record<string, unknown> =
    await SiteSettingsSingleton.getInstance()

  if (!key) {
    return settings
  }

  const siteInfo = getTranslation({
    translations: settings?.infoTranslations || [],
  })
  const _settings = { ...settings, ...siteInfo }
  return Object.prototype.hasOwnProperty.call(_settings, key)
    ? _settings[key]
    : null
}

export const getStats = async () => {
  const totalUsers = await userCtrl.countAll()
  const totalPosts = await postCtrl.countAll()
  const pendingComments = await postCommentCtrl.countAll({
    status: 'pending',
  })
  const publishedWeek = await postCtrl.countThisWeek()
  return {
    totalUsers,
    totalPosts,
    pendingComments,
    publishedWeek,
  }
}
