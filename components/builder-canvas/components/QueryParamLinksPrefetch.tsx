'use client'
import { MenuItem } from '@/features/menu/interface'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MenuPrefetch({ items }: { items: MenuItem[] }) {
  return (items || []).map((item, index) => (
    <MenuItem key={index} item={item} />
  ))
}

function MenuItem({ item }: { item: MenuItem }) {
  const router = useRouter()
  const hasSubMenu = item.subMenu && item.subMenu.length > 0

  useEffect(() => {
    if (item?.url) {
      console.log('#234987dd prefetch:', item.url)
      router.prefetch(item.url)
    }
    if (hasSubMenu) {
      // Prefetch top-level links
      item.subMenu.forEach((item) => {
        {
          console.log('#234987dd prefetch:', item.url)
          router.prefetch(item.url)
        }
      })
    }
  }, [router])

  return hasSubMenu ? <MenuPrefetch items={item.subMenu!} /> : <></>
}
