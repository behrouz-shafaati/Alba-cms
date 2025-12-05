import { extractColorClasses } from '@/components/builder-canvas/utils/styleUtils'
import { MenuItem } from '@/features/menu/interface'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function MenuItemDesktop({
  item,
  ...props
}: {
  item: MenuItem
}) {
  const hasSubMenu = item.subMenu && item.subMenu.length > 0
  const { className = '' } = props
  if (!hasSubMenu) {
    return item.url ? (
      <Link
        href={item.url}
        // prefetch={true}
        className="block px-2 py-1 hover:text-blue-600"
      >
        {item.label}
      </Link>
    ) : (
      <></>
    )
  }

  return item.url ? (
    <div className={`relative group transition-all z-20`}>
      <Link
        href={item.url}
        // prefetch={true}
        className="flex items-center gap-1 px-2 py-1 hover:text-blue-600"
      >
        {item.label}
        <ChevronDown className="w-4 h-4" />
      </Link>

      {/* زیرمنو با hidden و group-hover:block */}
      <div
        className={`absolute right-0 top-full hidden group-hover:block  shadow-md min-w-[180px] z-50 transition-all ${extractColorClasses(
          className.replace('bg-transparent', '')
        )}`}
      >
        <div className="flex flex-col">
          {item.subMenu!.map((sub, index) =>
            sub?.url ? (
              <Link
                key={`Desktop${sub.id ?? index}`}
                href={sub.url}
                // prefetch={true}
                className="block px-4 py-2 hover:opacity-70 whitespace-nowrap"
              >
                {sub.label}
              </Link>
            ) : (
              <></>
            )
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
