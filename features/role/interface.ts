import { Permission } from '../permissions/interface'

export type Role = {
  title: string
  slug: string
  description: string
  permissions: Permission[]
  shwoInSetUserRolesList?: boolean
}
