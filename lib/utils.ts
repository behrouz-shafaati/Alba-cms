const bcrypt = require('bcryptjs')
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { QueryFind } from './entity/core/interface'
import { jwtVerify, SignJWT } from 'jose'

/**
 * Utility function for conditionally combining and merging Tailwind CSS class names.
 *
 * This function first combines class names using `clsx`, which supports
 * conditional and array/object-based class definitions, and then merges
 * any conflicting Tailwind CSS classes using `tailwind-merge` (`twMerge`).
 *
 * @example
 * ```tsx
 * <button className={cn(
 *   "text-sm font-medium",
 *   isActive && "text-blue-500",
 *   "hover:text-blue-700"
 * )}>
 *   Click me
 * </button>
 * ```
 *
 * // Output:
 * // "text-sm font-medium text-blue-500 hover:text-blue-700"
 *
 * @param {...ClassValue[]} inputs - A list of class name values that can include
 * strings, arrays, or objects (as supported by `clsx`).
 *
 * @returns {string} The merged string of class names with Tailwind conflicts resolved.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

const secretKey = 'secret'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
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

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// پسورد کاربر رو مقایسه می‌کنیم
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword)
  } catch (err) {
    console.error('Error comparing passwords:', err)
    return false
  }
}

export const haveAccess = (
  roles: string[] = [],
  AuthorizedRoles: string[] = []
) => {
  // console.log('#6345 roles in have access:', roles);
  if (AuthorizedRoles.length == 0) return true
  const isSuperAdmin = roles.includes('super_admin')
  // console.log('#6345 isSuperAdmin flg:', isSuperAdmin);
  if (isSuperAdmin) return true
  return !!roles.some((element) => AuthorizedRoles.includes(element))
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages]
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ]
}

export const createCatrgoryBreadcrumb = (
  category: any,
  title: string,
  locale: string = 'fa'
): string => {
  if (category?.parent) {
    const translation: any =
      category.parent?.translations?.find((t: any) => t.lang === locale) ||
      category.parent?.translations[0] ||
      {}
    title = `${translation?.title} > ${title}`
    return createCatrgoryBreadcrumb(category.parent, title)
  }
  return title
}

/**
 * تبدیل عنوان به اسلاگ خوانا
 */
const arabicDiacriticsRegex = /[\u064B-\u0652]/g // اعراب عربی و فارسی مثل ً ُ ِ ّ

export function slugify(title: string): string {
  if (!title) return ''
  return title
    .normalize('NFC') // نرمال‌سازی حروف فارسی/عربی
    .replace(arabicDiacriticsRegex, '') // حذف اعراب
    .replace(/[^\w\u0600-\u06FF\s-]/g, '') // حذف کاراکترهای غیرحرفی (غیراز حروف فارسی و عدد و فاصله)
    .replace(/\s+/g, '-') // فاصله به خط تیره
    .replace(/-+/g, '-') // چند خط تیره → یکی
    .replace(/^-+|-+$/g, '') // حذف خط تیره‌ی اول و آخر
    .toLowerCase()
}

type Filters = Record<string, string[]>

/**
 * @param filtersArray از params.catchAll یا params.filters میاد
 * @returns فیلترها به صورت آبجکت
 */
export function extractFiltersFromParams(filtersArray: string[] = []): Filters {
  const filters: Filters = {}

  for (let i = 0; i < filtersArray.length; i += 2) {
    const key = filtersArray[i]
    const rawValue = filtersArray[i + 1]

    if (key && rawValue) {
      const decoded = decodeURIComponent(rawValue)
      filters[key] = decoded.split(',').filter(Boolean)
    }
  }

  return filters
}

/**
 * Builds a URL path segment from a filters object.
 *
 * Each key in the `filters` object is appended to the URL
 * followed by its values joined by commas.
 *
 * Example:
 * ```ts
 * buildUrlFromFilters({
 *   category: ['books', 'toys'],
 *   color: ['red', 'blue'],
 * })
 * // Returns: "category/books,toys/color/red,blue"
 * ```
 *
 * @param {Record<string, string[]>} filters - An object where each key represents
 * a filter name and its value is an array of selected options.
 *
 * @returns {string} A URL-friendly string combining all filters and their values.
 */
export function buildUrlFromFilters(filters: Record<string, string[]>): string {
  const parts: string[] = []

  for (const key in filters) {
    const value = filters[key]
    if (value?.length > 0) {
      parts.push(`${key}/${value?.join(',')}`)
    }
  }

  return `${parts.join('/')}`
}

