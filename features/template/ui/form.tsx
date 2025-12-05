'use client'
import { useActionState, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import roleCtrl from '@/features/role/controller'
import {
  createTemplate,
  deleteTemplatesAction,
  updateTemplate,
} from '../actions'
import { Option } from '@/components/form-fields/combobox'
import { AlertModal } from '@/components/modal/alert-modal'
import BuilderTemplate from '@/components/builder-template'
import { Template } from '../interface'
import { Category } from '@/features/category/interface'
import CreateTemplateModal from './modal'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'

export const IMG_MAX_LIMIT = 3 //MB

interface TemplateFormProps {
  allCategories: Category[]
  allTemplates: Template[]
  initialData: Template | null
}

const defaultInitialValue = {
  title: '',
  type: 'template',
  status: 'active',
  rows: [],
}

export const Form: React.FC<TemplateFormProps> = ({
  allTemplates,
  allCategories,
  initialData: Template,
}) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = can(userRoles, 'template.create')
  const canEdit = can(
    userRoles,
    Template?.user !== user?.id ? 'template.edit.any' : 'template.edit.own'
  )
  const [defaultValue, setDefaultValue] = useState(defaultInitialValue)
  const [templateFor, setTemplateFor] = useState<string | null>(null)
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(!!Template)
  const initialState = { message: null, errors: {} }
  const actionHandler = Template
    ? updateTemplate.bind(null, String(Template.id))
    : createTemplate
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const roleOptions: Option[] = roleCtrl.getRoles().map((role) => ({
    label: role.title,
    value: role.slug,
  }))

  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = Template ? 'ویرایش قالب' : 'افزودن قالب'
  const description = Template ? 'ویرایش قالب' : 'افزودن قالب'
  const toastMessage = Template ? 'قالب بروزرسانی شد' : 'قالب اضافه شد'
  const action = Template ? 'ذخیره تغییرات' : 'ذخیره'

  const handleTemplateConfirm = (section: string) => {
    console.log('✅ کاربر انتخاب کرد:', section)
    setDefaultValue((state) => ({ ...state, templateFor: [section] }))
    setTemplateFor(section)
    // اینجا می‌تونی استیت بسازی که مشخص کنه قالب برای کدوم بخشه
    setShowTemplateBuilder(true)
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      deleteTemplatesAction([String(Template?.id)])
      router.replace('/dashboard/templates')
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state?.message && state.message !== null)
      toast({
        variant: state?.success ? 'default' : 'destructive',
        title: '',
        description: state.message,
      })
    if (state?.success && state?.isCreatedJustNow) {
      router.replace(`/dashboard/templates/${state?.values?.id}`)
    }
  }, [state])
  if (!canCreate && !canEdit) return <AccessDenied />
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      {/* <div className="flex items-center justify-between">
        {/* <Heading title={title} description={description} /> * /}
        {Template && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div> * /}
      {/* <Separator /> */}
      {!showTemplateBuilder && (
        <CreateTemplateModal
          onConfirm={handleTemplateConfirm}
          allCategories={allCategories}
        />
      )}
      {showTemplateBuilder && (
        <BuilderTemplate
          title="قالب ساز"
          name="contentJson"
          submitFormHandler={dispatch}
          allTemplates={allTemplates}
          allCategories={allCategories}
          {...(Template
            ? {
                initialContent: {
                  ...Template.content,
                  status: Template.status,
                },
              }
            : { initialContent: defaultValue })}
        />
      )}
    </>
  )
}
