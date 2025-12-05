import { getSettings } from '@/features/settings/controller'
import { Settings } from '@/features/settings/interface'
import axios from 'axios'

const FARAZ_SMS_API_KEY = process.env.FARAZ_SMS_API_KEY // کلید API
const FARAZ_SMS_SENDER = process.env.FARAZ_SMS_SENDER // شماره ارسال‌کننده (مثلاً خط خدماتی)

// export async function sendSms(to: string, message: string) {
//   try {
//     const response = await axios.post(
//       'https://rest.ippanel.com/v1/messages',
//       {
//         originator: FARAZ_SMS_SENDER,
//         recipients: [to],
//         message: message,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `AccessKey ${FARAZ_SMS_API_KEY}`,
//         },
//       }
//     )

//     return response.data
//   } catch (error: any) {
//     console.error('SMS Send Error:', error.response?.data || error.message)
//     throw new Error('پیامک ارسال نشد')
//   }
// }

export async function sendSmsVerifyFarazSms(to: string, code: string) {
  const settings: Settings = (await getSettings()) as Settings
  try {
    const base_url = `https://edge.ippanel.com/v1`
    const from_number = settings?.farazsms?.farazsms_from_number || ''
    const patternCode = settings?.farazsms?.farazsms_verifyPatternCode || ''
    const apiKey = settings?.farazsms?.farazsms_apiKey || ''
    const response = await axios.post(
      `${base_url}/api/send`,
      {
        sending_type: 'pattern',
        from_number, // شماره فرستنده خدماتی
        code: patternCode, // کد الگو که در پنل ساخته‌ای
        recipients: [to], // شماره گیرنده
        // مقادیر جایگزینی در الگو
        params: {
          code: code,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${apiKey}`,
        },
      }
    )

    return { success: true, message: 'پیامک با موفقیت ارسال شد' }
  } catch (error: any) {
    console.error('❌ SMS Send Error:', error.response?.data || error.message)
    return { success: false, message: 'ارسال پیامک با مشکل مواجه شد' }
  }
}
