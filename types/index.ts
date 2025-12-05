import { Icons } from '@/components/icons'
import { Permission } from '@/features/permissions/interface'
export type LanguageSlugs = 'fa' | 'en'
export type guildSlug = 'laundry' | 'super_market'
export type Option = {
  value: string
  label: string
}
export type Place = {
  id: string
  name: string
}
export type Session = {
  user: {
    id: string
    name: string
    email: string
    roles: string[]
    image: string
  }
  expires: string
}

export interface NavItem {
  slug: string
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
  authorized?: Permission[]
}

export interface SidebarNavItem extends NavItem {
  sub?: NavItem[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export type State = {
  errors?: {
    title?: string[]
  }
  message?: string | null
  success: boolean
  values: any
}

export type ActionsState = {
  errors?: any
  values?: any
  message: string | null
  success: boolean
}
