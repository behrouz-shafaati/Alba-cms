import { Create, Id, Update } from '@/lib/entity/core/interface'
import coreController from '@/lib/entity/core/controller'
import shippingAddressSchema from './schema'
import shippingAddressService from './service'
import countryCtrl from '@/features/country/controller'
import provinceCtrl from '@/features/province/controller'
import cityCtrl from '@/features/city/controller'

class controller extends coreController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the shippingAddressController class extended of the main parent class baseController.
   *
   * @param service - shippingAddressService
   *shippingAddressCtrl
   * @beta
   */
  constructor(service: any) {
    countryCtrl
    provinceCtrl
    cityCtrl
    super(service)
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {}
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value != 'string') continue

      // for string values
      if (key == 'name') filters[key] = { $regex: new RegExp(value, 'i') }

      // for mix fields
      if (key == 'query') {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ['$firstName', '$email', '$lastName', '$mobile'],
            },
            regex: filters.query,
            options: 'i',
          },
        }
        delete filters.query
      }

      if (key == 'orderBy' && value == 'name') {
        filters.orderBy = 'name'
      }
    }
    return filters
  }

  async checkingAndStandardizingInputs(shippingAddress: any): Promise<any> {
    shippingAddress.isDefault = shippingAddress.isDefault == 'on' ? true : false

    if (shippingAddress.isDefault)
      await this.unCheckAllDefault(shippingAddress.userId)
    return shippingAddress
  }

  async unCheckAllDefault(userId: string) {
    await this.updateMany({
      filters: { userId },
      params: { isDefault: false },
    })
  }

  async create(payload: Create) {
    const params = await this.checkingAndStandardizingInputs(payload.params)
    return super.create({
      ...payload,
      params,
    })
  }

  async findOneAndUpdate(payload: Update) {
    const params = await this.checkingAndStandardizingInputs(payload.params)
    return super.findOneAndUpdate({
      ...payload,
      params,
    })
  }
}

const shippingAddressCtrl = new controller(
  new shippingAddressService(shippingAddressSchema)
)
export default shippingAddressCtrl
