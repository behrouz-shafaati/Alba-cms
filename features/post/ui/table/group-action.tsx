'use client'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deletePostsAction } from '../../actions'
import { AlertModal } from '@/components/modal/alert-modal'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'

type GroupActionProps = {
  table: any
  items: any[]
}
export default function GroupAction({ table, items }: GroupActionProps) {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useSession()
  const userRoles = user?.roles || []
  let canDelete = true
  for (const item of items) {
    const canDeleteItem = can(
      userRoles,
      item?.author?.id !== user?.id ? 'post.delete.any' : 'post.delete.own'
    )
    if (!canDeleteItem) {
      canDelete = false
      break
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await deletePostsAction(items.map((i) => i.id))
      router.refresh()
      table.resetRowSelection()
      setOpen(false)
      setLoading(false)
    } catch (error: any) {}
  }
  return (
    <div>
      {canDelete && (
        <>
          <AlertModal
            description={`از حذف ${items.length}  مورد اطمینان دارید؟ این عمل غیر قابل بازگشت است!`}
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
          />
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => setOpen(true)}
          >
            <Trash className="ml-2 h-4 w-4 " /> حذف گروهی
          </Button>
        </>
      )}
    </div>
  )
}
