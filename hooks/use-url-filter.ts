'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function useUrlFilter() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()

  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1') // هر فیلتر عوض شد صفحه میره به 1
    if (value && value !== '') {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }

  return { setFilter, searchParams, isPending }
}
