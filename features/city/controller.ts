import { Create, Update } from '@/lib/entity/core/interface';
import baseController from '@/lib/entity/core/controller';
import citySchema from './schema';
import cityService from './service';
import countryCtrl from '../country/controller';
import { City } from './interface';

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the cityController class extended of the main parent class baseController.
   *
   * @param service - cityService
   *cityCtrl
   * @beta
   */
  constructor(service: any) {
    super(service);
    countryCtrl;
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {};
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value != 'string') continue;

      // for string values
      if (key == 'name') filters[key] = { $regex: new RegExp(value, 'i') };

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
        };
        delete filters.query;
      }

      if (key == 'orderBy' && value == 'name') {
        filters.orderBy = 'name';
      }
    }
    return filters;
  }

  async create(payload: Create) {
    return super.create(payload);
  }

  async findOneAndUpdate(payload: Update) {
    return super.findOneAndUpdate(payload);
  }

  async getCitiesAsOption(provinceId: string) {
    if (!provinceId || provinceId == '') return [];
    const result = await super.findAll({
      filters: { provinceId: provinceId },
    });
    const citiesAsOprion = result?.data
      ? result.data.map((city: City) => ({
          key: city.id,
          value: city.name,
        }))
      : [];
    return citiesAsOprion;
  }
}

const cityCtrl = new controller(new cityService(citySchema));
export default cityCtrl;
