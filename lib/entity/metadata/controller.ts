import {
  Create,
  QueryFind,
  QueryFindOne,
  QueryResponse,
  Update,
} from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import metadataSchema from './schema'
import metadataService from './service'
import { MetadataScope } from './interface'

export default class metadataController extends baseController {
  private scope: MetadataScope

  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the metadataController class extended of the main parent class baseController.
   *
   * @param service - metadataService
   * @param scope - MetadataScope
   * @beta
   */
  constructor(scope: MetadataScope) {
    super(new metadataService(metadataSchema))
    this.scope = scope
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') {
      return { scope: this.scope }
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
    return { ...filters, scope: this.scope }
  }

  makeCleanDataBeforeSave(data: any) {
    data.scope = this.scope
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
      filters: { key: payload.params.key, scope: this.scope },
    })
    if (existing) {
      throw new Error('key تکراری است!')
    }
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    payload.params = this.makeCleanDataBeforeSave(payload.params)
    payload.filters = this.standardizationFilters(payload.filters)
    return super.findOneAndUpdate(payload)
  }

  async metadataExist(key: string, locale: string = 'fa'): Promise<boolean> {
    const count = await this.countAll({
      key,
      scope: this.scope,
    })
    if (count == 0) return false
    return true
  }
}
