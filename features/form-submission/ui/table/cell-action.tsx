'use client'
import { AlertModal } from '@/components/modal/alert-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FormSubmission } from '@/features/form-submission/interface'
import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  deleteFormSubmissionAction,
  updateFormSubmissionStatusAction,
} from '../../actions'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import Modal from '@/components/modal/modal'
import { getTranslation } from '@/lib/utils'

interface CellActionProps {
  data: FormSubmission
  formFields: any
}

export const CellAction: React.FC<CellActionProps> = ({ data, formFields }) => {
  const locale = 'fa'
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [openDetails, setOpenDetails] = useState(false)
  const router = useRouter()

  const { user } = useSession()
  const userRoles = user?.roles || []

  const canEdit = can(
    userRoles,
    data?.user !== user?.id
      ? 'formSubmission.edit.any'
      : 'formSubmission.edit.own'
  )
  const canDelete = can(
    userRoles,
    data?.user !== user?.id
      ? 'formSubmission.delete.any'
      : 'formSubmission.delete.own'
  )

  const onConfirm = async () => {
    setLoading(true)
    deleteFormSubmissionAction([data.id])
    router.refresh()
    setOpen(false)
    setLoading(false)
  }
  const handleCloseDetails = async () => {
    setOpenDetails(false)
    if (data.status === 'unread') {
      const r = await updateFormSubmissionStatusAction(data.id, 'read')
      if (r.success) router.refresh() //  داده‌های سرور دوباره گرفته می‌شن ولی کامپوننت‌ها remount نمی‌شن
    }
  }

  if (!canDelete && !canEdit) return null

  const translation = getTranslation({ translations: data.translations })
  const ModalDetailsContent = () => (
    <div className="flex flex-col">
      {formFields?.map((f: any) => (
        <div
          key={f.id}
          className="flex flex-row gap-2 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
        >
          <div>{f.label?.[locale]}:</div>
          <div className="font-light leading-relaxed">
            {translation.values[f.name]}
          </div>
        </div>
      ))}
      <div className="pt-6 space-x-reverse space-x-2 flex items-center justify-end w-full">
        <Button
          disabled={loading}
          variant="outline"
          onClick={handleCloseDetails}
        >
          بستن
        </Button>
      </div>
    </div>
  )
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
      <Modal
        size={'large'}
        title={'جزييات فرم'}
        description={''}
        isOpen={openDetails}
        onCloseModal={handleCloseDetails}
        content={<ModalDetailsContent />}
      />
      <div className="flex flex-row items-center">
        <Button
          title="مشاهده"
          variant="ghost"
          onClick={() => setOpenDetails(true)}
        >
          <Eye className=" h-4 w-4" />
        </Button>
        <Button title="حذف" variant="ghost" onClick={() => setOpen(true)}>
          <Trash className=" h-4 w-4" />
        </Button>
      </div>
    </>
  )
}
