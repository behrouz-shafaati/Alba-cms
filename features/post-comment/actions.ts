'use server'

import { z } from 'zod'
import postCommentCtrl from '@/features/post-comment/controller'
import { createPostHref, extractExcerptFromContentJson } from '../post/utils'
import { getSession } from '@/lib/auth'
import { Session, State } from '@/types'
import { QueryFind, QueryResponse } from '@/lib/entity/core/interface'
import { PostComment, PostCommentTranslationSchema } from './interface'
import categoryCtrl from '../category/controller'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import postCtrl from '../post/controller'
import { Post } from '../post/interface'
import { getSettings } from '../settings/controller'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'

const FormSchema = z.object({
  contentJson: z.string({}),
  locale: z.string({}),
  parent: z.string({}),
})

const updateStatusPostCommentSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
})

/**
 * Creates a postComment with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the postComment dashboard.
 */
export async function createPostComment(
  id: string,
  prevState: State,
  formData: FormData
) {
  // Validate form fields
  let newPostComment = null
  const rawValues = Object.fromEntries(formData.entries())
  console.log('#23498xx7 rawValues:', rawValues)
  const values = {
    ...rawValues,
    locale: rawValues?.locale,
    translation: {
      lang: rawValues?.lang || 'fa',
      contentJson: rawValues.contentJson || '',
    },
  }
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
      values,
    }
  }

  try {
    const user = (await getSession())?.user as User
    await can(user?.roles, 'postComment.create')
    const post = await postCtrl.findById({
      id,
    })
    const cleanedParams = await sanitizePostCommentData(validatedFields, id)
    newPostComment = await postCommentCtrl.create({
      params: { post: id, ...cleanedParams },
    })

    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'postComment',
      slug: [createPostHref(post as Post), `/dashboard/postComments`],
    })
    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.+
      revalidatePath(slug)
    }
    return {
      message: 'دیدگاه شما ثبت شد',
      success: true,
      values: newPostComment,
    }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
        values,
      }
    }
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
        values,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log(error)
    return {
      message: 'خطای پایگاه داده: ثبت دیدگاه ناموفق بود.',
      success: false,
      values,
    }
  }
  // if (newPostComment)
  //   redirect(encodeURI(`/dashboard/postComments/${newPostComment.id}`))
  // else redirect(`/dashboard/postComments`)
}

export async function updatePostComment(
  id: string,
  prevState: State,
  formData: FormData
) {
  const user = (await getSession())?.user as User
  let updatedPostComment = {}
  const rawValues = Object.fromEntries(formData.entries())
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues?.lang || 'fa',
      title: rawValues?.title || '',
      contentJson: rawValues.contentJson || '',
    },
  }
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
      values,
    }
  }
  try {
    const prevPostComment: PostComment = await postCommentCtrl.findById({
      id,
    })

    // if user loged in and send comment
    if (prevPostComment?.author)
      await can(
        user.roles,
        prevPostComment?.author?.id !== user.id
          ? 'post.edit.any'
          : 'post.edit.own'
      )
    // user send comment as guest
    else await can(user.roles, 'post.edit.any')
    const params = await sanitizePostCommentData(validatedFields, id)
    const cleanedParams = await postCtrl.generateUniquePostSlug(params, id)
    updatedPostComment = await postCommentCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    const post = await postCtrl.findById({
      id,
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'postComment',
      slug: [createPostHref(post as Post), `/dashboard/postComments`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    return { message: 'فایل با موفقیت بروز رسانی شد', success: true, values }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
        values,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log(error)
    return {
      message: 'خطای پایگاه داده: بروزرسانی دیدگاه ناموفق بود.',
      success: false,
      values: updatedPostComment,
    }
  }
}

export async function updateStatusPostComment(
  id: string,
  prevState: State,
  formData: FormData | Record<string, any> | null | undefined
) {
  const user = (await getSession())?.user as User
  let raw: Record<string, any> = {}
  if (formData && typeof (formData as any).entries === 'function') {
    raw = Object.fromEntries((formData as FormData).entries())
  } else if (formData && typeof formData === 'object') {
    raw = formData
  }

  const parsed = updateStatusPostCommentSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: 'بروزرسانی دیدگاه ناموفق بود',
    }
  }
  console.log('#09345798 id v params:', id, 'and: ', parsed.data)
  try {
    await can(user.roles, 'postComment.moderate.any')
    const updatedPostComment = await postCommentCtrl.findOneAndUpdate({
      filters: id,
      params: parsed.data,
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'postComment',
      slug: [
        createPostHref(updatedPostComment?.post as Post),
        `/dashboard/postComments`,
      ],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    return { message: 'فایل با موفقیت بروز رسانی شد', success: true }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log(error)
    return {
      message: 'خطای پایگاه داده: بروزرسانی دیدگاه ناموفق بود.',
      success: false,
    }
  }
}

export async function deletePostCommentAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const postCommentsResult = await postCommentCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevPost of postCommentsResult.data) {
      if (prevPost.author)
        await can(
          user.roles,
          prevPost?.author?.id !== user.id
            ? 'postComment.delete.any'
            : 'postComment.delete.own'
        )
      else await can(user.roles, 'postComment.delete.any')
    }
    await postCommentCtrl.delete({ filters: ids }) // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'postComment',
      slug: [
        ...postCommentsResult.data.map((ac) =>
          createPostHref(ac?.post as Post)
        ),
        `/dashboard/postComments`,
      ],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    return {
      seccess: true,
    }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log(error)
    return {
      message: 'خطای پایگاه داده: حذف دیدگاه ناموفق بود',
      success: false,
    }
  }
}

async function sanitizePostCommentData(
  validatedFields: any,
  id?: string | undefined
) {
  let prevState = { translations: [] }
  const session = (await getSession()) as Session
  // Create the postComment
  const postCommentPayload = validatedFields.data
  const excerpt = extractExcerptFromContentJson(
    postCommentPayload.contentJson,
    50
  )
  const createdBy = session?.user.id || null
  const author = session?.user.id || null

  const translations = [
    {
      lang: postCommentPayload.locale,
      excerpt,
      contentJson: postCommentPayload.contentJson,
      readingTime: postCommentPayload.readingTime,
    },
    ...prevState.translations.filter(
      (t: PostCommentTranslationSchema) => t.lang != postCommentPayload.lang
    ),
  ]
  const status = (await can(
    session?.user.roles,
    'postComment.moderate.any',
    false
  ))
    ? 'approved'
    : 'pending'
  const parent =
    postCommentPayload.parent == '' ? null : postCommentPayload.parent
  const params = {
    ...postCommentPayload,
    postId: id,
    createdBy,
    author,
    translations,
    parent,
    status,
  }

  return params
}

export async function getPostComments(
  payload: QueryFind
): Promise<QueryResponse<PostComment>> {
  const filters: Record<string, any> = { ...(payload.filters ?? {}) }

  return postCommentCtrl.findAll({
    filters,
    sort: { createdAt: 1 },
  })
}

export async function getPostCommentsForClient(payload: QueryFind) {
  const commentApprovalRequired = await getSettings('commentApprovalRequired')
  if (commentApprovalRequired) payload.filters.status = 'approved'
  return getPostComments(payload)
}
