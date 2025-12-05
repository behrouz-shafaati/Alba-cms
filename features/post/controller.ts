import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import fileCtrl from '@/lib/entity/file/controller'
import postSchema from './schema'
import postService from './service'
import categoryCtrl from '../category/controller'
import tagCtrl from '../tag/controller'
import {
  createPostHref,
  getReadingTime,
  updateFileDetailsInContentJson,
} from './utils'
import { Post } from './interface'
import { Category } from '../category/interface'
import { getTranslation, slugify } from '@/lib/utils'
import { FileDetails } from '@/lib/entity/file/interface'
import generateHumanId from '../user/utils/generateUsername'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the postController class extended of the main parent class baseController.
   *
   * @param service - postService
   *postCtrl
   * @beta
   */
  constructor(service: any) {
    super(service)
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {}
    for (const [key, value] of Object.entries(filters)) {
      if (key == 'categories' || key == 'tags') filters[key] = { $in: value }
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

          // سرچ روی translations.excerpt
          { 'translations.excerpt': { $regex: filters.query, $options: 'i' } },

          // سرچ روی translations.contentJson
          {
            'translations.contentJson': {
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
    data.categories = data.categories == '' ? [] : data.categories
    const translation = getTranslation({
      translations: data.translations,
      locale: data.locale,
    })
    const json = JSON.parse(translation.contentJson)
    const plainText =
      json.content
        ?.filter((block: any) => block.type === 'paragraph')
        ?.map((block: any) =>
          block.content?.map((c: any) => c.text || '').join('')
        )
        .join('\n') || ''

    const readingTime = getReadingTime(plainText)
    return { ...data, readingTime }
  }

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters)
    const result = await super.find(payload)
    return result
  }

  async create(payload: Create) {
    payload.params = this.makeCleanDataBeforeSave(payload.params)
    console.log('#389 payload:', payload)
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    payload.params = this.makeCleanDataBeforeSave(payload.params)
    return super.findOneAndUpdate(payload)
  }

  async existSlug(slug: string): Promise<boolean> {
    const count = await this.countAll({ slug })
    console.log('#7736 post count: ', count)
    if (count > 0) return true
    return false
  }

  async setFileData(contentJson: any) {
    const parsedContent = JSON.parse(contentJson)
    const content = parsedContent?.content || []
    const contentJsonSetedFileData = await Promise.all(
      content.map(async (block: any) => {
        if (block.type === 'image') {
          const image = block.attrs
          const imageFileData = await fileCtrl.findById({ id: image?.id })
          return { type: 'image', attrs: imageFileData }
        }
        return block
      })
    )
    return { type: 'doc', content: contentJsonSetedFileData }
  }

  async updateContentJsonFileDetails({
    fileDetails,
  }: {
    fileDetails: FileDetails
  }) {
    const postId = fileDetails.attachedTo[0].id
    const post = await this.findById({ id: postId })

    const updatedPost = updateFileDetailsInContentJson({
      post,
      fileDetails,
    })
    await this.findOneAndUpdate({
      filters: { _id: post.id },
      params: {
        translations: updatedPost?.translations || [],
        locale: fileDetails.locale,
      },
    })
  }

  async convertCategoriesAndTagSlugToId({
    categorySlugs,
    tagSlugs,
  }: {
    categorySlugs: string[]
    tagSlugs: string[]
  }) {
    const [categoryiesResult, tagsResult] = await Promise.all([
      categoryCtrl.find({ filters: { slug: { $in: categorySlugs } } }),
      tagCtrl.find({ filters: { slug: { $in: tagSlugs } } }),
    ])
    const categoryIds = categoryiesResult.data.map(
      (category: any) => category.id
    )
    const tagIds = tagsResult.data.map((tag: any) => tag.id)
    return { categoryIds, tagIds }
  }

  async getAllSlugs() {
    const result = await this.findAll({})
    return result.data.map((post: Post) => ({
      slug: createPostHref(post),
    }))
  }

  async generateStaticParams() {
    const singlrPostSlugs = (await this.getAllSlugs()).map((item: any) => ({
      slugs: item.slug.replace(/^\/+/g, '').split('/'),
    })) // فرض کن فقط slug برمی‌گردونه
    return singlrPostSlugs
  }

  async generateUniquePostSlug(
    params: { slug: string; title: string },
    postId: string = ''
  ): Promise<object> {
    console.log('#237s8 params: ', params)
    let baseSlug =
      params.slug != '' && params.slug != null
        ? slugify(params.slug)
        : slugify(params.title)
    console.log('#237s8 baseSlug: ', baseSlug)
    if (baseSlug == null || baseSlug == '') baseSlug = generateHumanId()
    // if it is update and slug doesn't change remove slug from parameters
    if (postId !== '') {
      const findedPostBySlug = await postCtrl.findOne({
        filters: { slug: baseSlug },
      })
      if (findedPostBySlug && findedPostBySlug.id == postId) {
        const { slug, ...rest } = params
        return rest
      }
    }

    // if it is new post need to generate new slug
    let slug = baseSlug
    let count = 1
    while (await postCtrl.existSlug(slug)) {
      slug = `${baseSlug}-${count}`
      count++
    }

    return { ...params, slug }
  }

  async countThisWeek() {
    const now = new Date()
    now.setHours(23, 59, 59, 999) // تا انتهای امروز

    const day = now.getDay()
    const diffToSaturday = day === 6 ? 0 : day + 1

    const firstDayOfWeek = new Date(now)
    firstDayOfWeek.setDate(now.getDate() - diffToSaturday)
    firstDayOfWeek.setHours(0, 0, 0, 0) // ساعت ۰:۰۰ شنبه

    // تعداد مطالب منتشر شده این هفته
    const countThisWeek = await this.countAll({
      status: 'published',
      publishedAt: { $gte: firstDayOfWeek, $lte: now },
    })
    return countThisWeek
  }
}

const postCtrl = new controller(new postService(postSchema))
export default postCtrl
