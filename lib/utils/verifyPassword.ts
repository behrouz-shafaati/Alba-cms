const bcrypt = require('bcryptjs')

/**
 * تشخیص هش وردپرس
 */
export const isWordPressHash = (hash: string): boolean => {
  return hash.startsWith('$P$') || hash.startsWith('$H$')
}

/**
 * تأیید رمز عبور با پشتیبانی از هر دو فرمت رمز مهاجرتی از ورد پرس و رمز کاربران خود سیستم
 */
export default async function verifyPassword(
  plainPassword: string,
  storedHash: string
): Promise<{ isValid: boolean; needsRehash: boolean }> {
  let isValid = false
  if (!storedHash) {
    return { isValid, needsRehash: false }
  }

  // هش bcrypt
  isValid = await bcrypt.compare(plainPassword, storedHash)
  return { isValid, needsRehash: false }
}
