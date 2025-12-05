'use server'

import { z } from 'zod'
import settingsCtrl, { getSettings } from '@/features/settings/controller'
import { State } from '@/types'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'
import { Settings } from './interface'
import { getTranslation } from '@/lib/utils'

const FormSchema = z.object({
  homePageId: z.string({}).nullable().optional(),
  termsPageId: z.string({}).nullable().optional(),
  privacyPageId: z.string({}).nullable().optional(),
  commentApprovalRequired: z.string({}).nullable().optional(),
  emailVerificationRequired: z.string({}).nullable().optional(),
  mobileVerificationRequired: z.string({}).nullable().optional(),
  mail_host: z.string({}).nullable().optional(),
  mail_port: z.string({}).nullable().optional(),
  mail_username: z.string({}).nullable().optional(),
  mail_password: z.string({}).nullable().optional(),
  farazsms_apiKey: z.string({}).nullable().optional(),
  farazsms_verifyPatternCode: z.string({}).nullable().optional(),
  farazsms_from_number: z.string({}).nullable().optional(),
  favicon: z.string({}).nullable().optional(),
  site_title: z.string({}).nullable().optional(),
  site_introduction: z.string({}).nullable().optional(),
  site_url: z.string({}).nullable().optional(),
  desktopHeaderHeight: z.string({}).nullable().optional(),
  tabletHeaderHeight: z.string({}).nullable().optional(),
  mobileHeaderHeight: z.string({}).nullable().optional(),
  //ad
  fallbackBehavior: z.string().nullable().optional(),
  targetUrl: z.string().nullable().optional(),
  defaultRoles: z.string().nullable().optional(),
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

export async function updateSettings(prevState: State, formData: FormData) {
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  try {
    const user = (await getSession())?.user as User
    await can(user.roles, 'settings.moderate.any')
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        success: false,
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
      banners.push({ aspect, file: fileId })
    }

    const prevSettings = (await getSettings()) as Settings
    const params = await sanitizeSettingsData({
      ...prevSettings,
      ...prevSettings?.infoTranslations,
      ...prevSettings?.farazsms,
      ...prevSettings?.ad,
      ...prevSettings?.ad?.translations.map((t) => ({
        locale: t.lang,
        banners: t.banners.map((b) => ({
          aspect: b?.aspect,
          file: b.file?.id || b.file,
        })),
      })),
      banners,
      ...validatedFields.data,
    })
    await settingsCtrl.findOneAndUpdate({
      filters: { type: 'site-settings' },
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

    return { message: 'فایل با موفقیت بروز رسانی شد', success: true }
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

export async function deleteSettings(id: string) {
  try {
    await settingsCtrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف مطلب ناموفق بود', success: false }
  }
  await settingsCtrl.delete({ filters: [id] })
  // Revalidate the path
  const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
    feature: 'settings',
    slug: [`/dashboard/settingss`],
  })

  for (const slug of pathes) {
    // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
    revalidatePath(slug)
  }
}

export async function getSettingsAction(key: string = '') {
  return getSettings(key)
}

async function sanitizeSettingsData(validatedFields: any) {
  const locale = 'fa'
  // const session = (await getSession()) as Session
  // Create the settings
  const siteSettings = await getSettings()

  // sms
  const settingsPayload = validatedFields
  // console.log('#@3423432 vsettingsPayload:', settingsPayload)
  const farazsms = {
    farazsms_apiKey: settingsPayload?.farazsms_apiKey,
    farazsms_verifyPatternCode: settingsPayload?.farazsms_verifyPatternCode,
    farazsms_from_number: settingsPayload?.farazsms_from_number,
  }

  // public
  const infoTranslation = getTranslation({
    translations: siteSettings?.infoTranslations || [],
    locale,
  })
  const infoTranslations = [
    ...((siteSettings?.infoTranslations || []).filter(
      (t) => t?.lang !== locale
    ) || []),
    {
      lang: locale,
      site_title:
        settingsPayload?.site_title || infoTranslation?.site_title || '',
      site_introduction:
        settingsPayload?.site_introduction ||
        infoTranslation?.site_introduction ||
        '',
    },
  ]

  // pages
  const pageTranslation = getTranslation({
    translations: siteSettings?.pageTranslations || [],
    locale,
  })
  const pageTranslations = [
    ...((siteSettings?.pageTranslations || []).filter(
      (t) => t?.lang !== locale
    ) || []),
    {
      lang: locale,
      homePageId: settingsPayload?.homePageId
        ? settingsPayload?.homePageId
        : pageTranslation?.homePageId?.id || null,
      termsPageId: settingsPayload?.termsPageId
        ? settingsPayload?.termsPageId
        : pageTranslation?.termsPageId?.id || null,
      privacyPageId: settingsPayload?.privacyPageId
        ? settingsPayload?.privacyPageId
        : pageTranslation?.privacyPageId?.id || null,
    },
  ]

  const bannersTranslations = [
    ...((siteSettings?.ad?.translations || []).filter(
      (t) => t?.lang !== locale
    ) || []),
    {
      lang: locale,
      banners: settingsPayload.banners,
    },
  ]

  const user = {
    defaultRoles: settingsPayload?.defaultRoles
      ? JSON.parse(settingsPayload.defaultRoles).map((role: any) => role.value)
      : settingsPayload.user?.defaultRoles ?? [],
  }

  const ad = {
    fallbackBehavior: settingsPayload?.fallbackBehavior || 'random',
    targetUrl: settingsPayload?.targetUrl || '',
    translations: bannersTranslations,
  }

  const params = {
    ...settingsPayload,
    commentApprovalRequired:
      settingsPayload?.commentApprovalRequired == 'on' ||
      settingsPayload?.commentApprovalRequired == true
        ? true
        : false,
    emailVerificationRequired:
      settingsPayload?.emailVerificationRequired == 'on' ||
      settingsPayload?.emailVerificationRequired == true
        ? true
        : false,
    mobileVerificationRequired:
      settingsPayload?.mobileVerificationRequired == 'on' ||
      settingsPayload?.mobileVerificationRequired == true
        ? true
        : false,
    favicon: settingsPayload?.favicon?.id
      ? settingsPayload?.favicon?.id
      : siteSettings?.favicon || null,
    pageTranslations,
    farazsms,
    infoTranslations,
    ad,
    user,
  }
  return params
}
