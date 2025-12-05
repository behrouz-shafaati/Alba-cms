import { Create, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import postCommentSchema from './schema'
import postCommentService from './service'
import { getReadingTime } from '../post/utils'
import { getTranslation } from '@/lib/utils'
import { buildCommentTree } from './utils'
import { renderTiptapJsonToHtml } from '@/lib/renderTiptapToHtml'
import { postComment } from './interface'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the postCommentController class extended of the main parent class baseController.
   *
   * @param service - postCommentService
   *postCommentCtrl
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
    const translation = data?.translations
      ? getTranslation({
          translations: data?.translations ?? {},
          locale: data?.locale,
        })
      : []
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

  async find(payload: QueryFind, createCommantTree: boolean = true) {
    payload.filters = this.standardizationFilters(payload.filters)
    const result = await super.find(payload)

    const postComments = result.data.map((c: postComment) => {
      return {
        ...c,
        translations: c.translations.map((translation) => ({
          ...translation,
          contentJson: renderTiptapJsonToHtml(
            JSON.parse(translation.contentJson || '{}')
          ),
        })),
      }
    })
    if (!createCommantTree) return { ...result, data: postComments }
    const postCommentsTree = buildCommentTree(postComments)
    return { ...result, data: postCommentsTree }
  }

  async findAll(payload: QueryFind) {
    const postCommentsResult = await super.findAll(payload)
    const postComments = buildCommentTree(
      postCommentsResult.data.map((c) => {
        return {
          ...c,
          translations: c.translations.map((translation) => ({
            ...translation,
            contentJson: renderTiptapJsonToHtml(
              JSON.parse(translation.contentJson || '{}')
            ),
          })),
        }
      })
    )

    return { ...postCommentsResult, data: postComments }
  }

  async create(payload: Create) {
    payload.params = this.makeCleanDataBeforeSave(payload.params)
    console.log('#389dsf payload:', payload)
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    // payload.params = this.makeCleanDataBeforeSave(payload.params)

    console.log(payload)
    return super.findOneAndUpdate(payload)
  }

  async updatepostCommentStatus(payload: Update) {
    console.log('#7777777766 payload:', payload)
    return super.findOneAndUpdate(payload)
  }
}

const postCommentCtrl = new controller(
  new postCommentService(postCommentSchema)
)
export default postCommentCtrl
