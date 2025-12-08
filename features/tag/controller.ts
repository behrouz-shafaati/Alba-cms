import taxonomyController from '@/lib/entity/taxonomy/controller'
import { TaxonomyType } from '@/lib/entity/taxonomy/interface'

class controller extends taxonomyController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the tagController class extended of the main parent class baseController.
   *
   * @param service - tagService
   *tagCtrl
   * @beta
   */
  constructor(type: TaxonomyType) {
    super(type)
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {}
    // console.log('# in standardizationFilters of tags:')
    for (const [key, value] of Object.entries(filters)) {
      // console.log({ key, value })
      if (typeof value != 'string') continue
      if (
        key == 'userName' ||
        key == 'fullName' ||
        key == 'email' ||
        key == 'mobile'
      )
        filters[key] = { $regex: new RegExp(value, 'i') }
      if (key == 'title' && filters?.title != '') {
        filters.translations = {
          $elemMatch: {
            lang: filters.locale,
            title: { $regex: filters.title, $options: 'i' },
          },
        }
        delete filters.title
        delete filters.locale
      }
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

  async tagExist(title: string, locale: string = 'fa'): Promise<boolean> {
    return this.taxonomyExist(title, locale)
  }

  async ensureTagsExist(
    tags: { value: string; label: string }[],
    locale: string = 'fa'
  ): Promise<string[]> {
    return this.ensureTaxonomyExist(tags, locale)
  }
}

const tagCtrl = new controller('tag')
export default tagCtrl
