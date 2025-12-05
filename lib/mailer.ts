import { getSettings } from '@/features/settings/controller'
import { Settings } from '@/features/settings/interface'
import nodemailer from 'nodemailer'
import { getTranslation } from './utils'

export async function sendEmail(to: string, subject: string, html: string) {
  const settings: Settings = (await getSettings()) as Settings
  const siteInfo = getTranslation({
    translations: settings?.infoTranslations || [],
  })
  const transporter = nodemailer.createTransport({
    host: settings?.mail_host,
    port: Number(settings?.mail_port),
    secure: false, // اگر 465 استفاده می‌کنی true باشه
    auth: {
      user: settings?.mail_username,
      pass: settings?.mail_password,
    },
  })
  try {
    const info = await transporter.sendMail({
      from: `${siteInfo?.site_title} <${settings?.mail_username}>`,
      to,
      subject,
      html,
    })
    console.log('Email sent: %s', info.messageId)
    return info
  } catch (error) {
    console.error('Email send error:', error)
    throw new Error('ارسال ایمیل با مشکل مواجه شد')
  }
}
export function getMailTemplate(
  site_title: string,
  code: string,
  locale: string = 'fa'
): string {
  switch (locale) {
    case 'fa':
      return html_fa(site_title, code)
    default:
      return `<h1>کد وریفای</h1>
        <code> ${code}`
  }
}

function html_fa(site_title: string, code: string) {
  const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>کد تأیید</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Tahoma,Arial,sans-serif;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f4f4f4">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="100%" max-width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="background:#4F46E5;padding:20px 0;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">${
                site_title || 'ALBA CMS'
              }</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 40px;">
              <h2 style="margin-top:0;color:#333333;font-size:20px;">👋 سلام!</h2>
              <p style="font-size:16px;color:#555555;line-height:1.6;">
                برای ادامه فرایند، لطفاً از کد تأیید زیر استفاده کنید. این کد به مدت
                <strong>15 دقیقه</strong> معتبر است.
              </p>

              <div style="text-align:center;margin:30px 0;">
                <span style="
                  display:inline-block;
                  background:#4F46E5;
                  color:#ffffff;
                  font-size:28px;
                  font-weight:bold;
                  letter-spacing:6px;
                  padding:12px 24px;
                  border-radius:8px;
                  font-family:monospace;
                ">
                  ${code}
                </span>
              </div>

              <p style="font-size:14px;color:#888888;line-height:1.5;">
                اگر شما این درخواست را ثبت نکرده‌اید، می‌توانید این ایمیل را نادیده بگیرید.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f9f9f9;padding:20px;font-size:12px;color:#aaaaaa;">
              © ${new Date().getFullYear()} ${site_title || 'ALBA CMS'}  
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
  return html
}
