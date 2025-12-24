'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 150,
})

const START_DELAY = 120 // ms → اگر ناوبری سریع‌تر بود، Progress نیاد
const DONE_DELAY = 200 // ms → پایان نرم‌تر

export function PageLoadingProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isNavigatingRef = useRef(false)
  const startTimerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  /**
   * 1️⃣ شروع ناوبری (کلیک روی لینک)
   */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (!link) return
      if (link.getAttribute('data-nprogress') === 'off') return

      const href = link.getAttribute('href')
      if (!href) return

      // ignore cases
      if (href.startsWith('#')) return
      if (href.startsWith('http')) return
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return

      try {
        const targetUrl = new URL(href, window.location.origin)
        const currentUrl = new URL(window.location.href)

        const isSameUrl =
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search &&
          targetUrl.hash === currentUrl.hash

        if (isSameUrl) return
      } catch {
        return
      }

      // شروع ناوبری
      isNavigatingRef.current = true
      startTimeRef.current = performance.now()

      // ⏳ Progress با تأخیر شروع می‌شود
      startTimerRef.current = window.setTimeout(() => {
        if (isNavigatingRef.current) {
          NProgress.start()
        }
      }, START_DELAY)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  /**
   * 2️⃣ پایان ناوبری (route change)
   */
  useEffect(() => {
    if (!isNavigatingRef.current) return

    const now = performance.now()
    const elapsed =
      startTimeRef.current != null ? now - startTimeRef.current : 0

    // اگر هنوز Progress شروع نشده، تایمرش رو کنسل کن
    if (elapsed < START_DELAY && startTimerRef.current) {
      clearTimeout(startTimerRef.current)
      startTimerRef.current = null
      isNavigatingRef.current = false
      return
    }

    const doneTimer = window.setTimeout(() => {
      NProgress.done()
      isNavigatingRef.current = false
      startTimeRef.current = null
    }, DONE_DELAY)

    return () => clearTimeout(doneTimer)
  }, [pathname, searchParams])

  return null
}
