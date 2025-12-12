import { Create, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import postCommentSchema from './schema'
import postCommentService from './service'
import { getTranslation } from '@/lib/utils'
import { buildCommentTree } from './utils'
import { renderTiptapJsonToHtml } from '@/lib/renderTiptapToHtml'
import { PostComment, postComment } from './interface'
import contentJson2PlainText from '@/lib/utils/contentJson2PlainText'
import getReadingTime from '@/lib/utils/getReadingTime'

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
    const plainText = contentJson2PlainText(json)

    const readingTime = getReadingTime(plainText)
    return { ...data, readingTime }
  }

  async renderCommentsAndMakeCommentsTree(
    rowPostComments: PostComment[],
    createCommantTree: boolean = true
  ) {
    // اول همه Promise‌ها رو جمع کن
    const translationPromises: Array<{
      commentIndex: number
      translationIndex: number
      promise: Promise<string>
    }> = []

    rowPostComments.forEach((comment, commentIndex) => {
      comment.translations.forEach((translation, translationIndex) => {
        translationPromises.push({
          commentIndex,
          translationIndex,
          promise: renderTiptapJsonToHtml(
            JSON.parse(translation.contentJson || '{}')
          ),
        })
      })
    })

    // همه رو یکجا اجرا کن
    const results = await Promise.all(translationPromises.map((t) => t.promise))

    // نتایج رو برگردون به ساختار اصلی
    const processedComments = rowPostComments.map((comment, ci) => ({
      ...comment,
      translations: comment.translations.map((translation, ti) => {
        const resultIndex = translationPromises.findIndex(
          (t) => t.commentIndex === ci && t.translationIndex === ti
        )
        return {
          ...translation,
          contentJson: results[resultIndex],
        }
      }),
    }))
    let postComments = processedComments
    if (createCommantTree) postComments = buildCommentTree(processedComments)
    return postComments
  }

  async find(payload: QueryFind, createCommantTree: boolean = true) {
    payload.filters = this.standardizationFilters(payload.filters)
    const postCommentsResult = await super.find(payload)
    const postComments = await this.renderCommentsAndMakeCommentsTree(
      postCommentsResult.data,
      createCommantTree
    )
    return { ...postCommentsResult, data: postComments }
  }

  async findAll(payload: QueryFind) {
    const postCommentsResult = await super.findAll(payload)
    const postComments = await this.renderCommentsAndMakeCommentsTree(
      postCommentsResult.data
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
