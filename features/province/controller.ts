import { Create, Id, Update } from '@/lib/entity/core/interface';
import coreController from '@/lib/entity/core/controller';
import Schema from './schema';
import Service from './service';
import { Province } from './interface';

class controller extends coreController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the Controller class extended of the main parent class baseController.
   *
   * @param service - Service
   *Ctrl
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
    payload.params.parentId == 'null' ? '' : payload.params.parentId;
    return super.create(payload);
  }

  async findOneAndUpdate(payload: Update) {
    payload.params.parentId =
      payload.params.parentId == 'null' ? null : payload.params.parentId;

    console.log('payload:', payload);
    return super.findOneAndUpdate(payload);
  }

  async getProvincesAsOption() {
    try {
      const result = await super.findAll({ filters: { active: true } });
      const provincesAsOption = result.data.map((province: Province) => ({
        key: province.id,
        value: province.name,
      }));
      return provincesAsOption;
    } catch (error) {
      return { message: 'خطای پایگاه داده: ایجاد گزینه های استان ناموفق بود' };
    }
  }
}

const provinceCtrl = new controller(new Service(Schema));
export default provinceCtrl;
