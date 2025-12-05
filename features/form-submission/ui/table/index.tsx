import { Heading } from '@/components/ui/heading'
import formSubmissionCtrl from '@/features/form-submission/controller'
import { FormSubmission } from '@/features/form-submission/interface'
import { QueryResponse } from '@/lib/entity/core/interface'
import { getSession } from '@/lib/auth'
import { User } from '@/features/user/interface'
import { can } from '@/lib/utils/can.client'
import formCtrl from '@/features/form/controller'
import { getTranslation } from '@/lib/utils'
import { FormTranslationSchema } from '@/features/form/interface'
import FormSubmissionClientTable from './FormSubmissionClientTable'

interface CategoriesTableProps {
  formId: string
  query: string
  page: number
}

export default async function FormSubmissionTable({
  formId,
  query,
  page,
}: CategoriesTableProps) {
  let filters = { query }
  const user = (await getSession())?.user as User
  if (!(await can(user.roles, 'formSubmission.view.any'))) {
    filters = { ...filters, user: user.id }
  }
  const canCreate = await can(user.roles, 'formSubmission.create')

  const [formSubmissionResult, form] = await Promise.all([
    formSubmissionCtrl.find({
      filters,
      pagination: { page, perPage: 6 },
    }),
    formCtrl.findById({ id: formId }),
  ])

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`پیام‌های دریافتی ${form.title} (${
            formSubmissionResult?.totalDocuments || 0
          })`}
          description={`مدیریت  پیام‌های دریافتی فرم ${form.title}`}
        />
        {/* {canCreate && (
          <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/formSubmissions/create"
          >
            <Plus className="ml-2 h-4 w-4" /> افزودن فرم
          </LinkButton>
        )} */}
      </div>
      <FormSubmissionClientTable
        fields={form?.fields}
        response={formSubmissionResult}
      />
    </>
  )
}
