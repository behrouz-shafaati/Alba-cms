'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const Search = dynamic(() => import('./Block'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <div className="py-2">
      <Skeleton className="w-6 h-6 rounded-full" />
    </div>
  ),
})

export default function SearchLazy(props) {
  return <Search {...props} />
}
