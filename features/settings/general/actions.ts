'use server'

import { z } from 'zod'
import settingsCtrl, { getSettings } from '@/features/settings/controller'
import { State } from '@/types'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/get-session'
import { can } from '@/lib/utils/can.server'
import { User } from '@/features/user/interface'
import { General } from './interface'
import getTranslation from '@/lib/utils/getTranslation'
import fileCtrl from '@/lib/entity/file/controller'

const METADATA_KEY = 'general'

const FormSchema = z.object({
  locale: z.string({}).nullable().optional(),
  favicon: z.string({}).nullable().optional(),
  site_title: z.string({}).nullable().optional(),
  site_introduction: z.string({}).nullable().optional(),
  site_url: z.string({}).nullable().optional(),
  homePageId: z.string({}).nullable().optional(),
  termsPageId: z.string({}).nullable().optional(),
  privacyPageId: z.string({}).nullable().optional(),
})

/**
 * update settings with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the settings dashboard.
 */

export async function updateGeneralSettings(
  prevState: State,
  formData: FormData
) {
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

    const params = await sanitizeSettingsData(validatedFields.data)
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
      values: rawValues,
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
  const settings: General = await getSettings(METADATA_KEY)
  const settingsPayload = validatedFields
  // public
  const generalTranslation = getTranslation({
    translations: settings?.general?.translations || [],
    locale,
  })

  const generalTranslations = [
    ...((settings?.general?.translations || []).filter(
      (t) => t?.lang !== locale
    ) || []),
    {
      lang: locale,
      site_title:
        settingsPayload?.site_title || generalTranslation?.site_title || '',
      site_introduction:
        settingsPayload?.site_introduction ||
        generalTranslation?.site_introduction ||
        '',
      homePageId: settingsPayload?.homePageId
        ? settingsPayload?.homePageId
        : generalTranslation?.homePageId?.id || null,
      termsPageId: settingsPayload?.termsPageId
        ? settingsPayload?.termsPageId
        : generalTranslation?.termsPageId?.id || null,
      privacyPageId: settingsPayload?.privacyPageId
        ? settingsPayload?.privacyPageId
        : generalTranslation?.privacyPageId?.id || null,
    },
  ]

  const file = await fileCtrl.findById({ id: settingsPayload?.favicon })
  const params = {
    value: {
      translations: generalTranslations,
      site_url: settingsPayload?.site_url,
      favicon: settingsPayload?.favicon,
      faviconDetails: {
        id: file?.id,
        srcSmall: file?.srcSmall,
        srcMedium: file?.srcMedium,
        width: file?.width,
        height: file?.height,
      },
    },
  }

  return params
}
