'use client'
import dynamic from 'next/dynamic'
import { BannerGroupFallback } from './BannerGroupFallback'

// کاملاً خارج از باندل اولیه
const AdSlotBlock = dynamic(() => import('./AdSlotBlock'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <BannerGroupFallback blockData={{ settings: { aspect: '10/1' } }} />
  ),
})

export default function AdSlotBlockLazy_10_1(props) {
  return <AdSlotBlock {...props} />
}
