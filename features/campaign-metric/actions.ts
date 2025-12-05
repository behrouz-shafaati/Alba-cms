'use server'

import { z } from 'zod'
import campaignCtrl from './controller'
import { redirect } from 'next/navigation'
import { Session, State } from '@/types'
import { getSession } from '@/lib/auth'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'
import { User } from '../user/interface'
import { can } from '@/lib/utils/can.server'

const FormSchema = z.object({
  lang: z.string(),
  title: z.string().min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  startAt: z.string().min(1, { message: 'لطفا بازه اجرا را تعیین کنید.' }),
  endAt: z.string(),
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

  const params = {
    ...payload,
    priority: Number(payload?.priority) || 0,
    goalSections: JSON.parse(payload.goalSections),
    user,
  }

  return params
}
