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
import { FastLink } from '@/components/FastLink'
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
                <FastLink
                  href={'/dashboard/posts/create'}
                  className="w-full h-full"
                >
                  افزودن مطلب
                </FastLink>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <FastLink href={`/account/${user.id}`} className="w-full h-full">
                پروفایل
              </FastLink>
            </DropdownMenuItem>
            {canDashboardView && (
              <DropdownMenuItem>
                <FastLink href={'/dashboard'} className="w-full h-full">
                  داشبورد
                </FastLink>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <FastLink
                href="/logout"
                className="w-full flex justify-between py-1.5 px-2"
              >
                <span>خروج</span>
              </FastLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
}
