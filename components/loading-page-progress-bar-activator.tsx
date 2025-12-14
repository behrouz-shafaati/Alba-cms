'use client'

import { useEffect } from 'react'
import NProgress from 'nprogress'

export function PageLoadingProgressBarActivator() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (!link) return

      // اگر data-nprogress="off" داشت → NProgress اجرا نشود
      if (link.getAttribute('data-nprogress') === 'off') return

      const href = link.getAttribute('href')
      if (!href) return

      // anchor داخل صفحه
      if (href.startsWith('#')) return

      // لینک external
      if (href.startsWith('http')) return

      // modifier keys
      if (e.ctrlKey || e.metaKey) return

      /**
       * ✅ شرط جدید:
       * اگر لینک مقصد == URL فعلی بود → NProgress اجرا نشود
       */
      try {
        const targetUrl = new URL(href, window.location.origin)
        const currentUrl = new URL(window.location.href)

        const isSameUrl =
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search &&
          targetUrl.hash === currentUrl.hash

        if (isSameUrl) return
      } catch {
        // اگر URL نا‌معتبر بود، احتیاطاً کاری نکن
        return
      }

      // ✅ فقط وقتی واقعاً ناوبری داریم
      NProgress.start()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
