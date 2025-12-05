import { Create, Id, Update } from '@/lib/entity/core/interface';
import baseController from '@/lib/entity/core/controller';
import countrySchema from './schema';
import countryService from './service';

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the countryController class extended of the main parent class baseController.
   *
   * @param service - countryService
   *countryCtrl
   * @beta
   */
  constructor(service: any) {
    super(service);
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
}

const countryCtrl = new controller(new countryService(countrySchema));
export default countryCtrl;
