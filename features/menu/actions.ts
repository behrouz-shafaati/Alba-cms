'use server'

import { z } from 'zod'
import menuCtrl from '@/features/menu/controller'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { getSession } from '@/lib/auth'
import { MenuTranslationSchema } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  itemsJson: z.string({}),
  lang: z.string({}),
})

async function sanitizePostData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  if (id) {
    prevState = await menuCtrl.findById({ id })
    console.log('#prevState 098776 :', prevState)
  }
  const session = (await getSession()) as Session
  const payload = validatedFields.data
  console.log('#iuy982y34 payload:', payload)
  const user = session.user.id
  const translations = [
    {
      lang: payload.lang,
      title: payload.title,
      items: JSON.parse(payload.itemsJson),
    },
    ...prevState.translations.filter(
      (t: MenuTranslationSchema) => t.lang != payload.lang
    ),
  ]
  const params = {
    ...payload,
    translations,
    user,
  }

  return params
}

/**
 * Creates a menu with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the menu dashboard.
 */
export async function createMenu(prevState: State, formData: FormData) {
  // Validate form fields
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
    translation: {
      lang: rawValues?.lang,
      title: rawValues?.title,
      items: JSON.parse(rawValues?.itemsJson),
    },
  }
  const validatedFields = FormSchema.safeParse(rawValues)
  try {
    const user = (await getSession())?.user as User
    await can(user.roles, 'menu.create')
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        ok: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        values,
      }
    }

    const params = await sanitizePostData(validatedFields)
    // Create the menu
    await menuCtrl.create({ params })
    // Revalidate the path and redirect to the menu dashboard
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'menu',
      slug: '/dashboard/menus',
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
        ok: false,
        errors: error.flatten().fieldErrors,
        values,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error increate menu:', error)
    return {
      ok: false,
      message: 'خطای پایگاه داده: ایجاد منو ناموفق بود.',
      values,
    }
  }

  redirect('/dashboard/menus')
}

export async function updateMenu(
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
      items: rawValues?.itemsJson,
    },
  }
  const validatedFields = FormSchema.safeParse(rawValues)

  try {
    const user = (await getSession())?.user as User
    const prevMenu = await menuCtrl.findById({ id })
    await can(
      user.roles,
      prevMenu?.user !== user.id ? 'menu.edit.any' : 'menu.edit.own'
    )
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        ok: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        values,
      }
    }
    const params = await sanitizePostData(validatedFields, id)
    await menuCtrl.findOneAndUpdate({
      filters: id,
      params,
    })
    // Revalidate the path and redirect to the menu dashboard
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'menu',
      slug: '/dashboard/menus',
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
    console.log('Error in update menu:', error)
    return {
      ok: false,
      values,
      message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.',
    }
  }
  redirect('/dashboard/menus')
}

export async function deleteMenusAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevMenuResult = await menuCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevMenu of prevMenuResult.data) {
      await can(
        user.roles,
        prevMenu.user !== user.id ? 'menu.delete.any' : 'menu.delete.own'
      )
    }
    await menuCtrl.delete({ filters: ids })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'menu',
      slug: '/dashboard/menus',
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
    console.log('Error in delete manu:', error)
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
}

export async function getAllMenus() {
  return menuCtrl.findAll({})
}
export async function getMenus(payload: QueryFind): Promise<QueryResult> {
  return menuCtrl.find(payload)
}
