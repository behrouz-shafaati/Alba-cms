import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import campaignSchema from './schema'
import campaignMetricService from './service'
import { toUtcMidnight } from '@/lib/utils'
import campaignCtrl from '../campaign/controller'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the campaignController class extended of the main parent class baseController.
   *
   * @param service - campaignService
   *campaignCtrl
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
        filters.$or = [
          // سرچ روی slug
          { slug: { $regex: filters.query, $options: 'i' } },

          // سرچ روی translations.title
          { 'translations.title': { $regex: filters.query, $options: 'i' } },

          // سرچ روی translations.description
          {
            'translations.description': {
              $regex: filters.query,
              $options: 'i',
            },
          },
        ]

        delete filters.query
      }

      if (key == 'id') {
        filters._id = value
        delete filters.id
      }
    }
    return filters
  }

  makeCleanDataBeforeSave(data: any) {
    return data
  }

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters)
    const result = await super.find(payload)
    return result
  }

  async create(payload: Create) {
    payload.params = this.makeCleanDataBeforeSave(payload.params)
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    payload.params = this.makeCleanDataBeforeSave(payload.params)
    return super.findOneAndUpdate(payload)
  }

  /**
   * addImpression
   * - increments campaign.total.impressions
   * - increments/creates CampaignMetric for UTC date (upsert)
   * - respects lazy policy: does NOT auto-change campaign.status; however
   *   it will NOT record impressions if the campaign is already ended or not active.
   *   (You chose lazy: getOnly; we still prevent recording for ended campaigns.)
   *
   * Returns: { ok: true } or { ok: false, reason: '...' }
   */
  async addImpression({
    campaignId,
    locale,
    slotId,
  }: {
    campaignId: string
    slotId: string
    locale: 'fa'
  }) {
    const campaign = await campaignCtrl.findById({ id: campaignId })
    if (!campaign) return { ok: false, reason: 'not_found' }

    // do not auto-update status here (lazy: getOnly), but prevent recording if ended
    const now = new Date()
    if (campaign.status === 'ended' || now > campaign.endAt) {
      return { ok: false, reason: 'campaign_ended' }
    }

    // Atomic update of campaign totals and metric upsert
    // 1) increment total impressions
    await campaignCtrl.findOneAndUpdate({
      filters: { id: campaignId },
      params: { $inc: { 'total.impressions': 1 } },
    })

    // 2) increment daily metric (UTC midnight)
    await this.create({
      params: { campaignId, type: 'impression', slotId, locale },
    })

    return { ok: true }
  }

  /**
   * addClick - same as addImpression but increments clicks
   */
  async addClick({
    campaignId,
    slotId,
    locale,
  }: {
    campaignId: string
    slotId: string
    locale: 'fa'
  }) {
    const campaign = await campaignCtrl.findById({ id: campaignId })
    if (!campaign) return { ok: false, reason: 'not_found' }

    const now = new Date()
    if (campaign.status === 'ended' || now > campaign.endAt) {
      return { ok: false, reason: 'campaign_ended' }
    }

    await campaignCtrl.findOneAndUpdate({
      filters: { id: campaignId },
      params: { $inc: { 'total.clicks': 1 } },
    })
    await this.create({
      params: { campaignId, slotId, type: 'click', locale },
    })

    return { ok: true }
  }
}

const campaignMetricCtrl = new controller(
  new campaignMetricService(campaignSchema)
)
export default campaignMetricCtrl
