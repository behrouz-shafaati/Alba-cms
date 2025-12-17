'use server'

import { z } from 'zod'
import settingsCtrl, { getSettings } from '@/features/settings/controller'
import { State } from '@/types'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { can } from '@/lib/utils/can.server'
import { User } from '@/features/user/interface'
import { AD } from './interface'
import fileCtrl from '@/lib/entity/file/controller'

const METADATA_KEY = 'ad'

const FormSchema = z.object({
  locale: z.string({}).nullable().optional(),
  //ad
  fallbackBehavior: z.string().nullable().optional(),
  targetUrl: z.string().nullable().optional(),
  // banners آرایه‌ای از آبجکت‌هاست
  banners: z
    .array(
      z.object({
        aspect: z.string(),
        file: z.string().nullable(), // یا z.string().uuid() یا z.string().regex(...) اگه نیاز داری
      })
    )
    .nullable()
    .optional(),
  // defaultHeaderId: z.string({}),
})

/**
 * update settings with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the settings dashboard.
 */

export async function updateAdSettings(prevState: State, formData: FormData) {
  const rawValues = Object.fromEntries(formData.entries())
  const validatedFields = FormSchema.safeParse(rawValues)

  try {
    const user = (await getSession())?.user as User
    await can(user.roles, 'settings.moderate.any')
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        success: false,
        values: rawValues,
      }
    }

    // ad
    const banners: any[] = []
    const aspects = formData.getAll('banners[][aspect]')
    const files = formData.getAll('banners[][file]')
    // ساخت آرایه banners با aspect و فایل متناظر
    for (let i = 0; i < aspects.length; i++) {
      const aspect = aspects[i]
      const fileId = files[i] || null
      const fileDetails = await fileCtrl.findById({ id: fileId })
      banners.push({ aspect, file: fileId, fileDetails })
    }

    const params = await sanitizeSettingsData({
      ...validatedFields.data,
      banners,
    })
    console.log('#234897 params:', params)
    await settingsCtrl.findOneAndUpdate({
      filters: { key: METADATA_KEY },
      params,
      options: { upsert: true }, // اگر نبود، بساز
    })
    // Revalidate the path
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'settings',
    })

    // console.log('#234876 revalidating settings paths:', pathes)
    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }

    return {
      message: 'تنظیمات با موفقیت بروز رسانی شد',
      success: true,
      values: params.value,
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
    console.log('Error in update settings:', error)
    return {
      message: 'خطای پایگاه داده: بروزرسانی مطلب ناموفق بود.',
      success: false,
    }
  }
}

async function sanitizeSettingsData(validatedFields: any) {
  const locale = validatedFields.locale
  // const session = (await getSession()) as Session
  // Create the settings
  const adSettings: AD = await getSettings(METADATA_KEY)
  const settingsPayload = validatedFields
  const bannersTranslations = [
    ...((adSettings?.translations || []).filter((t) => t?.lang !== locale) ||
      []),
    {
      lang: locale,
      banners: settingsPayload.banners,
    },
  ]

  const ad = {
    fallbackBehavior: settingsPayload?.fallbackBehavior || 'random',
    targetUrl: settingsPayload?.targetUrl || '#',
    translations: bannersTranslations,
  }

  const params = {
    value: ad,
  }

  return params
}
