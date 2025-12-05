import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const secretKey = 'secret'
const key = new TextEncoder().encode(secretKey)

export async function middleware(request: NextRequest) {
  // ⏱️ شروع اندازه‌گیری کل
  const totalStart = Date.now()

  // 🔍 اطلاعات درخواست
  const pathname = request.nextUrl.pathname
  const requestId = crypto.randomUUID().slice(0, 8)

  // 🚀 مسیرهای غیر Dashboard - خروج سریع
  if (
    !pathname.startsWith('/dashboard') &&
    !pathname.startsWith('/api/dashboard')
  ) {
    const response = NextResponse.next()
    addDebugHeaders(response, {
      requestId,
      totalTime: Date.now() - totalStart,
      pathname,
      action: 'passthrough',
    })
    return response
  }

  // 📊 اندازه‌گیری زمان getSession
  const sessionStart = Date.now()
  const currentUser = await getSession()
  const sessionTime = Date.now() - sessionStart

  // 📝 لاگ Session Time
  if (sessionTime > 50) {
    console.warn(
      `⚠️ [${requestId}] Slow getSession: ${sessionTime}ms on ${pathname}`
    )
  }

  // بررسی احراز هویت برای Dashboard  🔒
  if (!currentUser) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    const response = NextResponse.redirect(loginUrl)
    addDebugHeaders(response, {
      requestId,
      totalTime: Date.now() - totalStart,
      sessionTime,
      pathname,
      action: 'redirect-to-login',
    })

    console.log(
      `🔐 [${requestId}] Redirecting unauthenticated user from ${pathname} to /login`
    )
    return response
  }

  // ✅ کاربر احراز هویت شده
  const response = NextResponse.next()
  addDebugHeaders(response, {
    requestId,
    totalTime: Date.now() - totalStart,
    sessionTime,
    pathname,
    action: 'authenticated',
    userId: currentUser.id || 'unknown',
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

// Don't remove this else will happen trace error!
export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token has expired. Please generate a new one.')
    } else {
      console.log('Token verification failed:', error.message)
    }
    return null
  }
}

// 🔧 تابع کمکی برای اضافه کردن Headers
function addDebugHeaders(
  response: NextResponse,
  data: {
    requestId: string
    totalTime: number
    sessionTime: number
    pathname: string
    action: string
    userId?: string
  }
) {
  const { requestId, totalTime, sessionTime, pathname, action, userId } = data

  // 📊 Debug Headers
  response.headers.set('X-Request-ID', requestId)
  response.headers.set('X-Middleware-Time', `${totalTime}ms`)
  response.headers.set('X-Session-Time', `${sessionTime}ms`)
  response.headers.set('X-Middleware-Action', action)
  response.headers.set('X-Debug-Path', pathname)
  response.headers.set('X-Timestamp', new Date().toISOString())

  if (userId) {
    response.headers.set('X-User-ID', userId)
  }

  // 🚨 هشدار برای زمان‌های بالا
  if (totalTime > 100) {
    response.headers.set('X-Performance-Warning', 'slow-middleware')
    console.warn(
      `🔴 [${requestId}] SLOW MIDDLEWARE: ${totalTime}ms (session: ${sessionTime}ms) on ${pathname}`
    )
  }

  // 🔒 Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')

  // 📈 لاگ در Development
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `📊 [${requestId}] ${action.toUpperCase()} | ` +
        `Path: ${pathname} | ` +
        `Total: ${totalTime}ms | ` +
        `Session: ${sessionTime}ms`
    )
  }
}
