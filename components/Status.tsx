'use client'
import React from 'react'
import { CheckCircle, XCircle, Eye, EyeOff, Clock1 } from 'lucide-react'
import { Row } from '@tanstack/react-table'
import { Badge } from './ui/badge'

// نوع وضعیت‌ها
type StatusType =
  | 'active'
  | 'deactive'
  | 'published'
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'read'
  | 'unread'

interface StatusProps<T> {
  row: Row<T>
  accessorKey?: string // پیش‌فرض 'status'
}

export const Status = <T,>({ row, accessorKey = 'status' }: StatusProps<T>) => {
  let status: StatusType | undefined

  if (typeof row?.getValue === 'function') {
    // TanStack Table Row
    status = row.getValue<StatusType>(accessorKey!)
  } else if (row && accessorKey) {
    // Object ساده
    status = row[accessorKey as keyof typeof row] as StatusType
  }

  let icon, label
  switch (status) {
    case 'active':
      label = 'فعال'
      break
    case 'deactive':
      label = 'غیر فعال'
      break
    case 'published':
      label = 'منتشر شده'
      break
    case 'draft':
      label = 'پیش نویس'
      break
    case 'pending':
      label = 'در انتظار '
      break
    case 'approved':
      label = 'تایید شده'
      break
    case 'rejected':
      label = 'رد شده'
      break
    case 'read':
      label = 'خوانده شده'
      break
    case 'unread':
      label = 'خوانده نشده'
      break
    default:
      label = 'نامشخص'
  }
  let bgGradient =
    'rounded-full border-none bg-yellow-600/15 hover:bg-yellow-600/15 text-amber-600 focus-visible:ring-red-600/20 focus-visible:outline-none dark:bg-yellow-400/15 dark:text-amber-400 dark:focus-visible:ring-red-400/40'
  switch (status) {
    case 'active':
    case 'published':
    case 'approved':
    case 'read':
      bgGradient =
        'rounded-full border-none bg-green-600/10 hover:bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40'
      icon = <CheckCircle className="w-4 h-4" />
      break
    case 'deactive':
    // case 'draft':
    case 'rejected':
      icon = <XCircle className="w-4 h-4" />
      bgGradient =
        'rounded-full border-none bg-red-600/15 hover:bg-red-600/15 text-red-600 focus-visible:ring-red-600/20 focus-visible:outline-none dark:bg-red-400/15 dark:text-red-400 dark:focus-visible:ring-red-400/40'
      break
    default:
      icon = <Clock1 className="w-4 h-4" />
  }

  return (
    <Badge
      className={` ${bgGradient} p-2 min-w-20 text-center align-middle items-center justify-center`}
    >
      {icon}
      <span className="mr-2">{label}</span>
    </Badge>
  )
}
