'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Braces as TagIcon, Mail as MailIcon, Trash } from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../../../hooks/use-toast'
import { createTag, deleteTagsAction, updateTag } from '../actions'
import Text from '../../../components/form-fields/text'
import SubmitButton from '../../../components/form-fields/submit-button'
import { AlertModal } from '../../../components/modal/alert-modal'
import { Tag } from '../interface'
import FileUpload from '../../../components/form-fields/file-upload'
import Select from '../../../components/form-fields/select'
import { useRouter } from 'next/navigation'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'
import { Label } from '@/components/ui/label'
import StickyBox from 'react-sticky-box'
import TiptapEditorLazy from '@/components/tiptap-editor/TiptapEditorLazy'
import IconPicker from '@/components/form-fields/IconPicker'

export const IMG_MAX_LIMIT = 1

interface TagFormProps {
  initialData: any | null
  allTags: Tag[]
}

export const TagForm: React.FC<TagFormProps> = ({ initialData: tag }) => {
  const locale = 'fa'
  const router = useRouter()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = can(userRoles, 'tag.create')
  const canEdit = can(
    userRoles,
    tag?.user.id !== user?.id ? 'tag.edit.any' : 'tag.edit.own'
  )
  const canDelete = can(
    userRoles,
    tag?.user.id !== user?.id ? 'tag.delete.any' : 'tag.delete.own'
  )
  const translation: any =
    tag?.translations?.find((t: any) => t.lang === locale) ||
    tag?.translations[0] ||
    {}
  const initialState = {
    message: null,
    errors: {},
    values: { ...tag, translation },
  }
  const formRef = useRef<HTMLFormElement>(null)
  const actionHandler = tag ? updateTag.bind(null, String(tag.id)) : createTag
  const [state, dispatch] = useActionState(actionHandler as any, initialState)

  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: 'destructive',
        title: '',
        description: state.message,
      })
  }, [state])
  if ((tag && !canEdit) || !canCreate) return <AccessDenied />
  const title = tag ? 'ویرایش برچسب' : 'افزودن برچسب'
  const description = tag ? 'ویرایش برچسب' : 'افزودن برچسب'

  const statusOptions = [
    {
      label: 'فعال',
      value: 'active',
    },
    {
      label: 'غیر فعال',
      value: 'inactive',
    },
  ]

  const onDelete = async () => {
    try {
      setLoading(true)
      const deleteResult = await deleteTagsAction([tag?.id])
      if (deleteResult?.success) router.replace('/dashboard/tags')
      else {
        setOpen(false)
        setLoading(false)
        toast({
          variant: deleteResult?.success ? 'default' : 'destructive',
          description: deleteResult?.message,
        })
      }
    } catch (error: any) {}
  }

  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {tag && canDelete && (
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
      <form
        action={dispatch}
        className="md:grid md:grid-cols-12 gap-8"
        ref={formRef}
      >
        <div className="col-span-12 md:col-span-9">
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
            icon={<TagIcon className="w-4 h-4" />}
          />
          <Text
            title="نامک"
            name="slug"
            defaultValue={state?.values?.slug || ''}
            placeholder="نامک"
            state={state}
            icon={<TagIcon className="w-4 h-4" />}
          />
          {/* description contentJson*/}

          <Label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            توضیحات
          </Label>
          <TiptapEditorLazy
            attachedFilesTo={[{ feature: 'tag', id: tag?.id || null }]}
            name="description"
            defaultContent={
              tag ? JSON.parse(state?.values?.translation?.description) : {}
            }
            onChangeFiles={submitManually}
            className="h-full"
            onLoading={setLoading}
          />
        </div>
        <div className="relative col-span-12 md:col-span-3 gap-2">
          <StickyBox offsetBottom={0}>
            <SubmitButton loading={loading} className="my-4 w-full" />
            {/* status */}
            <Select
              title="وضعیت"
              name="status"
              defaultValue={state?.values?.translation?.status || 'active'}
              options={statusOptions}
              placeholder="وضعیت"
              state={state}
              icon={<MailIcon className="w-4 h-4" />}
            />
            <IconPicker
              title="آیکون"
              name="icon"
              defaultValue={state?.values?.icon}
            />
            <FileUpload
              title="تصویر شاخص برچسب"
              name="image"
              state={state}
              maxFiles={1}
              allowedFileTypes={['image']}
              defaultValues={tag?.image}
              onLoading={setLoading}
            />
          </StickyBox>
        </div>
      </form>
    </>
  )
}
