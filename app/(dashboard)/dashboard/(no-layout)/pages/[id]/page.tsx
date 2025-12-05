import React from 'react'
import pageCtrl from '@/features/page/controller'
import { notFound } from 'next/navigation'
import { PageForm } from '@/features/page/ui/page-form'
import categoryCtrl from '@/features/category/controller'
import headerCtrl from '@/features/template/controller'
import templateCtrl from '@/features/template/controller'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  let page = null,
    allTemplates,
    allCategories,
    allHeaders
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/pages/create',
  }
  if (id !== 'create') {
    ;[page, allTemplates, allCategories, allHeaders] = await Promise.all([
      pageCtrl.findById({ id }),
      templateCtrl.findAll({}),
      categoryCtrl.findAll({}),
      headerCtrl.findAll({}),
    ])

    if (!page) {
      notFound()
    }
    pageBreadCrumb = {
      title: page.title,
      link: `/dashboard/pages/${id}`,
    }
  } else {
    ;[allTemplates, allCategories, allHeaders] = await Promise.all([
      pageCtrl.findAll({ filters: { type: 'template' } }),
      categoryCtrl.findAll({}),
      headerCtrl.findAll({}),
    ])
  }
  return (
    <>
      <PageForm
        initialData={page}
        allTemplates={allTemplates.data}
        allCategories={allCategories.data}
        allHeaders={allHeaders.data}
      />
    </>
  )
}
