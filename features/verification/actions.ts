'use server'

import { z } from 'zod'
import { State } from '@/types'
import { User } from '../user/interface'
import { Settings } from '../settings/interface'
import { getSettings } from '../settings/controller'
import verificationCtrl from './controller'
import { VerificationPurpose } from './interface'
import { toMinutes } from '@/lib/utils'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  userId: z.string({}),
  purpose: z.string({}),
  email: z.string({}).nullable().optional(),
  mobile: z.string({}).nullable().optional(),
  emailVerification: z.string({}).nullable().optional(),
  mobileVerification: z.string({}).nullable().optional(),
})

/**
 * update verify with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the verify dashboard.
 */

export async function verifyCodeAction(prevState: State, formData: FormData) {
  let resultEmailVerify, resultMobileVerify, resultVerify
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
    }
  }
  const {
    userId,
    emailVerification,
    mobileVerification,
    email,
    mobile,
    purpose,
  } = validatedFields.data
  if (emailVerification) {
    const isEmailVerifyCodetrue = await verificationCtrl.isVerifyCodewTrue({
      userId,
      plainCode: emailVerification,
      purpose,
      targetEmail: email,
      channel: 'email',
    })
    if (!isEmailVerifyCodetrue.success) return isEmailVerifyCodetrue
    resultVerify = await verificationCtrl.verifyCode({
      userId,
      plainCode: emailVerification,
      purpose,
      targetEmail: email,
      channel: 'email',
    })
  }
  if (mobileVerification) {
    const isMobileVerifyCodetrue = await verificationCtrl.isVerifyCodewTrue({
      userId,
      plainCode: mobileVerification,
      purpose,
      targetPhone: mobile,
      channel: 'sms',
    })
    if (!isMobileVerifyCodetrue.success) return isMobileVerifyCodetrue
    resultVerify = await verificationCtrl.verifyCode({
      userId,
      plainCode: mobileVerification,
      purpose,
      targetPhone: mobile,
      channel: 'sms',
    })
  }
  if (resultVerify?.success) {
    redirect('/login')
  }
  return resultVerify
}

export async function sendVerificationCode({
  purpose,
  user,
}: {
  purpose: VerificationPurpose
  user: User
}) {
  const settings: Settings = (await getSettings()) as Settings
  if (settings.emailVerificationRequired && !user.emailVerified) {
    const allowSend =
      await verificationCtrl.checkTimePassedRecentVerificationCode(
        user.id,
        'email',
        purpose
      )
    if (!allowSend.canSend) {
      return {
        message: `برای ارسال مجدد باید ${toMinutes(
          allowSend.remainingSeconds
        )} صبر کنید`,
        success: false,
      }
    }
    verificationCtrl.sendEmailVerificationCode({
      purpose,
      user,
    })
  }

  if (settings.mobileVerificationRequired && !user.mobileVerified) {
    const allowSend =
      await verificationCtrl.checkTimePassedRecentVerificationCode(
        user.id,
        'sms',
        purpose
      )
    if (!allowSend.canSend) {
      return {
        message: `برای ارسال مجدد باید ${toMinutes(
          allowSend.remainingSeconds
        )} صبر کنید`,
        success: false,
      }
    }
    verificationCtrl.sendMobileVerificationCode({
      purpose,
      user,
    })
  }
}

export async function updateVerificationEmail({
  userId,
  email,
  purpose,
}: {
  userId: string
  email: string
  purpose: VerificationPurpose
}) {
  const r = await verificationCtrl.updateVerificationEmail({
    userId,
    email,
    purpose,
  })

  return r
}
export async function updateVerificationMobile({
  userId,
  mobile,
  purpose,
}: {
  userId: string
  mobile: string
  purpose: VerificationPurpose
}) {
  const r = await verificationCtrl.updateVerificationMobile({
    userId,
    mobile,
    purpose,
  })

  return r
}
