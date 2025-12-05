import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import tagSchema from './schema'
import tagService from './service'
import { slugify } from '@/lib/utils'

class controller extends baseController {
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
  constructor(service: any) {
    super(service)
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
        /**
         * توضیح

          $map → برای هر آیتم در translations، title و description رو به هم می‌چسبونه.

          $reduce → همه‌ی اونها رو به یک رشته تبدیل می‌کنه.

          $concat → در نهایت با slug هم اضافه میشه که قابل سرچ باشه.

          $regexMatch → روی اون رشته‌ی نهایی سرچ انجام میشه.
         */
        // filters.$expr = {
        //   $regexMatch: {
        //     input: {
        //       $concat: [
        //         '$slug', // همچنان خود slug فیلد اصلیه
        //         {
        //           $reduce: {
        //             input: {
        //               $map: {
        //                 input: '$translations',
        //                 as: 't',
        //                 in: { $concat: ['$$t.title', ' ', '$$t.description'] },
        //               },
        //             },
        //             initialValue: '',
        //             in: { $concat: ['$$value', ' ', '$$this'] },
        //           },
        //         },
        //       ],
        //     },
        //     regex: filters.query,
        //     options: 'i',
        //   },
        // }
        // delete filters.query
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
    data.image = data.image == '' ? null : data.image
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

  async tagExist(title: string, locale: string = 'fa'): Promise<boolean> {
    const result = await this.find({ filters: { title, locale } })
    console.log('#782346 tag serach result:', result)
    if (result.data.length == 0) return false
    return true
  }

  async ensureTagsExist(
    tags: { value: string; label: string }[],
    locale: string = 'fa'
  ): Promise<string[]> {
    const tagIds = []
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i]
      const flgTagExist = await this.tagExist(tag.label, locale)
      if (flgTagExist) tagIds.push(tag.value)
      else {
        const slug = slugify(tag.label)
        const newTag = await this.create({
          params: { translations: { lang: locale, title: tag.label }, slug },
        })
        tagIds.push(newTag.id)
      }
    }
    return tagIds
  }
}

const tagCtrl = new controller(new tagService(tagSchema))
export default tagCtrl
