import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import { logout } from '@/lib/auth'
import { User } from '@/features/user/interface'
import { Block } from '../../types'
import { computedStyles } from '../../utils/styleUtils'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { can } from '@/lib/utils/can.client'
import Link from 'next/link'
type props = {
  widgetName: string
  user: User
  blockData: {
    content: {}
    type: 'userNav'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement>

export function UserNav({ widgetName, blockData, user, ...props }: props) {
  const { className, ...res } = props
  const router = useRouter()
  const userRoles = user?.roles || []
  const canCreatePost = can(userRoles, 'post.create')
  const canDashboardView = can(userRoles, 'dashboard.view.any')
  const defaultAvatar = '/assets/default-profile.png'
  const { content, settings, styles } = blockData || {}
  if (user) {
    return (
      <div
        style={{
          ...computedStyles(blockData?.styles || {}),
        }}
        className={`${className}`}
        {...res}
      >
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Image
              src={user?.image?.srcSmall || defaultAvatar}
              height={24}
              width={24}
              alt={user?.name}
              className="rounded-[50%]"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {canCreatePost && (
              <DropdownMenuItem>
                <Link
                  href={'/dashboard/posts/create'}
                  className="w-full h-full"
                >
                  افزودن مطلب
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Link href={`/account/${user.id}`} className="w-full h-full">
                پروفایل
              </Link>
            </DropdownMenuItem>
            {canDashboardView && (
              <DropdownMenuItem>
                <Link href={'/dashboard'} className="w-full h-full">
                  داشبورد
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <form
                className="top-0 left-0 flex w-full h-full"
                action={async () => {
                  await fetch('/api/logout', {
                    method: 'POST',
                  })
                  window.location.href = '/login' // یا هر صفحه‌ای که می‌خوای
                }}
              >
                <button className="flex w-full h-full">خروج</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
}
