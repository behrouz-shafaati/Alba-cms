'use client'
import { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heading as HeadingIcon, Trash } from 'lucide-react'
import { Heading } from '@/components/ui/heading'
import { useToast } from '@/hooks/use-toast'
import { createMenu, deleteMenusAction, updateMenu } from '../actions'
import Text from '@/components/form-fields/text'
import SubmitButton from '@/components/form-fields/submit-button'
import { AlertModal } from '@/components/modal/alert-modal'
import MenuBuilder from '@/components/menu-builder'
import { useRouter } from 'next/navigation'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'

interface MenuFormProps {
  initialData: any | null
}

export const MenuForm: React.FC<MenuFormProps> = ({ initialData: menu }) => {
  const locale = 'fa'
  const router = useRouter()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = can(userRoles, 'menu.create')
  const canEdit = can(
    userRoles,
    menu?.user !== user?.id ? 'menu.edit.any' : 'menu.edit.own'
  )
  const canDelete = can(
    userRoles,
    menu?.user !== user?.id ? 'menu.delete.any' : 'menu.delete.own'
  )
  const translation: any =
    menu?.translations?.find((t: any) => t.lang === locale) ||
    menu?.translations[0] ||
    {}
  const initialState = {
    message: null,
    errors: {},
    values: { ...menu, translation },
  }

  const isUpdate = menu ? true : false
  const actionHandler = isUpdate
    ? updateMenu.bind(null, String(menu.id))
    : createMenu
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = isUpdate ? 'ویرایش فهرست' : 'افزودن فهرست'
  const description = isUpdate ? 'ویرایش فهرست' : 'افزودن فهرست'

  const onDelete = async () => {
    try {
      setLoading(true)
      deleteMenusAction([menu?.id])
      router.replace('/dashboard/menus')
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: 'destructive',
        title: '',
        description: state.message,
      })

    console.log('#s665 state: ', state)
  }, [state, toast])

  if ((menu && !canEdit) || !canCreate) return <AccessDenied />

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {isUpdate && canDelete && (
          <>
            <AlertModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onConfirm={onDelete}
              loading={loading}
            />
            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {/* <Separator /> */}
      <form action={dispatch} className="w-full space-y-8">
        <div className="gap-8 md:grid md:grid-cols-3">
          <div className="flex flex-row items-center gap-2  col-span-3">
            <input
              type="text"
              name="lang"
              className="hidden"
              value="fa"
              readOnly
            />
            {/* Title */}
            <Text
              title="عنوان"
              name="title"
              defaultValue={state?.values?.translation?.title || ''}
              placeholder="عنوان"
              state={state}
              icon={<HeadingIcon className="h-4 w-4" />}
            />
            <SubmitButton />
          </div>

          <MenuBuilder
            name="itemsJson"
            initialMenu={state?.values?.translation?.items || []}
            maxDepth={1}
            className="col-span-2"
          />
        </div>
      </form>
    </>
  )
}
