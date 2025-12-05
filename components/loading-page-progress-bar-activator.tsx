'use client'

import { useEffect } from 'react'
import NProgress from 'nprogress'

export function PageLoadingProgressBarActivator() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // نزدیک‌ترین لینک
      const link = target.closest('a')

      if (!link) return

      //  اگر data-nprogress="off" داشت → NProgress اجرا نشود
      if (link.getAttribute('data-nprogress') === 'off') {
        return
      }

      const href = link.getAttribute('href')
      if (!href) return

      // اگر داخل صفحه نبود، ignore
      if (href.startsWith('#')) return

      // اگر لینک external بود، ignore
      if (href.startsWith('http')) return

      // اگر کلیدهای modifier بود (ctrl, meta)، ignore
      if (e.ctrlKey || e.metaKey) return

      // اینجا دقیقاً لحظهٔ کلیک است، قبل از تغییر مسیر
      NProgress.start()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
