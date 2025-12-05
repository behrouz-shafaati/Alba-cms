'use server'

import { z } from 'zod'
import postCtrl from '@/features/post/controller'
import { redirect } from 'next/navigation'
import { createPostHref, extractExcerptFromContentJson } from './utils'
import { getSession } from '@/lib/auth'
import { Option, Session, State } from '@/types'
import tagCtrl from '../tag/controller'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { Post, PostTranslationSchema } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { User } from '../user/interface'
import { can } from '../../lib/utils/can.server'

const FormSchema = z.object({
  title: z.string({}).nullable(),
  seoTitle: z.string({}).nullable(),
  contentJson: z.string({}),
  metaDescription: z.string({}),
  lang: z.string({}),
  status: z.string({}),
  mainCategory: z.string({}).nullable(),
  primaryVideo: z.string({}).nullable(),
  primaryVideoEmbedUrl: z.string({}).nullable(),
  categories: z.string({}),
  slug: z.string({}),
  tags: z.string({}),
  jsonLd: z.string().nullable(),
  image: z.string().nullable(),
})

/**
 * Creates a post with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the post dashboard.
 */
export async function createPost(prevState: State, formData: FormData) {
  let newPost = null
  const rawValues = Object.fromEntries(formData.entries())
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues?.lang || 'fa',
      title: rawValues?.title || '',
      contentJson: rawValues.contentJson || '',
    },
  }
  try {
    const user = (await getSession())?.user as User
    await can(user.roles, 'post.create')
    // Validate form fields

    const validatedFields = FormSchema.safeParse(rawValues)
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        success: false,
        values,
      }
    }
    const params = await sanitizePostData(validatedFields)
    if (params.status === 'published') {
      await can(
        user.roles,
        params.author !== user.id ? 'post.publish.any' : 'post.publish.own'
      )
    }
    const cleanedParams = await postCtrl.generateUniquePostSlug(params)
    // const mainCategory = await categoryCtrl.findById({
    //   id: cleanedParams.mainCategory,
    // })
    newPost = await postCtrl.create({
      params: cleanedParams,
    })
    const post = await postCtrl.findById({ id: newPost.id })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'post',
      slug: [createPostHref(post as Post), `/dashboard/posts`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
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
    console.log('Error in create post:', error)
    return {
      message: 'خطای پایگاه داده: ایجاد مطلب ناموفق بود.',
      success: false,
      values,
    }
  }
  if (newPost) redirect(encodeURI(`/dashboard/posts/${newPost.id}`))
  else redirect(`/dashboard/posts`)
}

export async function updatePost(
  id: string,
  prevState: State,
  formData: FormData
) {
  let updatedPost = {}
  const rawValues = Object.fromEntries(formData.entries())
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues?.lang || 'fa',
      title: rawValues?.title || '',
      contentJson: rawValues.contentJson || '',
    },
  }
  try {
    const user = (await getSession())?.user as User
    const prevPost = await postCtrl.findById({ id })
    await can(
      user.roles,
      prevPost.author?.id !== user.id ? 'post.edit.any' : 'post.edit.own'
    )

    const validatedFields = FormSchema.safeParse(rawValues)
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        success: false,
        values,
      }
    }
    const params = await sanitizePostData(validatedFields, id)
    if (params.status === 'published') {
      await can(
        user.roles,
        prevPost.author?.id !== user.id
          ? 'post.publish.any'
          : 'post.publish.own'
      )
    }
    const cleanedParams = await postCtrl.generateUniquePostSlug(params, id)

    updatedPost = await postCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'post',
      slug: [createPostHref(updatedPost as Post), `/dashboard/posts`],
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
    console.log('Error in update post:', error)
    return {
      message: 'خطای پایگاه داده: بروزرسانی مطلب ناموفق بود.',
      success: false,
      values: updatedPost,
    }
  }
}

export async function deletePostsAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevPostResult = await postCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevPost of prevPostResult.data) {
      await can(
        user.roles,
        prevPost.author?.id !== user.id ? 'post.delete.any' : 'post.delete.own'
      )
    }

    await postCtrl.delete({ filters: ids })
    // revalidate pathes
    let constRticlesPathes = []
    for (const prevPost of prevPostResult.data) {
      constRticlesPathes.push(createPostHref(prevPost as Post))
    }
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'post',
      slug: [...constRticlesPathes, `/dashboard/posts`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
    return {
      success: true,
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
    console.log('Error in delete post:', error)
    return { message: 'خطای پایگاه داده: حذف مطلب ناموفق بود', success: false }
  }
}

async function sanitizePostData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await postCtrl.findById({ id })
  }
  const session = (await getSession()) as Session
  // Create the post
  const postPayload = validatedFields.data

  // for multi categories select
  // const categoriesArray: Option[] = JSON.parse(postPayload?.categories || '[]')
  const excerpt = extractExcerptFromContentJson(postPayload.contentJson, 25)
  const image = postPayload.image
    ? postPayload.image == ''
      ? null
      : postPayload.image
    : null
  const user = session.user.id
  const contentJson = await postCtrl.setFileData(postPayload.contentJson)
  // CHECK IF TAG DOES'T EXIST CREATE IT
  const tagsArray: Option[] = JSON.parse(postPayload?.tags || '[]')
  // const tags = await tagCtrl.ensureTagsExist(tagsArray)
  const categories = JSON.parse(postPayload?.categories)

  const postType = postPayload.primaryVideoEmbedUrl != '' ? 'video' : 'article'
  const translations = [
    {
      lang: postPayload.lang,
      title: postPayload.title,
      seoTitle:
        postPayload.seoTitle != '' ? postPayload.seoTitle : postPayload.title,
      metaDescription:
        postPayload.metaDescription != ''
          ? postPayload.metaDescription
          : excerpt,
      excerpt,
      contentJson: JSON.stringify(contentJson),
      readingTime: postPayload.readingTime,
      jsonLd: postPayload.jsonLd,
    },
    ...prevState.translations.filter(
      (t: PostTranslationSchema) => t.lang != postPayload.lang
    ),
  ]
  const mainCategory = postPayload.mainCategory || null
  const categoriesId = categories.map((cat: Option) => cat.value)
  if (mainCategory && !categoriesId.includes(postPayload.mainCategory))
    categoriesId.push(postPayload.mainCategory)
  let params = {
    type: postType,
    ...postPayload,
    translations,
    tags: tagsArray.map((tag: Option) => tag.value),
    categories: categoriesId,
    image,
    mainCategory,
    ...(postPayload.status == 'published' ? { publishedAt: new Date() } : {}),
  }

  // اگر مطلب در حال بروز رسانی نیست نام کاربر و نویسنده ثبت شود
  if (!id || id === undefined) {
    params = { ...params, user, author: user }
  }
  return params
}

export async function getPosts(payload: QueryFind): Promise<QueryResult> {
  const filters: Record<string, any> = { ...(payload.filters ?? {}) }

  if (!Array.isArray(filters.categories) || filters.categories.length === 0) {
    delete filters.categories
  }

  if (!Array.isArray(filters.tags) || filters.tags.length === 0) {
    delete filters.tags
  }

  return postCtrl.find({
    ...payload,
    filters: { ...filters, status: 'published' },
  })
}
