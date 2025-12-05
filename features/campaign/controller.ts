import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import campaignSchema from './schema'
import campaignService from './service'
import {
  Banner,
  Campaign,
  DetectCampaignProps,
  FallbackBehaviorType,
  getBannerProps,
} from './interface'
import postCtrl from '../post/controller'
import { File } from '@/lib/entity/file/interface'
import { getTranslation } from '@/lib/utils'
import { Post } from '../post/interface'
import campaignMetricCtrl from '../campaign-metric/controller'
import { getSettings } from '../settings/controller'

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

    // Preventing the risk of circular reference
    payload.params.parent =
      payload.params.parent == payload.filters ? null : payload.params.parent
    return super.findOneAndUpdate(payload)
  }

  async detectCampaigns({
    goalSection,
    placement,
    sendedAlready,
    linkedCampaign,
  }: DetectCampaignProps) {
    const now = new Date()
    let campaign: Campaign | null = null

    // اگر کمپین برای اسللات مشخص شده است همان را نمایش بده
    if (linkedCampaign && linkedCampaign != 'none') {
      const campaignResult = await this.find({
        filters: {
          _id: linkedCampaign,
          status: { $in: ['scheduled', 'active'] },
          $or: [
            // حالت ۱: کمپین‌هایی که تاریخ معتبر دارن و الان داخل بازه‌ن
            {
              startAt: { $lte: now },
              endAt: { $gte: now },
            },
            // حالت ۲: کمپین‌هایی که تاریخ ندارن (یعنی هر دو null هستن)
            {
              startAt: null,
              endAt: null,
            },
          ],
        },
      })
      if (campaignResult?.data) return campaignResult.data
      return null
    }
    switch (goalSection) {
      case 'allPages':
        break
      default:
        campaign = await this.getCategoryCampaign({
          goalSection,
          placement,
          sendedAlready,
        })
        if (campaign) return campaign
    }
    // در غیر این صورت کمپین عمومی سایت را برگردان == case 'allPages'
    const [allCampainResult] = await Promise.all([
      this.find({
        filters: {
          _id: { $nin: sendedAlready },
          'goalSections.value': { $in: [`allPages`] },
          status: { $in: ['scheduled', 'active'] },
          $or: [
            // حالت ۱: کمپین‌هایی که تاریخ معتبر دارن و الان داخل بازه‌ن
            {
              startAt: { $lte: now },
              endAt: { $gte: now },
            },
            // حالت ۲: کمپین‌هایی که تاریخ ندارن (یعنی هر دو null هستن)
            {
              startAt: null,
              endAt: null,
            },
          ],
        },
      }),
    ])
    if (campaign != null) return campaign
    if (allCampainResult?.data != undefined) return allCampainResult.data
    return null
  }

  async getCategoryCampaign({
    goalSection: categoryId,
    placement = null,
    sendedAlready,
  }: DetectCampaignProps): Promise<any> {
    if (!categoryId) return null
    const now = new Date()
    const [categoryCampaignResult] = await Promise.all([
      this.find({
        filters: {
          _id: { $nin: sendedAlready },
          'goalSections.value': { $in: [`category-${categoryId}`] },
          status: { $in: ['scheduled', 'active'] },
          ...(placement ? { placement } : {}),
          $or: [
            // حالت ۱: کمپین‌هایی که تاریخ معتبر دارن و الان داخل بازه‌ن
            {
              startAt: { $lte: now },
              endAt: { $gte: now },
            },
            // حالت ۲: کمپین‌هایی که تاریخ ندارن (یعنی هر دو null هستن)
            {
              startAt: null,
              endAt: null,
            },
          ],
        },
      }),
    ])
    if (categoryCampaignResult?.data?.length)
      return categoryCampaignResult.data[0]
    return null
  }

  findMachedAspectBanner({
    banners,
    aspect,
  }: {
    banners: Banner[]
    aspect: string
  }): File | null {
    // find mached aspect
    const bannerItem = banners.find((b: Banner) => b.aspect === aspect)
    // اگر پیدا شد فایلش رو برگردون، در غیر این صورت null
    return bannerItem?.file ?? null
  }

  async getRandomBanner({
    aspect,
    locale,
  }: {
    aspect: string
    locale: 'fa'
  }): Promise<{ campaign: Campaign | null; bannerFile: File | null }> {
    // ۱. کمپین‌های فعال و معتبر را بگیر
    const now = new Date()
    const campaigns = await campaignCtrl.find({
      filters: {
        status: { $in: ['scheduled', 'active'] },
        $or: [
          { startAt: { $lte: now }, endAt: { $gte: now } },
          { startAt: null, endAt: null },
        ],
        translations: {
          $elemMatch: {
            banners: {
              $elemMatch: {
                aspect,
                file: { $ne: null },
              },
            },
          },
        },
      },
    })
    if (!campaigns || campaigns.data.length === 0)
      return { campaign: null, bannerFile: null }

    // ۲. انتخاب رندوم یک کمپین
    const randomIndex = Math.floor(Math.random() * campaigns.data.length)
    const randomCampaign = campaigns.data[randomIndex]

    // ۳. پیدا کردن ترجمه مورد نظر بر اساس locale
    const translation = randomCampaign.translations.find(
      (t) => t.lang === locale
    )
    if (!translation) return { campaign: null, bannerFile: null }

    // ۴. پیدا کردن بنر با aspect
    const bannerFile = this.findMachedAspectBanner({
      aspect,
      banners: translation.banners,
    })

    return { campaign: randomCampaign, bannerFile }
  }

  async getFallbackBanner({
    locale = 'fa',
    aspect,
    fallbackBehavior,
  }: {
    locale: 'fa'
    aspect: string
    fallbackBehavior: FallbackBehaviorType
  }): Promise<{ campaign: Campaign | null; bannerFile: File | null }> {
    const banners = []
    const siteSettings = await getSettings()
    if (fallbackBehavior == 'inherit') {
      fallbackBehavior = siteSettings?.ad?.fallbackBehavior || 'random'
    }

    switch (fallbackBehavior) {
      case 'hide':
        return { campaign: null, bannerFile: null }
      case 'default_banner':
        const translation = getTranslation({
          translations: siteSettings?.ad.translations,
          locale,
        })
        const bannerFile = this.findMachedAspectBanner({
          aspect,
          banners: translation.banners,
        })
        return {
          bannerFile,
          campaign: { targetUrl: siteSettings?.ad?.targetUrl || null },
        }
      default:
        //'random'
        return this.getRandomBanner({ aspect, locale })
    }
  }

  /**
   * دریافت بنرهای متناسب با جایگاه‌های تبلیغاتی مشخص‌شده برای یک پست
   *
   * این تابع با توجه به دسته‌بندی مطلب (mainCategory)، کمپین‌های فعال مرتبط را جستجو می‌کند
   * و برای هر جایگاه تبلیغاتی (adSlot) اولین کمپین دارای بنر مناسب را برمی‌گرداند.
   *
   * @async
   * @function getBanners
   * @param {Object} params - پارامترهای ورودی تابع
   * @param {string} params.originPostSlug - اسلاگ پست برای یافتن مطلب مبدا
   * @param {string[]} [params.sendedAlready=[]] - شناسه کمپین‌هایی که قبلاً ارسال شده‌اند تا تکراری نباشند
   * @param {Array<{id: string, placement: string, aspect: string}>} params.adSlots - لیست جایگاه‌های تبلیغاتی (slotها)
   * @param {string} [params.locale='fa'] - زبان ترجمه‌ی مورد نظر
   * @returns {Promise<{banners: {slotId: string, file: File|null}[], sendedAlready: string[]}>}
   * یک آبجکت شامل آرایه بنرها و لیست کمپین‌های ارسال‌شده
   */
  async getBanners({
    originPostSlug,
    sendedAlready = [],
    adSlots,
    locale = 'fa',
  }: getBannerProps) {
    const post: Post | null = await postCtrl.findOne({
      filters: { originPostSlug },
    })

    const banners: {
      slotId: string
      file: File | null
      targetUrl: string | null
      campaignId: string | null
    }[] = []
    /*
adSlots = {
  "6907444240428ecc324c5c940": { aspect: "4/1", placement: "all", linkedCampaign: null },
  "6907444f40428ecc324c5c950": { aspect: "4/1", placement: "all", linkedCampaign: null },
  "6907444f40428ecc324c5c951": { aspect: "4/1", placement: "all", linkedCampaign: null },
}*/

    for (const [slotId, slotData] of Object.entries(adSlots)) {
      const fallbackBehavior = slotData?.fallbackBehavior || 'random'
      const campaigns = await this.detectCampaigns({
        sendedAlready,
        goalSection: post ? post.mainCategory.id : 'allPages',
        placement: slotData.placement || 'all',
        linkedCampaign: slotData?.linkedCampaign || null,
      })

      let foundBanner = false

      // جستجوی اولین کمپینی که بنر مناسب دارد
      for (const campaign of campaigns || []) {
        const translation = getTranslation({
          translations: campaign.translations,
          locale,
        })

        // find mached aspect
        const file: File | null = this.findMachedAspectBanner({
          aspect: slotData.aspect,
          banners: translation?.banners,
        })

        if (file && campaign) {
          campaignMetricCtrl.addImpression({
            campaignId: campaign.id,
            locale: 'fa',
            slotId,
          })
          sendedAlready.push(campaign.id)
          banners.push({
            slotId,
            file,
            targetUrl: campaign?.targetUrl,
            campaignId: campaign.id,
          })
          foundBanner = true
          break
        }
      }

      // اگر بنر پیدا نشد
      if (!foundBanner) {
        const { campaign, bannerFile } = await this.getFallbackBanner({
          aspect: slotData.aspect,
          fallbackBehavior,
          locale,
        })
        if (bannerFile) {
          banners.push({
            slotId,
            file: bannerFile,
            //اگر از بنرهای پیش فرض استفاده کنیم این موارد نال خواهند بود. چون کمپینی وجود ندارد
            targetUrl: campaign ? campaign?.targetUrl : null,
            campaignId: campaign ? campaign.id : null,
          })
        } else
          banners.push({
            slotId,
            file: null,
            targetUrl: null,
            campaignId: null,
          })
      }
    }

    return { banners, sendedAlready }
  }
}

const campaignCtrl = new controller(new campaignService(campaignSchema))
export default campaignCtrl
