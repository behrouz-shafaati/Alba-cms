'use server'

import { z } from 'zod'
import campaignCtrl from './controller'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import { Campaign, CampaignTranslationSchema } from './interface'
import { getSession } from '@/lib/auth'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'

const FormSchema = z.object({
  lang: z.string(),
  title: z.string().min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  startAt: z.string().nullable(),
  endAt: z.string().nullable(),
  placement: z
    .string()
    .min(1, { message: 'لطفا محل نمایش در صفحه  را تعیین کنید.' }),
  goalSections: z
    .string()
    .min(3, { message: 'لطفا بخش‌های هدف را تعیین کنید.' }),
  targetUrl: z.string().min(1, { message: 'لطفا لینک مقصد را وارد کنید.' }),
  priority: z.string().nullable(),
  description: z.string(),
  status: z.string().min(1, { message: 'لطفا وضعیت را تعیین کنید.' }),
  // banners آرایه‌ای از آبجکت‌هاست
  banners: z
    .array(
      z.object({
        aspect: z.string(),
        file: z.string().nullable(), // یا z.string().uuid() یا z.string().regex(...) اگه نیاز داری
      })
    )
    .optional(),
})

async function sanitizeData(validatedFields: any, id?: string | undefined) {
  let prevState = { translations: [] }
  console.log('#5554654 validatedFields :', validatedFields)
  if (id) {
    prevState = await campaignCtrl.findById({ id })
    console.log('#prevState 098776 :', prevState)
  }
  const session = (await getSession()) as Session
  const payload = validatedFields.data
  const user = session.user.id
  const translations = [
    {
      lang: payload.lang,
      banners: payload.banners,
    },
    ...prevState.translations.filter(
      (t: CampaignTranslationSchema) => t.lang != payload.lang
    ),
  ]
  const params = {
    ...payload,
    startAt: payload?.startAt != '' ? payload?.startAt : null,
    endAt: payload?.endAt != '' ? payload?.endAt : null,
    priority: Number(payload?.priority) || 0,
    goalSections: JSON.parse(payload.goalSections),
    translations,
    user,
  }

  return params
}

/**
 * Creates a campaign with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the campaign dashboard.
 */
export async function createCampaign(prevState: State, formData: FormData) {
  // Validate form fields

  const banners: any[] = []
  const aspects = formData.getAll('banners[][aspect]')
  const files = formData.getAll('banners[][file]')

  // ساخت آرایه banners با aspect و فایل متناظر
  for (let i = 0; i < aspects.length; i++) {
    const aspect = aspects[i]
    const fileId = files[i] || null
    banners.push({ aspect, file: fileId })
  }
  const rawValues = { ...Object.fromEntries(formData), banners }
  console.log('#234987 rawValues:', rawValues)

  const values = {
    ...rawValues,
    translation: {
      lang: rawValues.lang,
      banners: banners,
    },
  }
  try {
    const user = (await getSession())?.user as User
    await can(user.roles, 'campaign.create')
    const validatedFields = FormSchema.safeParse(rawValues)
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        values,
      }
    }

    const params = await sanitizeData(validatedFields)

    console.log('#jkkj params:', params)
    // Create the campaign
    await campaignCtrl.create({
      params,
    })
    // Revalidate the path and redirect to the campaign dashboard
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'campaign',
      slug: '/dashboard/campaigns',
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
  return {
    message: 'ذخیره شد',
    success: true,
    values,
  }
  // redirect('/dashboard/campaigns')
}

export async function updateCampaign(
  id: string,
  prevState: State,
  formData: FormData
) {
  const user = (await getSession())?.user as User

  const banners: any[] = []
  const aspects = formData.getAll('banners[][aspect]')
  const files = formData.getAll('banners[][file]')

  // ساخت آرایه banners با aspect و فایل متناظر
  for (let i = 0; i < aspects.length; i++) {
    const aspect = aspects[i]
    const fileId = files[i] || null
    banners.push({ aspect, file: fileId })
  }
  const rawValues = { ...Object.fromEntries(formData), banners }
  console.log('#234987 rawValues:', rawValues)

  const values = {
    ...rawValues,
    translation: {
      lang: rawValues.lang,
      banners: rawValues.banners,
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
    const prevCampaign = await campaignCtrl.findById({ id })
    await can(
      user.roles,
      prevCampaign.user !== user.id ? 'campaign.edit.any' : 'campaign.edit.own'
    )
    const params = await sanitizeData(validatedFields, id)
    await campaignCtrl.findOneAndUpdate({
      filters: id,
      params,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'campaign',
      slug: '/dashboard/campaigns',
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
  return {
    message: 'ذخیره شد',
    success: true,
    values,
  }
  // redirect('/dashboard/campaigns')
}

export async function deleteCampaignsAction(ids: string[]) {
  try {
    const user = (await getSession())?.user as User
    const prevCampaignResult = await campaignCtrl.findAll({
      filters: { _id: { $in: ids } },
    })
    for (const prevCampaign of prevCampaignResult.data) {
      await can(
        user.roles,
        prevCampaign.user !== user.id
          ? 'campaign.delete.any'
          : 'campaign.delete.own'
      )
    }
    await campaignCtrl.delete({ filters: ids })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'campaign',
      slug: '/dashboard/campaigns',
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

export async function getAllCampaigns(filters: any = {}) {
  return campaignCtrl.findAll({ filters })
}

export async function searchCampaigns(query: string, locale: string = 'fa') {
  const results = await campaignCtrl.find({ filters: { query } })
  return results
}
