'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// تنظیمات مختلف نوار لود
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 150,
})

export function PageLoadingProgressBar() {
  const pathname = usePathname()

  useEffect(() => {
    NProgress.start()

    // یک تأخیر کوتاه برای طبیعی‌تر بودن
    const timeout = setTimeout(() => {
      NProgress.done()
    }, 300)

    return () => clearTimeout(timeout)
  }, [pathname])

  return null
}
