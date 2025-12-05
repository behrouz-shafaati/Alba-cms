'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const ThemeModeSwitch = dynamic(() => import('./ThemeModeSwitch'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <div className="py-2">
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  ),
})

export default function ThemeModeSwitchLazy(props) {
  return <ThemeModeSwitch {...props} />
}
