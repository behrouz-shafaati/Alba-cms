'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import formSubmissionCtrl from '@/features/form-submission/controller'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import { getSession } from '@/lib/auth'
import { QueryFind, QueryResult } from '@/lib/entity/core/interface'
import { FormSubmission } from './interface'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'
import { PostTranslationSchema } from '../post/interface'
import formCtrl from '../form/controller'
import { getTranslation } from '@/lib/utils'
import { Form } from '../form/interface'

const FormSubmissionSchema = z.object({
  contentJson: z.string({}),
})

/**
 * Creates a FormSubmission with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the Form dashboard.
 */
export async function createFormSubmission(
  prevState: State,
  formData: FormData
) {
  const locale = 'fa'
  let newFormSubmission = null
  const values = Object.fromEntries(formData)
  try {
    const user = (await getSession())?.user as User
    await can(user.roles, 'formSubmission.create')
    // const validatedFields = FormSubmissionSchema.safeParse(rawValues)
    // If formSubmission validation fails, return errors early. Otherwise, continue.
    // if (!validatedFields.success) {
    //   return {
    //     errors: validatedFields.error.flatten().fieldErrors,
    //     message: 'لطفا فیلدهای لازم را پر کنید.',
    //     success: false,
    //     values,
    //   }
    // }

    const params = await sanitizeFormSubmissionData(formData)

    // Create the FormSubmission
    newFormSubmission = await formSubmissionCtrl.create({
      params,
    })

    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'formSubmission',
      slug: [`/dashboard/formSubmissions`],
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
    if (error.message === 'NotFounForm') {
      return {
        success: false,
        status: 403,
        message: 'فرم ارسالی وجود ندارد',
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
    console.log('Error in create formSubmission part:', error)
    return {
      message: 'خطای پایگاه داده: ایجاد فرم ناموفق بود.',
      success: false,
      values,
    }
  }
  if (newFormSubmission) {
    // redirect(`/dashboard/formSubmissions/${newFormSubmission.id}`)
    return {
      message: '',
      success: true,
      isCreatedJustNow: true,
      values: newFormSubmission,
    }
  }
}

export async function updateFormSubmissionStatusAction(
  id: string,
  status: 'read' | 'unread'
) {
  await formSubmissionCtrl.findOneAndUpdate({
    filters: id,
    params: { status },
  })
  return {
    message: 'بروزرسانی با موفقیت انجام شد',
    success: true,
    values: {},
  }
}

export async function updateFormSubmission(
  id: string,
  prevState: State,
  formData: FormData
) {
  let params = {},
    updatedPage = {}
  const values = Object.fromEntries(formData)

  try {
    const user = (await getSession())?.user as User
    const prevFormSubmission = await formSubmissionCtrl.findById({ id })
    await can(
      user.roles,
      prevFormSubmission.user !== user.id
        ? 'formSubmission.edit.any'
        : 'formSubmission.edit.own'
    )
    // const validatedFields = FormSubmissionSchema.safeParse(rawValues)
    // // If formSubmission validation fails, return errors early. Otherwise, continue.
    // if (!validatedFields.success) {
    //   return {
    //     errors: validatedFields.error.flatten().fieldErrors,
    //     message: 'لطفا فیلدهای لازم را پر کنید.',
    //     success: false,
    //     values,
    //   }
    // }

    params = await sanitizeFormSubmissionData(formData)

    // if is home FormSubmission so revalidate home FormSubmission

    await formSubmissionCtrl.findOneAndUpdate({
      filters: id,
      params,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'formSubmission',
      slug: [`/dashboard/formSubmissions`],
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
    console.log('Error in update formSubmission part:', error)
    return { message: 'خطای پایگاه داده: بروزرسانی فرم ناموفق بود.' }
  }

  return {
    message: 'بروزرسانی با موفقیت انجام شد',
    success: true,
    values: { ...updatedPage, translation: params?.translations[0] },
  }
}

export async function deleteFormSubmissionAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevFormSubmissionResult = await formSubmissionCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevFormSubmission of prevFormSubmissionResult.data) {
      await can(
        user.roles,
        prevFormSubmission.user !== user.id
          ? 'formSubmission.delete.any'
          : 'formSubmission.delete.own'
      )
    }

    await formSubmissionCtrl.delete({ filters: ids })
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        success: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
        values,
      }
    }
    if (error.message === 'NotFounForm') {
      return {
        success: false,
        status: 403,
        message: 'فرم ارسالی وجود ندارد',
        values,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('Error in delete formSubmission part:', error)
    return { message: 'خطای پایگاه داده: حذف فرم ناموفق بود' }
  }
  const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
    feature: 'formSubmission',
    slug: [`/dashboard/formSubmissions`],
  })

  for (const slug of pathes) {
    // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
    revalidatePath(slug)
  }
}

export async function getAllFormSubmissions() {
  return formSubmissionCtrl.findAll({})
}

async function sanitizeFormSubmissionData(
  formData: FormData,
  id?: string | undefined
) {
  const locale = 'fa'
  let rawValues, translations
  rawValues = Object.fromEntries(formData)
  // check exist form
  const formId = formData.get('form')
  const form: Form = await formCtrl.findById({ id: formId })
  if (!form) new Error('NotFounForm')

  const formInputValues = {}
  for (const field of form.fields) {
    formInputValues[field.name] = formData.get(field.name) || ''
  }

  const searchText = Object.values(formInputValues).join(' ')

  const FormSubmissionTranslation = {
    lang: locale,
    values: formInputValues,
    searchText,
  }

  let prevState = { translations: [] }
  if (id) {
    prevState = await formSubmissionCtrl.findById({ id })
  }
  const session = (await getSession()) as Session

  const user = session?.user?.id || null

  translations = [
    FormSubmissionTranslation,
    ...prevState.translations.filter(
      (t: PostTranslationSchema) => t.lang != locale
    ),
  ]
  const params = {
    ...rawValues,
    senderLocale: locale,
    user,
    translations,
  }
  return params
}

export async function getFormSubmissions(
  payload: QueryFind
): Promise<QueryResult> {
  return formSubmissionCtrl.find(payload)
}
export async function getFormSubmission(
  formSubmissionId: string
): Promise<FormSubmission> {
  const result = await formSubmissionCtrl.find({
    filters: { id: formSubmissionId },
  })
  return result.data[0]
}
