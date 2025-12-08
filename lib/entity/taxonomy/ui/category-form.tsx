'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Braces as TaxonomyIcon,
  ListTree,
  Mail as MailIcon,
  Tag,
  ToggleLeft,
  Trash,
} from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../../../hooks/use-toast'
import {
  createTaxonomy,
  deleteTaxonomysAction,
  updateTaxonomy,
} from '../actions'
import Text from '../../../components/form-fields/text'
import SubmitButton from '../../../components/form-fields/submit-button'
import { Option } from '../../../components/form-fields/combobox'
import { AlertModal } from '../../../components/modal/alert-modal'
import Combobox from '../../../components/form-fields/combobox'
import { Taxonomy, TaxonomyTranslationSchema } from '../interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import FileUpload from '../../../components/form-fields/file-upload'
import Select from '../../../components/form-fields/select'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'
import StickyBox from 'react-sticky-box'
import { Label } from '@/components/ui/label'
import TiptapEditorLazy from '@/components/tiptap-editor/TiptapEditorLazy'
import IconPicker from '@/components/form-fields/IconPicker'

export const IMG_MAX_LIMIT = 1

interface TaxonomyFormProps {
  initialData: any | null
  allTaxonomies: Taxonomy[]
}

export const TaxonomyForm: React.FC<TaxonomyFormProps> = ({
  initialData: taxonomy,
  allTaxonomies,
}) => {
  const locale = 'fa' //  from formData
  const router = useRouter()
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = can(userRoles, 'taxonomy.create')
  const canEdit = can(
    userRoles,
    taxonomy?.user.id !== user?.id ? 'taxonomy.edit.any' : 'taxonomy.edit.own'
  )
  const canDelete = can(
    userRoles,
    taxonomy?.user.id !== user?.id
      ? 'taxonomy.delete.any'
      : 'taxonomy.delete.own'
  )
  const translation: TaxonomyTranslationSchema =
    taxonomy?.translations?.find(
      (t: TaxonomyTranslationSchema) => t.lang === locale
    ) ||
    taxonomy?.translations[0] ||
    {}
  const formRef = useRef<HTMLFormElement>(null)
  const initialState = {
    message: null,
    errors: {},
    values: { ...taxonomy, translation },
  }
  const actionHandler = taxonomy
    ? updateTaxonomy.bind(null, String(taxonomy.id))
    : createTaxonomy
  const [state, dispatch] = useActionState(actionHandler as any, initialState)

  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = taxonomy ? 'ویرایش دسته بندی' : 'افزودن دسته بندی'
  const description = taxonomy ? 'ویرایش دسته بندی' : 'افزودن دسته بندی'

  const parentOptions: Option[] = allTaxonomies.map((taxonomy: Taxonomy) => {
    const translation: any =
      taxonomy?.translations?.find((t: any) => t.lang === locale) ||
      taxonomy?.translations[0] ||
      {}

    return {
      value: String(taxonomy.id),
      label: createCatrgoryBreadcrumb(taxonomy, translation?.title),
    }
  })

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
      const deleteResult = await deleteTaxonomysAction([taxonomy?.id])
      if (deleteResult?.success) router.replace('/dashboard/taxonomies')
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

  useEffect(() => {
    console.log('#234kuiyh state:', state)
    if (state.message && state.message !== null)
      toast({
        variant: 'destructive',
        title: '',
        description: state.message,
      })
  }, [state])
  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }

  if ((taxonomy && !canEdit) || !canCreate) return <AccessDenied />
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {taxonomy && canDelete && (
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
      <form action={dispatch} className="grid grid-cols-12 gap-8" ref={formRef}>
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
            icon={<TaxonomyIcon className="w-4 h-4" />}
          />
          <Text
            title="نامک"
            name="slug"
            defaultValue={state?.values?.slug || ''}
            placeholder="نامک"
            state={state}
            icon={<Tag className="w-4 h-4" />}
          />
          {/* Parent */}
          <Combobox
            title="دسته والد"
            name="parent"
            defaultValue={state?.values?.parent?.id}
            options={parentOptions}
            placeholder="دسته والد"
            state={state}
            icon={<ListTree className="w-4 h-4" />}
          />
          {/* description contentJson*/}

          <Label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            توضیحات
          </Label>
          <TiptapEditorLazy
            attachedFilesTo={[
              { feature: 'taxonomy', id: taxonomy?.id || null },
            ]}
            name="description"
            defaultContent={
              taxonomy
                ? JSON.parse(state?.values?.translation?.description)
                : {}
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
              defaultValue={state?.values?.status}
              options={statusOptions}
              placeholder="وضعیت"
              state={state}
              icon={<ToggleLeft className="w-4 h-4" />}
            />
            <IconPicker
              title="آیکون"
              name="icon"
              defaultValue={state?.values?.icon}
            />
            <FileUpload
              title="تصویر شاخص دسته بندی"
              name="image"
              state={state}
              maxFiles={1}
              allowedFileTypes={['image']}
              defaultValues={state?.values?.image}
              onLoading={setLoading}
            />
          </StickyBox>
        </div>
      </form>
    </>
  )
}
