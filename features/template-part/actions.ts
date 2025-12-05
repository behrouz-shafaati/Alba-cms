'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import templatePartCtrl from '@/features/template-part/controller'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import settingsCtrl from '../settings/controller'
import { generateUniqueTemplatePartSlug } from './utils'
import { getSession } from '@/lib/auth'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { TemplatePart } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'

const FormSchema = z.object({
  contentJson: z.string({}),
})

/**
 * Creates a TemplatePart with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the TemplatePart dashboard.
 */
export async function createTemplatePart(prevState: State, formData: FormData) {
  let newTemplatePart = null
  const values = Object.fromEntries(formData.entries())
  // Validate form fields
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  try {
    const user = (await getSession())?.user as User
    await can(user.roles, 'template.create')
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        success: false,
        values,
      }
    }

    const params = await sanitizeTemplatePartData(validatedFields)
    const cleanedParams = await generateUniqueTemplatePartSlug(params)
    console.log('#234876 params:', params)
    // Create the TemplatePart
    newTemplatePart = await templatePartCtrl.create({
      params: cleanedParams,
    })

    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'templatePart',
      slug: [
        `/${cleanedParams?.slug || params.slug}`,
        `/dashboard/template-parts`,
      ],
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
        message: 'لطفا فیلدهای لازم را پر کنید.',
        errors: error.flatten().fieldErrors,
        values,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in create template part:', error)
    return {
      message: 'خطای پایگاه داده: ایجاد قطعه قالب ناموفق بود.',
      success: false,
      values,
    }
  }
  if (newTemplatePart) {
    // redirect(`/dashboard/template-parts/${newTemplatePart.id}`)
    return {
      message: '',
      success: true,
      isCreatedJustNow: true,
      values: newTemplatePart,
    }
  }
  redirect('/dashboard/template-parts')
}

export async function updateTemplatePart(
  id: string,
  prevState: State,
  formData: FormData
) {
  const values = Object.fromEntries(formData.entries())
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  try {
    const user = (await getSession())?.user as User
    const prevTemplatePart = await templatePartCtrl.findById({ id })
    await can(
      user.roles,
      prevTemplatePart.user !== user.id
        ? 'template.edit.any'
        : 'template.edit.own'
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

    const params = await sanitizeTemplatePartData(validatedFields)

    const cleanedParams = await generateUniqueTemplatePartSlug(params, id)
    let varRevalidatePath = [`/${cleanedParams?.slug || params.slug}`]
    // if is home TemplatePart so revalidate home TemplatePart
    const settings = await settingsCtrl.findOne({
      filters: { type: 'site-settings' },
    })
    if (settings?.id === id) varRevalidatePath = [...varRevalidatePath, '/']
    await templatePartCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'templatePart',
      slug: [...varRevalidatePath, `/dashboard/template-parts`],
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
    console.log('Error in update template part:', error)
    return { message: 'خطای پایگاه داده: بروزرسانی قطعه قالب ناموفق بود.' }
  }
}

export async function deleteTemplatePartAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevTemplatePartResult = await templatePartCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevTemplatePart of prevTemplatePartResult.data) {
      await can(
        user.roles,
        prevTemplatePart.user !== user.id
          ? 'template.delete.any'
          : 'template.delete.own'
      )
    }

    await templatePartCtrl.delete({ filters: ids })
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in delete template part:', error)
    return { message: 'خطای پایگاه داده: حذف قطعه قالب ناموفق بود' }
  }
  const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
    feature: 'templatePart',
    slug: [`/dashboard/template-parts`],
  })

  for (const slug of pathes) {
    // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
    revalidatePath(slug)
  }
}

export async function getAllTemplateParts() {
  return templatePartCtrl.findAll({})
}

async function sanitizeTemplatePartData(validatedFields: any) {
  const session = (await getSession()) as Session

  const user = session.user.id
  // Create the post
  const content = JSON.parse(validatedFields.data.contentJson)
  const params = {
    content,
    title: content.title,
    type: content.type,
    templatePartFor: content.templatePartFor,
    slug: content.slug,
    status: content.status,
    user,
  }
  return params
}

export async function getTemplateParts(
  payload: QueryFind
): Promise<QueryResult> {
  return templatePartCtrl.find(payload)
}
export async function getTemplatePart(
  templatePartId: string
): Promise<TemplatePart> {
  const result = await templatePartCtrl.find({
    filters: { id: templatePartId },
  })
  return result.data[0]
}
