import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import verifySchema from './schema'
import verifyService from './service'
import { generateNumericCode, hashWithSalt, makeSalt } from './utils'
import { VerificationChannel, VerificationPurpose } from './interface'
import { User } from '../user/interface'
import { Settings } from '../settings/interface'
import { getSettings } from '../settings/controller'
import mongoose from 'mongoose'
import userCtrl from '../user/controller'
import { z } from 'zod'
import { getMailTemplate, sendEmail } from '@/lib/mailer'
import { getTranslation, toMinutes } from '@/lib/utils'

import crypto from 'crypto'
import { sendSms, sendSmsVerify } from '@/lib/sendSMS/smsSender'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the verifyController class extended of the main parent class baseController.
   *
   * @param service - verifyService
   *verifyCtrl
   * @beta
   */
  constructor(service: any) {
    super(service)
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {}
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value != 'string') continue
      if (
        key == 'userName' ||
        key == 'fullName' ||
        key == 'email' ||
        key == 'mobile'
      )
        filters[key] = { $regex: new RegExp(value, 'i') }
      if (key == 'query' && filters?.query == '') {
        delete filters.query
      } else if (key == 'query') {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ['$title', '$content'],
            },
            regex: filters.query,
            options: 'i',
          },
        }
        delete filters.query
      }

      if (key == 'id') {
        filters._id = value
        delete filters.id
      }
    }
    return filters
  }

  async verificationRequired({ user }: { user: User }) {
    const settings: Settings = (await getSettings()) as Settings
    if (
      (settings.emailVerificationRequired && !user.emailVerified) ||
      (settings.mobileVerificationRequired && !user.mobileVerified)
    ) {
      return true
    }
    return false
  }

  /**
   * ایجاد کد و ذخیره در DB
   */
  async createVerificationCode(opts: {
    userId: string
    targetEmail?: string
    targetPhone?: string
    purpose?: VerificationPurpose
    channel?: VerificationChannel
    codeLength?: number
    ttlSeconds?: number // مثلا 15*60 برای 15 دقیقه
    maxAttempts?: number
    ip?: string
    userAgent?: string
    metadata?: Record<string, any>
  }) {
    const {
      userId,
      targetEmail,
      targetPhone,
      purpose = 'signup',
      channel = targetPhone ? 'sms' : 'email',
      codeLength = 6,
      ttlSeconds = 15 * 60,
      maxAttempts = 5,
      ip,
      userAgent,
      metadata,
    } = opts

    const plainCode = generateNumericCode(codeLength)
    const salt = makeSalt()
    const hashedCode = hashWithSalt(String(plainCode), salt)
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000)

    const params = {
      user: userId,
      targetEmail: targetEmail ?? null,
      targetPhone: targetPhone ?? null,
      hashedCode,
      salt,
      codeLength,
      purpose,
      channel,
      used: false,
      attempts: 0,
      maxAttempts,
      expiresAt,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
      metadata: metadata ?? {},
    }

    const doc = await this.create({ params })
    // بازگرداندن plainCode تا ارسال شود (SMS/Email) — فقط همین جا plain وجود دارد
    return { doc, plainCode }
  }

  async isVerifyCodewTrue(opts: {
    userId: string
    targetEmail?: string
    targetPhone?: string
    purpose?: any
    channel: VerificationChannel
    plainCode: string
  }) {
    const {
      userId,
      targetEmail,
      targetPhone,
      purpose = 'signup',
      channel,
      plainCode,
    } = opts
    let channelTitle = ''
    // پیدا کردن آخرین کد صادرشده (که used=false و منقضی نشده)
    const filters: any = {
      user: userId,
      purpose,
      used: false,
      channel,
    }
    if (channel == 'email') {
      filters.targetEmail = targetEmail.toLowerCase()
      channelTitle = 'ایمیل'
    }
    if (channel == 'sms') {
      filters.targetPhone = targetPhone
      channelTitle = 'موبایل'
    }

    const codeDocResult = await this.find({ filters, sort: { createdAt: -1 } })
    const codeDoc = codeDocResult.data[0]
    if (!codeDoc)
      return {
        success: false,
        reason: 'not_found',
        message: `کد احراز ${channelTitle} اشتباه است`,
      }

    if (codeDoc.expiresAt <= new Date()) {
      return { success: false, reason: 'expired', message: 'کد منقضی شده است' }
    }

    if (codeDoc.attempts >= codeDoc.maxAttempts) {
      return {
        success: false,
        reason: 'too_many_attempts',
        message: 'کد منقضی شده است',
      }
    }
    const match = this.compareCode(codeDoc, plainCode)
    console.log('## plainCode:', plainCode)
    console.log('## match:', match)
    if (!match) {
      // افزایش شمارش تلاش‌ها
      const attempts = codeDoc.attempts + 1
      await this.findOneAndUpdate({
        filters: { _id: codeDoc._id },
        params: { attempts },
      })

      const attemptsLeft = codeDoc.maxAttempts - codeDoc.attempts
      return {
        success: false,
        reason: 'wrong_code',
        message: `کد اشتباه است. تلاش باقی مانده: ${attemptsLeft}`,
      }
    }

    return { success: true, filters, codeDoc }
  }

  compareCode(doc: any, plain: string) {
    const hash = crypto
      .createHmac('sha256', doc.salt)
      .update(String(plain))
      .digest('hex')
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(doc.hashedCode, 'hex')
    )
  }
  /**
   * اعتبارسنجی کد
   */
  async verifyCode(opts: {
    userId: string
    targetEmail?: string
    targetPhone?: string
    purpose?: any
    plainCode: string
    channel: VerificationChannel
  }) {
    const {
      userId,
      targetEmail,
      targetPhone,
      purpose = 'signup',
      plainCode,
      channel,
    } = opts

    const resultCheckCode = await this.isVerifyCodewTrue(opts)
    if (!resultCheckCode.success) return resultCheckCode

    const { filters, codeDoc } = resultCheckCode

    // در صورت تطابق: علامت زدن به عنوان used
    await this.findOneAndUpdate({
      filters: { _id: codeDoc._id },
      params: { used: true },
    })
    if (channel == 'email') {
      // اگر کاربری از قبل این ایمیل را ثبت کرده اما احراز نکرده آن را برمیداریم
      await userCtrl.findOneAndUpdate({
        filters: {
          id: { $ne: userId },
          email: targetEmail,
          emailVerified: false,
        },
        params: { email: null },
      })
      await userCtrl.findOneAndUpdate({
        filters: { id: userId },
        params: { email: targetEmail, emailVerified: true },
      })
    }

    console.log('#####--- channel:', channel)
    if (channel == 'sms') {
      await userCtrl.findOneAndUpdate({
        filters: {
          id: { $ne: userId },
          mobile: targetPhone,
          mobileVerified: false,
        },
        params: { mobile: null },
      })
      await userCtrl.findOneAndUpdate({
        filters: { id: userId },
        params: { mobile: targetPhone, mobileVerified: true },
      })
    }
    return { success: true, message: 'احراز با موفقیت انجام شد' }
  }
  /**
   * اعتبارسنجی کد
   */
  async setVerifyCodeUsed(opts: {
    userId: string
    targetEmail?: string
    targetPhone?: string
    purpose?: any
    plainCode: string
    channel: VerificationChannel
  }) {
    const { userId, targetEmail, targetPhone, purpose, plainCode, channel } =
      opts

    const resultCheckCode = await this.isVerifyCodewTrue(opts)
    if (!resultCheckCode.success) return resultCheckCode

    const { filters, codeDoc } = resultCheckCode

    // در صورت تطابق: علامت زدن به عنوان used
    await this.findOneAndUpdate({
      filters: { _id: codeDoc._id },
      params: { used: true },
    })
    return { success: true, message: 'کد به حالت استفاده شده تغییر کرد' }
  }

  async find(payload: QueryFind) {
    console.log('#3033 payload:', payload)
    payload.filters = this.standardizationFilters(payload.filters)
    console.log('#3034 payload:', payload)
    const result = await super.find(payload)
    return result
  }

  async create(payload: Create) {
    console.log('#389 payload:', payload)
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    return super.findOneAndUpdate(payload)
  }

  async checkTimePassedRecentVerificationCode(
    userId: string,
    channel: VerificationChannel,
    purpose: string
  ): Promise<{ canSend: boolean; remainingSeconds: number }> {
    const interruption_min = 2
    const fiveMinutesAgo = new Date(Date.now() - interruption_min * 60 * 1000)

    // پیدا کردن آخرین کد ارسالی در ۵ دقیقه اخیر
    const recentCode = await this.find({
      filters: {
        user: new mongoose.Types.ObjectId(userId),
        channel,
        purpose,
        createdAt: { $gte: fiveMinutesAgo },
      },
      sort: { createdAt: -1 }, // جدیدترین رکورد
    })

    if (recentCode.data.length == 0) {
      // یعنی ۵ دقیقه گذشته یا کدی وجود نداره
      return { canSend: true, remainingSeconds: 0 }
    }

    // محاسبه مدت زمانی که از ساخت کد گذشته
    const now = Date.now()
    const createdAt = new Date(recentCode.data[0].createdAt).getTime()
    const diffMs = now - createdAt
    const totalWaitMs = interruption_min * 60 * 1000
    const remainingMs = Math.max(totalWaitMs - diffMs, 0)
    console.log('#2340923874 remainingMs:', remainingMs)
    return {
      canSend: remainingMs <= 0,
      remainingSeconds: Math.ceil(remainingMs / 1000),
    }
  }

  async updateVerificationEmail({
    userId,
    email,
    purpose,
  }: {
    userId: string
    email: string
    purpose: VerificationPurpose
  }) {
    let foundUser = await userCtrl.findOne({
      filters: { email: email, emailVerified: true },
    })
    if (foundUser) {
      return {
        code: 'invalid_type',
        expected: 'string',
        received: 'string',
        path: ['email'],
        message: 'ایمیل تکراری است.',
        success: false,
      }
    }
    const allowSend =
      await verificationCtrl.checkTimePassedRecentVerificationCode(
        userId,
        'email',
        purpose
      )
    if (!allowSend.canSend) {
      return {
        code: 'invalid_type',
        expected: 'string',
        received: 'string',
        path: ['email'],
        message: `برای ارسال مجدد باید ${toMinutes(
          allowSend.remainingSeconds
        )} صبر کنید`,
        success: false,
      }
    }
    const settings = (await getSettings()) as Settings
    const siteInfo = getTranslation({
      translations: settings?.infoTranslations || [],
    })
    const { doc, plainCode } = await verificationCtrl.createVerificationCode({
      userId,
      channel: 'email',
      codeLength: 6,
      purpose,
      targetEmail: email,
    })

    try {
      await sendEmail(
        email,
        `${siteInfo?.site_title} - اعتبار سنجی ایمیل`,
        getMailTemplate(siteInfo?.site_title, plainCode, 'fa')
      )
      return {
        message: `ایمیل اعتبار سنجی با موفقیت ارسال شد`,
        success: true,
      }
    } catch (error) {
      return {
        message: 'ارسال ایمیل اعتبار سنجی ناموفق بود',
        success: false,
      }
    }
  }
  async updateVerificationMobile({
    userId,
    mobile,
    purpose,
  }: {
    userId: string
    mobile: string
    purpose: VerificationPurpose
  }) {
    let foundUser = await userCtrl.findOne({
      filters: { mobile: mobile, mobileVerified: true },
    })
    if (foundUser) {
      return {
        code: 'invalid_type',
        expected: 'string',
        received: 'string',
        path: ['mobile'],
        message: 'موبایل تکراری است.',
        success: false,
      }
    }
    const allowSend =
      await verificationCtrl.checkTimePassedRecentVerificationCode(
        userId,
        'sms',
        purpose
      )
    if (!allowSend.canSend) {
      return {
        code: 'invalid_type',
        expected: 'string',
        received: 'string',
        path: ['mobile'],
        message: `برای ارسال مجدد باید ${toMinutes(
          allowSend.remainingSeconds
        )} صبر کنید`,
        success: false,
      }
    }
    const settings = (await getSettings()) as Settings
    const { doc, plainCode } = await verificationCtrl.createVerificationCode({
      userId,
      channel: 'sms',
      codeLength: 6,
      purpose,
      targetPhone: mobile,
    })

    try {
      await sendSmsVerify(mobile, plainCode)
      return {
        message: `پیامک اعتبار سنجی با موفقیت ارسال شد`,
        success: true,
      }
    } catch (error) {
      return {
        message: 'ارسال پیامک اعتبار سنجی ناموفق بود',
        success: false,
      }
    }
  }

  async sendEmailVerificationCode({
    purpose,
    user,
  }: {
    purpose: VerificationPurpose
    user: User
  }) {
    const settings = (await getSettings()) as Settings
    const siteInfo = getTranslation({
      translations: settings?.infoTranslations || [],
    })
    const { doc, plainCode } = await verificationCtrl.createVerificationCode({
      userId: user.id,
      channel: 'email',
      codeLength: 6,
      purpose,
      targetEmail: user?.email,
    })

    try {
      await sendEmail(
        user?.email,
        `${siteInfo?.site_title} - اعتبار سنجی ایمیل`,
        getMailTemplate(siteInfo?.site_title, plainCode, 'fa')
      )
      return {
        message: `ایمیل اعتبار سنجی با موفقیت ارسال شد`,
        success: true,
      }
    } catch (error) {
      return {
        message: 'ارسال ایمیل اعتبار سنجی ناموفق بود',
        success: false,
      }
    }
  }
  async sendMobileVerificationCode({
    purpose,
    user,
  }: {
    purpose: VerificationPurpose
    user: User
  }) {
    const settings = (await getSettings()) as Settings
    const { doc, plainCode } = await verificationCtrl.createVerificationCode({
      userId: user.id,
      channel: 'sms',
      codeLength: 6,
      purpose,
      targetPhone: user?.mobile,
    })

    try {
      console.log('$------------------ plainCode:', plainCode)
      const resultSendSMS = await sendSmsVerify(user?.mobile, plainCode)
      console.log('$------------------ resultSendSMS:', resultSendSMS)
      if (resultSendSMS.success) {
        return resultSendSMS
      }
      return {
        message: `پیامک اعتبار سنجی با موفقیت ارسال شد`,
        success: true,
      }
    } catch (error) {
      return {
        message: 'ارسال پیامک اعتبار سنجی ناموفق بود',
        success: false,
      }
    }
  }
}

const verificationCtrl = new controller(new verifyService(verifySchema))
export default verificationCtrl

/**
 * Fetch site verify and return either the full verify object
 * or a specific value by key.
 *
 * @param {string} [key=''] - The key of the setting to retrieve.
 * If omitted or empty, the full verify object is returned.
 * @returns {Promise<Record<string, unknown> | unknown | null>}
 * - If no key is provided, returns the full verify object.
 * - If a key is provided, returns the value for that key or null if not found.
 */
export const getVerify = async (
  key: string = ''
): Promise<Record<string, unknown> | unknown | null> => {
  const result = await verifyCtrl.find({
    filters: { type: 'site-verify' },
  })

  const verify: Record<string, unknown> = result?.data?.[0] ?? {}

  if (!key) {
    return verify
  }

  return Object.prototype.hasOwnProperty.call(verify, key) ? verify[key] : null
}
