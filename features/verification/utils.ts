import crypto from 'crypto'

export function generateNumericCode(length = 6) {
  // تولید کد عددی تصادفی (مناسب برای SMS/Email)
  const min = 10 ** (length - 1)
  const max = 10 ** length - 1
  return String(Math.floor(Math.random() * (max - min + 1)) + min)
}

export function makeSalt() {
  return crypto.randomBytes(16).toString('hex')
}

export function hashWithSalt(code: string, salt: string) {
  return crypto.createHmac('sha256', salt).update(code).digest('hex')
}
