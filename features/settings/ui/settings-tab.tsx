'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Settings,
  Monitor,
  CheckSquare,
  MessageCircle,
  Mail,
  Megaphone,
  User,
} from 'lucide-react'

const tabs = [
  { href: '/dashboard/settings/general', label: 'عمومی', icon: Settings },
  { href: '/dashboard/settings/appearance', label: 'ظاهر', icon: Monitor },
  { href: '/dashboard/settings/ad', label: 'تبلیغات', icon: Megaphone },
  {
    href: '/dashboard/settings/users',
    label: 'کاربران',
    icon: User,
  },
  {
    href: '/dashboard/settings/validation',
    label: 'اعتبارسنجی',
    icon: CheckSquare,
  },
  { href: '/dashboard/settings/sms', label: 'پیامک', icon: MessageCircle },
  { href: '/dashboard/settings/email', label: 'ایمیل', icon: Mail },
]

export function SettingsTabs() {
  const pathname = usePathname()

  return (
    <nav className="overflow-x-auto">
      <div
        className="
          flex w-max md:w-full gap-2 rounded-xl border border-black/10 dark:border-white/10
          bg-black/5 dark:bg-white/5 p-2 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.15)]
        "
      >
        {tabs.map((t, idx) => {
          const active = pathname.startsWith(t.href)
          const Icon = t.icon
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm rounded-lg relative transition-all whitespace-nowrap',
                active
                  ? 'text-black dark:text-white font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>

              {/* Animated underline */}
              <span
                className={cn(
                  'absolute bottom-0 left-1/2 h-[2px] w-0 bg-black dark:bg-white transition-all',
                  active && 'w-full -translate-x-1/2'
                )}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
