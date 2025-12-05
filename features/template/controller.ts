import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import templateSchema from './schema'
import templateService from './service'
import categoryCtrl from '../category/controller'
import { slugify } from '@/lib/utils'
import { Types } from 'mongoose'
import { Category } from '../category/interface'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the templateController class extended of the main parent class baseController.
   *
   * @param service - templateService
   *templateCtrl
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
      else if (key == 'query' && filters?.query == '') {
        delete filters.query
      } else if (key == 'query') {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ['$title'],
            },
            regex: filters.query,
            options: 'i',
          },
        }
        delete filters.query
      } else if (key == 'templateFor') {
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
    const template = await super.create(payload)
    await this.deactiveTemplateFor({
      activeId: template.id,
      templateFor: template.templateFor,
    })
    return template
  }

  async findOneAndUpdate(payload: Update) {
    console.log('@#4234 4324 payload:', payload)
    const template = await super.findOneAndUpdate(payload)
    console.log('@#4234 4324 template:', template)
    if (template.status == 'active') {
      await this.deactiveTemplateFor({
        activeId: template.id,
        templateFor: template.templateFor,
      })
    }
    return template
  }

  async existSlug(slug: string): Promise<boolean> {
    const count = await this.countAll({ slug })
    if (count > 0) return true
    return false
  }

  /**
   * Automatic template detection based on input slug
   * @param param0 Object: {slug: string}
   * @returns
   */

  async getTemplate({ slug }: getTemplateProp) {
    let categoriesTemplateResult
    if (slug == '') return null
    switch (slug) {
      case 'archive': // آرشیو مطالب
        const [archiveTemplateResult] = await Promise.all([
          this.find({ filters: { templateFor: 'archive', status: 'active' } }),
        ])
        if (archiveTemplateResult.data[0] != undefined)
          return archiveTemplateResult.data[0]
        break
      case 'categories': // برای هر نوع دسته بندی
        ;[categoriesTemplateResult] = await Promise.all([
          this.find({
            filters: { templateFor: 'categories', status: 'active' },
          }),
        ])
        if (categoriesTemplateResult.data[0] != undefined)
          return categoriesTemplateResult.data[0]
        break
      case 'blog': // وبلاگ
        const [blogTemplateResult] = await Promise.all([
          this.find({ filters: { templateFor: 'blog', status: 'active' } }),
        ])
        if (blogTemplateResult.data[0] != undefined)
          return blogTemplateResult.data[0]
        break
      case 'post': // مطلب تکی
        const [postTemplateResult] = await Promise.all([
          this.find({ filters: { templateFor: 'post', status: 'active' } }),
        ])
        if (postTemplateResult.data[0] != undefined)
          return postTemplateResult.data[0]
        break
      case 'author': // مطلب تکی
        const [authorTemplateResult] = await Promise.all([
          this.find({ filters: { templateFor: 'author', status: 'active' } }),
        ])
        if (authorTemplateResult.data[0] != undefined)
          return authorTemplateResult.data[0]
        break
      case 'search': // مطلب تکی
        const [templateResult] = await Promise.all([
          this.find({ filters: { templateFor: 'search', status: 'active' } }),
        ])
        if (templateResult.data[0] != undefined) return templateResult.data[0]
        break
      case 'account': // مطلب تکی
        const [accountTemplateResult] = await Promise.all([
          this.find({ filters: { templateFor: 'account', status: 'active' } }),
        ])
        if (accountTemplateResult.data[0] != undefined)
          return accountTemplateResult.data[0]
        break
      default:
        let SpecialCategoryTemplate
        // بررسی کند که یک دسته بندی خاص یا والدهای آن اگر هست قالب آن را برگرداند
        const categoryResult = await categoryCtrl.find({ filters: { slug } })
        if (categoryResult?.data?.length > 0) {
          ;[SpecialCategoryTemplate] = await Promise.all([
            this.getCategoryTemplate(categoryResult.data[0]),
          ])

          if (
            SpecialCategoryTemplate != undefined &&
            SpecialCategoryTemplate != null
          )
            return SpecialCategoryTemplate
        }
        if (
          slug !== 'allPages' &&
          (SpecialCategoryTemplate == undefined ||
            SpecialCategoryTemplate == null)
        ) {
          // با این شرط چک میکنیم که اگر در حال جستجو برای قالب عمومی هستیم از این بخش گذر کنیم
          // اگر این دسته قالب مخصوصی نداشت از قالب عمومی برای تمام دسته ها استفاده شود
          ;[categoriesTemplateResult] = await Promise.all([
            this.find({
              filters: { templateFor: 'categories', status: 'active' },
            }),
          ])
          if (categoriesTemplateResult.data[0] != undefined)
            return categoriesTemplateResult.data[0]
        }
    }

    // در غیر این صورت قالب عمومی سایت برگردد
    const [allPageTemplateResult] = await Promise.all([
      this.find({ filters: { templateFor: 'allPages', status: 'active' } }),
    ])
    if (allPageTemplateResult.data[0] != undefined)
      return allPageTemplateResult.data[0]
    return null
  }

  async getCategoryTemplate(cat: Category | null): Promise<any> {
    if (!cat) return null
    const [categoryTemplateResult] = await Promise.all([
      this.find({
        filters: {
          templateFor: `category-${cat.id}`,
          status: 'active',
        },
      }),
    ])
    if (
      categoryTemplateResult.data[0] != undefined &&
      categoryTemplateResult.data.length
    )
      return categoryTemplateResult.data[0]
    return templateCtrl.getCategoryTemplate(cat.parent)
  }

  /**
   * تولید اسلاگ یکتا با بررسی دیتابیس
   */
  async generateUniqueTemplateSlug(
    params: { slug: string; title: string },
    templateId: string = ''
  ): Promise<object> {
    const baseSlug =
      params.slug != '' && params.slug != null
        ? slugify(params.slug)
        : slugify(params.title)
    // if it is update and slug doesn't change remove slug from parameters
    if (templateId !== '') {
      const findedTemplateBySlug = await templateCtrl.findOne({
        filters: { slug: baseSlug },
      })
      if (findedTemplateBySlug && findedTemplateBySlug.id == templateId) {
        const { slug, ...rest } = params
        return rest
      }
    }

    // if it is new template need to generate new slug
    let slug = baseSlug
    let count = 1
    while (await templateCtrl.existSlug(slug)) {
      slug = `${baseSlug}-${count}`
      count++
    }
    return { ...params, slug }
  }

  async deactiveTemplateFor({
    activeId,
    templateFor,
  }: {
    activeId: string
    templateFor: string[]
  }) {
    this.updateMany({
      filters: {
        templateFor: { $in: templateFor },
        _id: { $ne: new Types.ObjectId(activeId) },
      },
      params: { $set: { status: 'deactive' } },
    })
  }
}

type getTemplateProp = {
  slug:
    | 'allPages'
    | 'blog'
    | 'categories'
    | 'archive'
    | 'post'
    | 'category'
    | 'author'
    | 'account'
    | 'search'
}

const templateCtrl = new controller(new templateService(templateSchema))
export default templateCtrl
