import { fetcher } from '@/lib/utils'
import useSWR from 'swr'

type Props = {
  url: string
  initialData?: any
  refreshMs?: number
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
  revalidateIfStale?: boolean
  /**
   * Second
   */
  refreshInterval?: Number
  refreshWhenHidden?: boolean
  refreshWhenOffline?: boolean
}
export function useCustomSWR({
  url,
  initialData,
  refreshMs = 0,
  revalidateOnFocus = false,
  revalidateOnReconnect = false,
  revalidateIfStale = false,
  refreshWhenHidden = false,
  refreshWhenOffline = false,
}: Props) {
  const refreshPerSecends = refreshMs * 1000
  const { data, isLoading, mutate } = useSWR(url ?? null, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus, // هر وقت کاربر دوباره به تب/پنجره‌ی مرورگر برگرده (focus)، SWR دوباره داده رو فچ می‌کنه
    revalidateOnReconnect, //وقتی اینترنت قطع و وصل بشه، SWR داده رو دوباره فچ می‌کنه.
    revalidateIfStale, // جلوی revalidate خودکار بعد از mount
    refreshInterval: refreshPerSecends, // اگر 0 باشه یعنی غیرفعاله (هیچ ریکوئست اتوماتیک تکرارشونده‌ای وجود نداره).
    refreshWhenHidden, // اگر فعال باشه، حتی وقتی تب مرورگر hidden یا minimize شده هم، interval فعال می‌مونه.
    refreshWhenOffline, //اگر فعال باشه، حتی وقتی کاربر offline بشه هم SWR تلاش می‌کنه fetch بزنه (که معمولاً خطا می‌ده).
  })

  return {
    data,
    isLoading,
    refresh: () => mutate(),
    mutate,
  }
}
