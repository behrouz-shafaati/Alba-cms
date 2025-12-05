'use client'

import { AlertModal } from '@/components/modal/alert-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Campaign } from '@/features/campaign/interface'
import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { deleteCampaignsAction } from '../../actions'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'

interface CellActionProps {
  data: Campaign
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canEdit = can(
    userRoles,
    data.user.id !== user?.id ? 'campaign.edit.any' : 'campaign.edit.own'
  )
  const canDelete = can(
    userRoles,
    data.user.id !== user?.id ? 'campaign.delete.any' : 'campaign.delete.own'
  )

  const onConfirm = async () => {
    setLoading(true)
    deleteCampaignsAction([data.id])
    router.refresh()
    setOpen(false)
    setLoading(false)
  }

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
              onClick={() => router.push(`/dashboard/campaigns/${data.id}`)}
            >
              <Edit className="ml-2 h-4 w-4" /> بروزرسانی
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link href={`#`} target="_blank" rel="noopener noreferrer">
              <Eye className="ml-2 h-4 w-4" /> مشاهده
            </Link>
          </DropdownMenuItem>
          {canDelete && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="ml-2 h-4 w-4" /> حذف
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
