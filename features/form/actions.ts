'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import formCtrl from '@/features/form/controller'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import { getSession } from '@/lib/auth'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { Form, FormField } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'
import { PostTranslationSchema } from '../post/interface'
import { extractFieldsFromFormContent } from './utils'

const FormSchema = z.object({
  contentJson: z.string({}),
})

/**
 * Creates a Form with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the Form dashboard.
 */
export async function createForm(prevState: State, formData: FormData) {
  let newForm = null
  // Validate form fields
  const rawValues = Object.fromEntries(formData)

  const content = JSON.parse(rawValues?.contentJson)
  const values = {
    ...rawValues,
    title: content?.title || '', // for generate slug
    type: content.type,
    templateFor: content.templateFor,
    status: content.status,
    translation: {
      lang: content?.lang || 'fa',
      title: content?.title || '',
      successMessage: content?.successMessage,
      fields: extractFieldsFromFormContent(content),
      content,
    },
  }
  try {
    const user = (await getSession())?.user as User
    await can(user.roles, 'form.create')
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

    const params = await sanitizeFormData(validatedFields)

    // Create the Form
    newForm = await formCtrl.create({
      params,
    })

    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'form',
      slug: [`/dashboard/forms`],
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
    console.log('Error in create form part:', error)
    return {
      message: 'خطای پایگاه داده: ایجاد فرم ناموفق بود.',
      success: false,
      values,
    }
  }
  if (newForm) {
    // redirect(`/dashboard/forms/${newForm.id}`)
    return {
      message: '',
      success: true,
      isCreatedJustNow: true,
      values: newForm,
    }
  }
  redirect('/dashboard/forms')
}

export async function updateForm(
  id: string,
  prevState: State,
  formData: FormData
) {
  let params = {},
    updatedPage = {}
  const rawValues = Object.fromEntries(formData.entries())

  const content = JSON.parse(rawValues?.contentJson)
  const values = {
    ...rawValues,
    title: content?.title || '', // for generate slug
    type: content.type,
    templateFor: content.templateFor,
    status: content.status,
    fields: extractFieldsFromFormContent(content),
    translation: {
      lang: content?.lang || 'fa',
      title: content?.title || '',
      successMessage: content?.successMessage,
    },
    content,
  }
  try {
    const user = (await getSession())?.user as User
    const prevForm = await formCtrl.findById({ id })
    await can(
      user.roles,
      prevForm.user !== user.id ? 'form.edit.any' : 'form.edit.own'
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

    params = await sanitizeFormData(validatedFields)

    console.log('$$$$$$$$#534543 params:', params.fields)

    // if is home Form so revalidate home Form

    updatedPage = await formCtrl.findOneAndUpdate({
      filters: id,
      params,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'form',
      slug: [`/dashboard/forms`],
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
    console.log('Error in update form part:', error)
    return { message: 'خطای پایگاه داده: بروزرسانی فرم ناموفق بود.' }
  }

  return {
    message: 'بروزرسانی با موفقیت انجام شد',
    success: true,
    values: { ...updatedPage, translation: params?.translations[0] },
  }
}

export async function deleteFormAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevFormResult = await formCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevForm of prevFormResult.data) {
      await can(
        user.roles,
        prevForm.user !== user.id ? 'form.delete.any' : 'form.delete.own'
      )
    }

    await formCtrl.delete({ filters: ids })
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in delete form part:', error)
    return { message: 'خطای پایگاه داده: حذف فرم ناموفق بود' }
  }
  const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
    feature: 'form',
    slug: [`/dashboard/forms`],
  })

  for (const slug of pathes) {
    // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
    revalidatePath(slug)
  }
}

export async function getAllForms() {
  return formCtrl.findAll({})
}

async function sanitizeFormData(validatedFields: any, id?: string | undefined) {
  let prevState: Form = { translations: [] },
    preFields: FormField[] = []
  if (id) {
    prevState = await formCtrl.findById({ id })
    preFields = prevState.fields
    console.log('#prevState 098776 :', prevState)
  }
  const session = (await getSession()) as Session

  const user = session.user.id

  const content = JSON.parse(validatedFields.data.contentJson)
  const fields = extractFieldsFromFormContent(content)
  const formTranslations = [
    ...prevState.translations.filter(
      (t: PostTranslationSchema) => t.lang != content.lang
    ),
    {
      lang: content?.lang || 'fa',
      successMessage: content?.successMessage,
    },
  ]

  const params = {
    content,
    title: content.title,
    fields,
    translations: formTranslations,
    status: content.status,
    user,
  }
  return params
}

export async function getForms(payload: QueryFind): Promise<QueryResult> {
  return formCtrl.find(payload)
}
export async function getForm(formId: string): Promise<Form> {
  const result = await formCtrl.find({
    filters: { id: formId },
  })
  return result.data[0]
}
