import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import categorySchema from './schema'
import categoryService from './service'
import { Category, CategoryInput } from './interface'
import { slugify } from '@/lib/utils'
import { buildCategoryHref } from './utils'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the categoryController class extended of the main parent class baseController.
   *
   * @param service - categoryService
   *categoryCtrl
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
    data.parent = data.parent == '' ? null : data.parent
    data.parent = data.parent == 'null' ? null : data.parent
    data.parent = data.parent == data?.id ? null : data.parent

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
    const existing = await this.findOne({
      filters: { slug: payload.params.slug },
    })
    if (existing) {
      throw new Error('نامک تکراری است!')
    }
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    payload.params = this.makeCleanDataBeforeSave(payload.params)

    // Preventing the risk of circular reference
    payload.params.parent =
      payload.params.parent == payload.filters ? null : payload.params.parent
    return super.findOneAndUpdate(payload)
  }

  async categoryExist(title: string): Promise<boolean> {
    const count = await this.countAll({ title })
    if (count == 0) return false
    return true
  }

  async ensureCategoryExist(
    categories: { value: string; label: string }[]
  ): Promise<string[]> {
    const categoryIds = []
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      const flgcategoryExist = await this.categoryExist(category.label)
      if (flgcategoryExist) categoryIds.push(category.value)
      else {
        const slug = slugify(category.label)
        const newTag = await this.create({
          params: { title: category.label, slug },
        })
        categoryIds.push(newTag.id)
      }
    }
    return categoryIds
  }

  async generateStaticParams() {
    const categoriesHomeSlugs = await this.getAllSlugs() // فرض کن فقط slug برمی‌گردونه
    return categoriesHomeSlugs
  }

  async getAllSlugs() {
    const result = await this.findAll({})
    return result.data.map((category: Category) => ({
      slugs: buildCategoryHref(category, '').replace(/^\/+/g, '').split('/'),
    }))
  }
}

const categoryCtrl = new controller(new categoryService(categorySchema))
export default categoryCtrl
