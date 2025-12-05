'use client'
import { MenuItem } from '@/features/menu/interface'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function MobileMenuList({ items }: { items: MenuItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {(items || []).map((item, index) => (
        <MobileMenuItem key={index} item={item} />
      ))}
    </div>
  )
}

function MobileMenuItem({ item }: { item: MenuItem }) {
  // const router = useRouter()
  const [open, setOpen] = useState(false)
  const hasSubMenu = item.subMenu && item.subMenu.length > 0

  /** Prefetch when menu opens */
  // useEffect(() => {
  //   if (item?.url) {
  //     console.log('#234987 prefetch:', item.url)
  //     router.prefetch(item.url)
  //   }
  //   if (hasSubMenu) {
  //     // Prefetch top-level links
  //     item.subMenu.forEach((item) => {
  //       {
  //         console.log('#234987 prefetch:', item.url)
  //         router.prefetch(item.url)
  //       }
  //     })
  //   }
  // }, [router])

  return item?.url ? (
    <div>
      <div className="flex items-center justify-between">
        <Link href={item.url} className="font-thin text-sm">
          {item.label}
        </Link>
        {hasSubMenu && (
          <button className=" hover:opacity-70" onClick={() => setOpen(!open)}>
            {open ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
      {hasSubMenu && open && (
        <div className="flex flex-col gap-1 mt-4 mr-4">
          <MobileMenuList items={item.subMenu!} />
        </div>
      )}
    </div>
  ) : (
    <></>
  )
}
