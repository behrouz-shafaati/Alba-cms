import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import pageSchema from './schema'
import pageService from './service'
import settingsCtrl, { getSettings } from '../settings/controller'
import { Page } from './interface'
import categoryCtrl from '../category/controller'
import { getTranslation } from '@/lib/utils'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the pageController class extended of the main parent class baseController.
   *
   * @param service - pageService
   *pageCtrl
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

          // سرچ روی translations.content
          {
            'translations.content': {
              $regex: filters.query,
              $options: 'i',
            },
          },
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

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters)
    const result = await super.find(payload)
    return result
  }

  async create(payload: Create) {
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    return super.findOneAndUpdate(payload)
  }

  async getHomePage(): Promise<Page | null> {
    const siteSettings = await getSettings()
    const pageTranslation = getTranslation({
      translations: siteSettings?.pageTranslations || [],
    })
    if (pageTranslation?.homePageId == null) return null
    const homePage = await this.findById({ id: pageTranslation.homePageId.id })
    return homePage
  }
  async getTermsPage() {
    const siteSettings = await getSettings()
    const pageTranslation = getTranslation({
      translations: siteSettings?.pageTranslations || [],
    })
    if (pageTranslation?.termsPageId == null) return null
    const homePage = await this.findById({ id: pageTranslation.termsPageId })
    return homePage
  }
  async getPrivacyPage() {
    const siteSettings = await getSettings()
    const pageTranslation = getTranslation({
      translations: siteSettings?.pageTranslations || [],
    })
    if (pageTranslation?.privacyPageId == null) return null
    const homePage = await this.findById({ id: pageTranslation.privacyPageId })
    return homePage
  }

  async existSlug(slug: string): Promise<boolean> {
    const count = await this.countAll({ slug })
    console.log('#7d736 page count: ', count)
    if (count > 0) return true
    return false
  }

  async getAllSlugs(): Promise<{ slug: string }[]> {
    const result = await this.findAll({})
    return result.data.map((page: Page) => ({ slug: `/${page.slug}` }))
  }

  async generateStaticParams() {
    const pageSlugs = await this.getAllSlugs() // فرض کن فقط slug برمی‌گردونه
    return [...pageSlugs]
  }
}

const pageCtrl = new controller(new pageService(pageSchema))
export default pageCtrl
