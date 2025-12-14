'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const ThemeModeSwitch = dynamic(() => import('./ThemeModeSwitch'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <div className="">
      <Skeleton className="h-9 w-9 rounded" />
    </div>
  ),
})

export default function ThemeModeSwitchLazy(props) {
  return <ThemeModeSwitch {...props} />
}
