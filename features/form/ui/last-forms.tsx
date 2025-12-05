import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import FormSubmissionCtrl from '@/features/form-submission/controller'
import { columns } from './table/columns'
import { QueryResponse } from '@/lib/entity/core/interface'
import { FormSubmission } from '../../form-submission/interface'
import { LinkButton } from '@/components/ui/link-button'
import formCtrl from '../controller'

interface FormTableProps {
  refetchDataUrl?: string
  filters: {
    status?: 'read' | 'unread'
    query?: string
    post?: string
  }
  page?: number
}

export default async function LastForms({ filters, page = 1 }: FormTableProps) {
  const findResult: QueryResponse<FormSubmission> =
    await FormSubmissionCtrl.find({
      filters,
      pagination: { page, perPage: 4 },
    })

  const formWithUnreadSubmissionIds = []

  for (const formSubmission of findResult.data) {
    if (!formWithUnreadSubmissionIds.includes(formSubmission?.form)) {
      formWithUnreadSubmissionIds.push(formSubmission?.form)
    }
  }

  const formResult = await formCtrl.find({
    filters: { _id: { $in: formWithUnreadSubmissionIds } },
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`پیام های دریافتی فرم‌ها`} description="" />
      </div>
      {findResult?.totalDocuments ? (
        <>
          <DataTable
            searchTitle="جستجو ..."
            columns={columns}
            response={formResult}
            showSearch={false}
            showFilters={false}
            showPagination={false}
            showGroupAction={false}
          />
          {/* <LinkButton
            className="text-xs md:text-sm"
            href="/dashboard/forms?page=1&status=unread"
          >
            بیشتر
          </LinkButton> */}
        </>
      ) : (
        <div className="flex text-center text-lg justify-center h-full items-center pb-8 ">
          پیام تازه ای دریافت نشده است
        </div>
      )}
    </>
  )
}
