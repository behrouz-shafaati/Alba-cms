import { sendSmsVerifyFarazSms } from './farazSms'

export function sendSms(to: string, content: string) {
  console.log(
    '-----------------------------------------<sms to: ' +
      to +
      ' content: ' +
      content
  )
}
export async function sendSmsVerify(
  to: string,
  code: string
): Promise<{ success: boolean; mesage: string }> {
  // console.log('#======================> (to, code):', to, ' - ', code)
  return sendSmsVerifyFarazSms(to, code)
}
