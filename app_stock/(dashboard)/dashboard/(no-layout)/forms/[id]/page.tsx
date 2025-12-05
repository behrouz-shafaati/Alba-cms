import React from 'react'
import { notFound } from 'next/navigation'
import { Form } from '@/features/form/ui/form'
import templatePartCtrl from '@/features/form/controller'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  let page = null
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/forms/create',
  }
  if (id !== 'create') {
    ;[page] = await Promise.all([templatePartCtrl.findById({ id })])

    if (!page) {
      notFound()
    }
    pageBreadCrumb = {
      title: page.title,
      link: `/dashboard/forms/${id}`,
    }
  }
  return (
    <>
      <Form initialData={page} />
    </>
  )
}
