import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button, ButtonProps } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getSession, logout } from '@/lib/auth'
import { can } from '@/lib/utils/can.server'
import { Session } from '@/types'
import Link from 'next/link'
import React from 'react'

const AvatarButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} {...props} />
)
AvatarButton.displayName = 'AvatarButton'

export async function UserNav() {
  const { user } = (await getSession()) as Session
  const userRoles = user?.roles || []
  const canCreatePost = await can(userRoles, 'post.create', false)
  const canDashboardView = await can(userRoles, 'dashboard.view.any', false)
  if (user) {
    return (
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <AvatarButton
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image?.srcSmall ?? ''}
                alt={user?.name ?? ''}
              />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </AvatarButton>
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
            <DropdownMenuItem className="p-0">
              <Link
                href="/dashboard/posts/create"
                className="w-full flex justify-between py-1.5 px-2"
              >
                <span>افزودن مطلب</span>
              </Link>
            </DropdownMenuItem>
          )}
          {canDashboardView && (
            <DropdownMenuItem className="p-0">
              <Link
                href="/dashboard"
                className="w-full flex justify-between py-1.5 px-2"
              >
                <span>داشبورد</span>
              </Link>
            </DropdownMenuItem>
          )}
          {/* <DropdownMenuItem>
                پروفایل
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                صورتحساب
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                تنظیمات
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem> */}
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <form
              className="w-full flex  top-0 left-0 h-full"
              action={async () => {
                'use server'
                await logout()
              }}
            >
              <button className="w-full h-full flex">خروج</button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
