'use server'

import { z } from 'zod'
import templateCtrl from '@/features/template/controller'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import { getSession } from '@/lib/auth'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { Template } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'

const FormSchema = z.object({
  contentJson: z.string({}),
})

/**
 * Creates a Template with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the Template dashboard.
 */
export async function createTemplate(prevState: State, formData: FormData) {
  let newTemplate = null
  const values = Object.fromEntries(formData)
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

    const params = await sanitizeTemplateData(validatedFields)
    const cleanedParams = await templateCtrl.generateUniqueTemplateSlug(params)
    console.log('#23487s6 cleanedParams:', cleanedParams)
    // Create the Template
    newTemplate = await templateCtrl.create({
      params: cleanedParams,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'template',
      slug: [`/dashboard/templates`],
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
    console.log('Error in create template:', error)
    return {
      message: 'خطای پایگاه داده: ایجاد دسته ناموفق بود.',
      success: false,
      values,
    }
  }
  if (newTemplate) {
    // redirect(`/dashboard/templates/${newTemplate.id}`)
    return {
      message: '',
      success: true,
      isCreatedJustNow: true,
      values: newTemplate,
    }
  }
  redirect('/dashboard/templates')
}

export async function updateTemplate(
  id: string,
  prevState: State,
  formData: FormData
) {
  const values = Object.fromEntries(formData)
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  try {
    const user = (await getSession())?.user as User
    const prevTemplate = await templateCtrl.findById({ id })
    await can(
      user.roles,
      prevTemplate.user !== user.id ? 'template.edit.any' : 'template.edit.own'
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
    const params = await sanitizeTemplateData(validatedFields)

    const cleanedParams = await templateCtrl.generateUniqueTemplateSlug(
      params,
      id
    )
    // if is home Template so revalidate home Template
    await templateCtrl.findOneAndUpdate({
      filters: id,
      params: cleanedParams,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'template',
      slug: [`/dashboard/templates`],
    })
    console.log('098 path need revalidate:', pathes)
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
    console.log('Error in update template:', error)
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
}

export async function deleteTemplatesAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevTemplateResult = await templateCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevTemplate of prevTemplateResult.data) {
      await can(
        user.roles,
        prevTemplate.user !== user.id
          ? 'template.delete.any'
          : 'template.delete.own'
      )
    }

    await templateCtrl.delete({ filters: ids })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'template',
      slug: [`/dashboard/templates`],
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
    console.log('Error in delete template:', error)
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
}

export async function getAllTemplates() {
  return templateCtrl.findAll({})
}

async function sanitizeTemplateData(validatedFields: any) {
  const session = (await getSession()) as Session

  const user = session.user.id
  // Create the template
  const content = JSON.parse(validatedFields.data.contentJson)
  const params = {
    content,
    title: content.title,
    type: content.type,
    templateFor: content.templateFor,
    slug: content.slug,
    status: content.status,
    parent: content.parent == 'none' ? null : content.parent,
    user,
  }
  return params
}

export async function getTemplates(payload: QueryFind): Promise<QueryResult> {
  return templateCtrl.find(payload)
}
export async function getTemplate(templateId: string): Promise<Template> {
  const result = await templateCtrl.find({ filters: { id: templateId } })
  return result.data[0]
}
