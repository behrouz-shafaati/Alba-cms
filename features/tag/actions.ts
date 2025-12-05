'use server'

import { z } from 'zod'
import tagCtrl from './controller'
import { redirect } from 'next/navigation'
import { Option, Session, State } from '@/types'
import { Tag, TagTranslationSchema } from './interface'
import { getSession } from '@/lib/auth'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'
import { slugify } from '@/lib/utils'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  slug: z.string({}).nullable(),
  lang: z.string({}).nullable(),
  description: z.string({}),
  status: z.string({}).min(1, { message: 'لطفا وضعیت را تعیین کنید.' }),
  image: z.string({}).nullable(),
  icon: z.string({}).nullable(),
})

async function sanitizePostData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await tagCtrl.findById({ id })
    console.log('#prevState 098776 :', prevState)
  }
  const session = (await getSession()) as Session
  const payload = validatedFields.data
  const user = session.user.id
  const slug = payload.slug !== '' ? payload.slug : slugify(payload.title)
  const translations = [
    {
      lang: payload.lang,
      title: payload.title,
      description: payload.description,
    },
    ...prevState.translations.filter(
      (t: TagTranslationSchema) => t.lang != payload.lang
    ),
  ]
  const params = {
    ...payload,
    translations,
    user,
    slug,
  }

  return params
}

/**
 * Creates a tag with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the tag dashboard.
 */
export async function createTag(prevState: State, formData: FormData) {
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues?.lang,
      title: rawValues?.title,
      description: rawValues?.description,
    },
  }
  // Validate form fields
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  try {
    const user = (await getSession())?.user as User
    await can(user.roles, 'tag.create')
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        values,
      }
    }

    const params = await sanitizePostData(validatedFields)
    // Create the tag
    await tagCtrl.create({ params })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'tag',
      slug: [`/dashboard/tags`],
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
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('!2345:', error)
    return {
      message: 'خطای پایگاه داده: ایجاد برچسب ناموفق بود.',
      values,
    }
  }
  redirect('/dashboard/tags')
}

export async function updateTag(
  id: string,
  prevState: State,
  formData: FormData
) {
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues?.lang,
      title: rawValues?.title,
      description: rawValues?.description,
    },
  }

  const validatedFields = FormSchema.safeParse(rawValues)

  try {
    const user = (await getSession())?.user as User
    const prevTag = await tagCtrl.findById({ id })
    await can(
      user.roles,
      prevTag?.user.id !== user.id ? 'tag.edit.any' : 'tag.edit.own'
    )
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        values,
      }
    }
    const params = await sanitizePostData(validatedFields, id)
    await tagCtrl.findOneAndUpdate({
      filters: id,
      params: params,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'tag',
      slug: [`/dashboard/tags`],
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
    if (process.env.NODE_ENV === 'development') throw error
    console.log('!2345 Error in update tag:', error)
    return { message: 'خطای پایگاه داده: بروزرسانی برچسب ناموفق بود.', values }
  }
  redirect('/dashboard/tags')
}

export async function deleteTagsAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevTagResult = await tagCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevTag of prevTagResult.data) {
      await can(
        user.roles,
        prevTag?.user.id !== user.id ? 'tag.delete.any' : 'tag.delete.own'
      )
    }

    await tagCtrl.delete({ filters: ids })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'tag',
      slug: [`/dashboard/tags`],
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
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('!2348 Error in delete tag:', error)
    return { message: 'خطای پایگاه داده: حذف برچسب ناموفق بود' }
  }
}

export async function getAllTags(filters: any = {}) {
  return tagCtrl.findAll({ filters })
}
export async function getTagAction({ slug }: { slug: string }) {
  const tagResult = await tagCtrl.find({ filters: { slug } })
  return tagResult.data[0] || null
}

export async function searchTags(
  query: string,
  locale: string = 'fa'
): Promise<Option[]> {
  const results = await tagCtrl.find({ filters: { query } })

  return results.data.map((tag: Tag) => {
    const translation: any =
      tag?.translations?.find((t: any) => t.lang === locale) ||
      tag?.translations[0] ||
      {}
    return {
      label: translation?.title,
      value: String(tag.id),
    }
  })
}
