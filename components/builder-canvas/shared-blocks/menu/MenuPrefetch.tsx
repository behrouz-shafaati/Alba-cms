'use client'
import { MenuItem } from '@/features/menu/interface'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MenuPrefetch({ items }: { items: MenuItem[] }) {
  const router = useRouter()

  useEffect(() => {
    // 1.5 ثانیه صبر کن تا Hydration کامل بشه
    const timeout = setTimeout(() => {
      // همه URL‌ها رو جمع کن
      const urls = collectUrls(items)
      // با requestIdleCallback اجرا کن (وقتی browser آزاد بود)
      if ('requestIdleCallback' in window) {
        urls.forEach((url, index) => {
          requestIdleCallback(
            () => {
              console.log('#234897 prefetch for :' + url)
              router.prefetch(url)
            },
            { timeout: 3000 + index * 100 } // هر کدوم با فاصله
          )
        })
      } else {
        // Fallback برای Safari
        urls.forEach((url, index) => {
          setTimeout(() => {
            console.log('#234897 prefetch for :' + url)
            router.prefetch(url)
          }, index * 150) // 150ms فاصله بین هر prefetch
        })
      }
    }, 1500)

    return () => clearTimeout(timeout)
  }, [router, items])

  // این کامپوننت هیچی رندر نمیکنه
  return null
}

// تابع کمکی برای جمع کردن همه URL‌ها
function collectUrls(items: MenuItem[]): string[] {
  const urls: string[] = []

  function traverse(menuItems: MenuItem[]) {
    for (const item of menuItems || []) {
      if (item.url) {
        urls.push(item.url)
      }
      if (item.subMenu?.length) {
        traverse(item.subMenu)
      }
    }
  }

  traverse(items)
  return [...new Set(urls)] // حذف تکراری‌ها
}
