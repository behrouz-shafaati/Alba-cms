'use client'
import { AlertModal } from '@/components/modal/alert-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Form } from '@/features/form/interface'
import { Edit, Inbox, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteFormAction } from '../../actions'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import Link from 'next/link'

interface CellActionProps {
  data: Form
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const { user } = useSession()
  const userRoles = user?.roles || []

  const canEdit = can(
    userRoles,
    data?.user !== user?.id ? 'form.edit.any' : 'form.edit.own'
  )
  const canDelete = can(
    userRoles,
    data?.user !== user?.id ? 'form.delete.any' : 'form.delete.own'
  )

  const onConfirm = async () => {
    setLoading(true)
    deleteFormAction([data.id])
    router.refresh()
    setOpen(false)
    setLoading(false)
  }
  if (!canDelete && !canEdit) return null
  return (
    <>
      {canDelete && (
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={onConfirm}
          loading={loading}
        />
      )}
      <div className="flex flex-row gap-2 items-center justify-center">
        <Button variant="ghost" title="پیام های دریافتی">
          <Link href={`/dashboard/forms/${data.id}/submissions`}>
            <Inbox className="h-4 w-4" />
          </Link>
        </Button>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {/* <DropdownMenuLabel dir="rtl">عملیات</DropdownMenuLabel> */}

            {canEdit && (
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/forms/${data.id}`)}
              >
                <Edit className="ml-2 h-4 w-4" /> بروزرسانی
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Trash className="ml-2 h-4 w-4" /> حذف
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
