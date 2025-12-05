import { BreadCrumb } from '@/components/breadcrumb'
import React from 'react'
import campaignCtrl from '@/features/campaign/controller'
import { notFound } from 'next/navigation'
import { CampaignForm } from '@/features/campaign/ui/campaign-form'
import { FileTranslationSchema } from '@/lib/entity/file/interface'
import categoryCtrl from '@/features/category/controller'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const locale = 'fa' //  from formData
  const resolvedParams = await params
  const { id } = resolvedParams
  let campaign = null,
    allCategories
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/campaigns/create',
  }
  if (id !== 'create') {
    ;[campaign, allCategories] = await Promise.all([
      campaignCtrl.findById({ id }),
      categoryCtrl.findAll({}),
    ])

    if (!campaign) {
      notFound()
    }

    const translation: FileTranslationSchema =
      campaign?.translations?.find(
        (t: FileTranslationSchema) => t.lang === locale
      ) ||
      campaign?.translations[0] ||
      {}

    pageBreadCrumb = {
      title: translation?.title,
      link: `/dashboard/campaigns/${id}`,
    }
  } else {
    ;[allCategories] = await Promise.all([categoryCtrl.findAll({})])
  }

  const breadcrumbItems = [
    { title: 'دسته ها', link: '/dashboard/campaigns' },
    pageBreadCrumb,
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CampaignForm
          initialData={campaign}
          allCategories={allCategories.data}
        />
      </div>
    </>
  )
}
