'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const MobileMenu = dynamic(() => import('./MobileMenu'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <div className="my-2 md:hidden">
      <Skeleton className="w-6 h-6" />
    </div>
  ),
})

export default function MobileMenuLazy(props) {
  return <MobileMenu {...props} />
}