export function getTemplateFor(templateFor: string): string {
  if (!templateFor) return 'allPages'
  const parts = templateFor[0].split('-')
  return parts[0] || templateFor
}

//************************************* Multi language function *****************************************/
// اگر بخوای زبان‌های مجاز رو محدود کنی:
export const SUPPORTED_LANGUAGE = ['fa', 'en'] as const
type Locale = (typeof SUPPORTED_LANGUAGE)[number]

export function pickLocale(paramsLang?: string): Locale {
  const cand = paramsLang
  return (SUPPORTED_LANGUAGE as readonly string[]).includes(cand ?? '')
    ? (cand as Locale)
    : 'fa'
}

export const getTranslation = ({
  translations,
  locale = 'fa',
}: {
  translations: any[]
  locale?: string
}) => {
  if (typeof translations === 'undefined' || translations == null) return {}
  const translation =
    translations?.find((t) => t.lang === locale) || translations[0] || {}
  return translation
}
//******************************************************************************/

export const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function timeAgo(createdAt: string): string {
  const now = new Date()
  const past = new Date(createdAt)
  const diffMs = now.getTime() - past.getTime()

  if (diffMs < 0) return 'در آینده است!'

  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)
  const months = Math.floor(diffMs / (30 * 86400000))
  const years = Math.floor(diffMs / (365 * 86400000))
  if (minutes == 0) return 'همین الان'
  if (minutes < 60) {
    return `${minutes} دقیقه قبل`
  } else if (hours < 24) {
    return `${hours} ساعت قبل`
  } else if (days < 30) {
    return `${days} روز قبل`
  } else if (months < 12) {
    return `${months} ماه قبل`
  } else {
    // اگر چند سال و چند ماه گذشته باشد
    const remainingMonths = months % 12
    if (remainingMonths === 0) {
      return `${years} سال قبل`
    } else {
      return `${years} سال و ${remainingMonths} ماه قبل`
    }
  }
}

// function parseQuery(req: NextRequest): QueryFind {
export function parseQuery(req: any): QueryFind {
  const searchParams = req.nextUrl.searchParams

  // pagination
  const page = searchParams.get('page') ?? 1
  const perPage = searchParams.get('perPage') ?? 6

  // filters
  const filters: any = {}
  searchParams.forEach((value, key) => {
    if (
      ![
        'page',
        'perPage',
        'orderBy',
        'order',
        'saveLog',
        'sort',
        'populate',
      ].includes(key)
    ) {
      filters[key] = value
    }
  })

  return {
    filters: {
      ...filters,
      orderBy: searchParams.get('orderBy') ?? undefined,
      order: searchParams.get('order') ?? undefined,
    },
    pagination: {
      page: page === 'off' ? 'off' : Number(page ?? 1),
      perPage: Number(perPage ?? 10),
    },
    saveLog: searchParams.get('saveLog') === 'true' ? true : false,
    sort: searchParams.get('sort') ?? undefined,
    populate: searchParams.get('populate') ?? undefined,
  }
}

// Helper to safely add optional properties
export const addIfExists = (key: string, value: any) =>
  value !== undefined && value !== null && value !== '' ? { [key]: value } : {}

export function toMinutes(seconds: number): string {
  const m = Math.floor(seconds / 60) // دقیقه
  const s = seconds % 60 // باقی‌مانده ثانیه
  return ` ${m} دقیقه و  ${s} ثانیه `
}

/**
 * Detect whether an identifier is a mobile number or an email.
 * @param identifier string to check
 * @returns "mobile" | "email" | "invalid"
 */
export function detectIdentifierType(
  identifier: string
): 'mobile' | 'email' | 'invalid' {
  // پاک کردن فاصله و کاراکترهای اضافی
  const value = identifier.trim()

  // الگوی ساده برای ایمیل
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // الگوی ساده برای موبایل (ایران)
  // می‌تونی با توجه به نیازت تغییرش بدی
  const mobileRegex = /^(\+98|0)?9\d{9}$/

  if (emailRegex.test(value)) {
    return 'email'
  }

  if (mobileRegex.test(value)) {
    return 'mobile'
  }

  return 'invalid'
}

// utility: normalize a Date to UTC midnight (00:00:00.000Z)
export function toUtcMidnight(date: Date | number = Date.now()): Date {
  const d = new Date(date)
  // get UTC Y/M/D and construct new Date at 00:00:00Z
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

export function truncateWords(text: string, limit = 15) {
  if (!text) return ''
  const words = text.split(' ')
  return words.length > limit ? words.slice(0, limit).join(' ') + '…' : text
}
