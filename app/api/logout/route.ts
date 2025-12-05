import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // پاک کردن کوکی session
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(0), // تاریخ گذشته = حذف
    path: '/', // خیلی مهم برای پاک شدن درست
  })

  return response
}
