import {
  Create,
  QueryFind,
  QueryFindOne,
  QueryResponse,
  Update,
} from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import taxonomySchema from './schema'
import taxonomyService from './service'
import { slugify } from '@/lib/utils'
import { Taxonomy, TaxonomyType, WpTaxonomyType } from './interface'
import { buildTaxonomyHref } from './utils'

export default class taxonomyController extends baseController {
  private type: TaxonomyType

  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the taxonomyController class extended of the main parent class baseController.
   *
   * @param service - taxonomyService
   * @param type - TaxonomyType
   * @beta
   */
  constructor(type: TaxonomyType) {
    super(new taxonomyService(taxonomySchema))
    this.type = type
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') {
      return { type: this.type }
    }
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
    return { ...filters, type: this.type }
  }

  makeCleanDataBeforeSave(data: any) {
    data.type = this.type
    data.parent = data?.parent == '' ? null : data?.parent
    data.parent = data?.parent == 'null' ? null : data?.parent
    data.parent = data?.parent == data?.id ? null : data?.parent

    data.image = data?.image == '' ? null : data?.image
    return data
  }

  async findOne(payload: QueryFindOne) {
    payload.filters = this.standardizationFilters(payload.filters)

    return super.findOne(payload)
  }

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters)

    const result = await super.find(payload)
    return result
  }

  async findAll(payload: QueryFind): Promise<QueryResponse<any>> {
    return super.findAll({
      ...payload,
      filters: this.standardizationFilters(payload.filters),
    })
  }

  async create(payload: Create) {
    payload.params = this.makeCleanDataBeforeSave(payload.params)
    const existing = await this.findOne({
      filters: { slug: payload.params.slug, type: this.type },
    })
    if (existing) {
      throw new Error('نامک تکراری است!')
    }
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    payload.params = this.makeCleanDataBeforeSave(payload.params)
    payload.filters = this.standardizationFilters(payload.filters)

    // Preventing the risk of circular reference
    payload.params.parent =
      payload.params.parent == payload.filters ? null : payload.params.parent
    return super.findOneAndUpdate(payload)
  }

  async taxonomyExist(title: string, locale: string = 'fa'): Promise<boolean> {
    const count = await this.countAll({
      translations: { $elemMatch: { lang: locale, title } },
      type: this.type,
    })
    if (count == 0) return false
    return true
  }

  async ensureTaxonomyExist(
    taxonomies: { value: string; label: string }[],
    locale: string = 'fa'
  ): Promise<string[]> {
    const taxonomyIds = []
    for (let i = 0; i < taxonomies.length; i++) {
      const taxonomy = taxonomies[i]
      const flgtaxonomyExist = await this.taxonomyExist(taxonomy.label)
      if (flgtaxonomyExist) taxonomyIds.push(taxonomy.value)
      else {
        const slug = slugify(taxonomy.label)
        const newTaxonomy = await this.create({
          params: {
            translations: { lang: locale, title: taxonomy.label },
            slug,
            type: this.type,
          },
        })
        taxonomyIds.push(newTaxonomy.id)
      }
    }
    return taxonomyIds
  }

  async generateStaticParams() {
    const taxonomiesHomeSlugs = await this.getAllSlugs() // فرض کن فقط slug برمی‌گردونه
    console.log('#32476 taxonomiesHomeSlugs:', taxonomiesHomeSlugs)
    return taxonomiesHomeSlugs
  }

  async getAllSlugs() {
    const result = await this.findAll({ filters: { type: this.type } })
    return result.data.map((taxonomy: Taxonomy) => ({
      slugs: buildTaxonomyHref(taxonomy, '').replace(/^\/+/g, '').split('/'),
    }))
  }
}
