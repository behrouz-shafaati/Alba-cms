import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import templatePartSchema from './schema'
import templatePartService from './service'
import settingsCtrl from '../settings/controller'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the templatePartController class extended of the main parent class baseController.
   *
   * @param service - templatePartService
   *templatePartCtrl
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
          // سرچ روی title
          { title: { $regex: filters.query, $options: 'i' } },
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

  async existSlug(slug: string): Promise<boolean> {
    const count = await this.countAll({ slug })
    console.log('#7d736 TemplatePart count: ', count)
    if (count > 0) return true
    return false
  }
}

const templatePartCtrl = new controller(
  new templatePartService(templatePartSchema)
)
export default templatePartCtrl
