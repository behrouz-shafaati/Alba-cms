'use server'

import roleCtrl from '../../features/role/controller'
import { Permission } from '../../features/permissions/interface'

export async function can(
  userRoles: string[],
  permissionKey: Permission,
  throwError: boolean = true
) {
  // اگر هیچ نقشی وجود ندارد
  if (!Array.isArray(userRoles) || userRoles.length === 0) {
    if (!throwError) return false
    const err: any = new Error('Forbidden')
    err.status = 403
    throw err
  }

  // پیدا کردن نقش‌ها از آرایه roles
  const roles = roleCtrl.getRoles()
  const assignedRoles = userRoles
    .map((slug) => roles.find((r) => r.slug === slug))
    .filter(Boolean) as (typeof roles)[number][]

  // اگر هیچ نقشی یافت نشد
  if (assignedRoles.length === 0) {
    if (!throwError) return false
    const err: any = new Error('Forbidden')
    err.status = 403
    throw err
  }

  // چک دسترسی
  const hasPermission = assignedRoles.some(
    (role) =>
      role.permissions.includes(permissionKey) ||
      role.permissions.includes('all')
  )

  if (!hasPermission) {
    if (!throwError) return false
    const err: any = new Error('Forbidden')
    err.status = 403
    throw err
  }

  return true
}
