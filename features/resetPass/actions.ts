'use server'

import { z } from 'zod'
import { toMinutes } from '@/lib/utils'
import { redirect } from 'next/navigation'
import userCtrl from '../user/controller'
import { detectIdentifierType } from '@/lib/utils'
import verificationCtrl from '../verification/controller'

const SendVerifyCodeResetPasFormSchema = z.object({
  identifier: z.string({}),
})

const resetPassVerifyCodeFormSchema = z.object({
  userId: z.string({}),
  purpose: z.string({}),
  identifier: z.string({}),
  verification: z.string({}),
  password: z.string({}),
  confirmPassword: z.string({}),
})

export async function SendVerifyCodeResetPassAction(
  prevState: string | undefined,
  formData: FormData
) {
  let user = null
  let resultSendResetPassVerifyCode = { success: false }
  const rawValues = Object.fromEntries(formData)
  // Validate form fields
  const validatedFields = SendVerifyCodeResetPasFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      values: rawValues,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
    }
  }
  const { identifier } = validatedFields.data
  try {
    user = await userCtrl.findOne({
      filters: { $or: [{ email: identifier }, { mobile: identifier }] },
    })
    console.log('#887 user:', user)
    if (!user)
      return {
        values: rawValues,
        message: 'کاربری با این اطلاعات وجود ندارد',
        success: false,
      }

    const identifierType = detectIdentifierType(identifier)
    if (identifierType == 'email') {
      const allowSend =
        await verificationCtrl.checkTimePassedRecentVerificationCode(
          user.id,
          'email',
          'password_reset'
        )
      if (!allowSend.canSend) {
        return {
          message: `برای ارسال مجدد باید ${toMinutes(
            allowSend.remainingSeconds
          )} صبر کنید`,
          success: false,
        }
      }
      resultSendResetPassVerifyCode =
        await verificationCtrl.sendEmailVerificationCode({
          purpose: 'password_reset',
          user,
        })
    } else if (identifierType == 'mobile') {
      const allowSend =
        await verificationCtrl.checkTimePassedRecentVerificationCode(
          user.id,
          'sms',
          'password_reset'
        )
      if (!allowSend.canSend) {
        return {
          message: `برای ارسال مجدد باید ${toMinutes(
            allowSend.remainingSeconds
          )} صبر کنید`,
          success: false,
        }
      }
      resultSendResetPassVerifyCode =
        await verificationCtrl.sendMobileVerificationCode({
          purpose: 'password_reset',
          user,
        })
    }
  } catch (error) {
    return {
      values: rawValues,
      message: 'ورود شما امکان پذیر نیست. با پشتیبانی تماس بگیرید',
      success: false,
    }
  }
  if (resultSendResetPassVerifyCode.success)
    redirect(
      '/resetPassVerification?identifier=' + identifier + '&user=' + user?.id
    )
  return resultSendResetPassVerifyCode
}

/**
 * update verify with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the verify dashboard.
 */

export async function resetPassVerifyCodeAction(
  prevState: State,
  formData: FormData
) {
  let resultVerify
  const rawValues = Object.fromEntries(formData)
  const validatedFields = resetPassVerifyCodeFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      values: rawValues,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
      success: false,
    }
  }
  const {
    userId,
    verification,
    identifier,
    purpose,
    password,
    confirmPassword,
  } = validatedFields.data

  if (password !== confirmPassword) {
    return {
      values: rawValues,
      message: 'تایید رمز عبور با رمز عبور برابر نیست.',
      success: false,
    }
  }

  const identifierType = detectIdentifierType(identifier)
  if (identifierType == 'email') {
    const params = {
      userId,
      plainCode: verification,
      purpose,
      targetEmail: identifier,
      channel: 'email',
    }
    const isEmailVerifyCodetrue = await verificationCtrl.isVerifyCodewTrue(
      params
    )
    if (!isEmailVerifyCodetrue.success) return isEmailVerifyCodetrue
    resultVerify = await verificationCtrl.setVerifyCodeUsed(params)
  }
  if (identifierType == 'mobile') {
    const params = {
      userId,
      plainCode: verification,
      purpose,
      targetPhone: identifier,
      channel: 'sms',
    }
    const isMobileVerifyCodetrue = await verificationCtrl.isVerifyCodewTrue(
      params
    )
    if (!isMobileVerifyCodetrue.success) return isMobileVerifyCodetrue
    resultVerify = await verificationCtrl.verifyCode(params)
  }
  if (resultVerify?.success) {
    await userCtrl.updatePassword({ userId, password })
    redirect('/login')
  }
  return { values: rawValues, ...resultVerify }
}
