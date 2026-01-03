'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const UserNavBlock = dynamic(() => import('./UserNavBlock'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <div className="px-2 py-[6px]">
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  ),
})

export default function UserNavBlockLazy(props) {
  return <UserNavBlock {...props} />
}
