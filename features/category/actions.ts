'use server'

import { z } from 'zod'
import categoryCtrl from './controller'
import { redirect } from 'next/navigation'
import { Option, Session, State } from '@/types'
import { Category, CategoryTranslationSchema } from './interface'
import { createCatrgoryBreadcrumb, slugify } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  parent: z.string({}).nullable(),
  lang: z.string({}),
  slug: z.string({}),
  description: z.string({}),
  status: z.string({}).min(1, { message: 'لطفا وضعیت را تعیین کنید.' }),
  icon: z.string({}).nullable(),
  image: z.string({}).nullable(),
})

async function sanitizePostData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await categoryCtrl.findById({ id })
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
      description: payload.description, // contentJson
    },
    ...prevState.translations.filter(
      (t: CategoryTranslationSchema) => t.lang != payload.lang
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
 * Creates a category with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the category dashboard.
 */
export async function createCategory(prevState: State, formData: FormData) {
  // Validate form fields
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues.lang,
      title: rawValues.title,
      description: rawValues.description,
    },
  }
  try {
    const user = (await getSession())?.user as User
    await can(user.roles, 'category.create')
    const validatedFields = FormSchema.safeParse(rawValues)
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        values,
      }
    }

    const params = await sanitizePostData(validatedFields)
    // Create the category
    await categoryCtrl.create({
      params,
    })
    // Revalidate the path and redirect to the category dashboard
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'category',
      slug: '/dashboard/categories',
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
    console.log(error)
    return {
      message: ` خطای پایگاه داده: ${error}`,
      values,
    }
  }
  redirect('/dashboard/categories')
}

export async function updateCategory(
  id: string,
  prevState: State,
  formData: FormData
) {
  const user = (await getSession())?.user as User
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues.lang,
      title: rawValues.title,
      description: rawValues.description,
    },
  }
  const validatedFields = FormSchema.safeParse(rawValues)

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      values,
    }
  }
  try {
    const prevCategory = await categoryCtrl.findById({ id })
    await can(
      user.roles,
      prevCategory.user !== user.id ? 'category.edit.any' : 'category.edit.own'
    )
    const params = await sanitizePostData(validatedFields, id)
    await categoryCtrl.findOneAndUpdate({
      filters: id,
      params,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'category',
      slug: '/dashboard/categories',
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
    console.log(error)
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.', values }
  }
  redirect('/dashboard/categories')
}

export async function deleteCategorysAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevCategoryResult = await categoryCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevCategory of prevCategoryResult.data) {
      await can(
        user.roles,
        prevCategory.user !== user.id
          ? 'category.delete.any'
          : 'category.delete.own'
      )
    }
    await categoryCtrl.delete({ filters: ids })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'category',
      slug: '/dashboard/categories',
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
    console.log(error)
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود', success: false }
  }
}

export async function getAllCategories(filters: any = {}) {
  return categoryCtrl.findAll({ filters })
}

export async function getCategoryAction({ slug }: { slug: string }) {
  const categoryResult = await categoryCtrl.find({ filters: { slug } })
  return categoryResult.data[0] || null
}

export async function searchCategories(
  query: string,
  locale: string = 'fa'
): Promise<Option[]> {
  const results = await categoryCtrl.find({ filters: { query } })

  return results.data.map((cat: Category) => {
    const translation: CategoryTranslationSchema =
      cat?.translations?.find(
        (t: CategoryTranslationSchema) => t.lang === locale
      ) ||
      cat?.translations[0] ||
      {}
    return {
      label: createCatrgoryBreadcrumb(cat, translation?.title),
      value: String(cat.id),
    }
  })
}
