import { BreadCrumb } from '@/components/breadcrumb'
import React from 'react'
import tagCtrl from '@/features/tag/controller'
import { notFound } from 'next/navigation'
import { TagForm } from '@/features/tag/ui/tag-form'
import { TagTranslationSchema } from '@/features/tag/interface'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const locale = 'fa' //  from formData
  const resolvedParams = await params
  const { id } = resolvedParams
  let tag = null,
    allTags
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/tags/create',
  }
  if (id !== 'create') {
    ;[tag, allTags] = await Promise.all([
      tagCtrl.findById({ id }),
      tagCtrl.findAll({}),
    ])

    if (!tag) {
      notFound()
    }

    const translation: TagTranslationSchema =
      tag?.translations?.find((t: TagTranslationSchema) => t.lang === locale) ||
      tag?.translations[0] ||
      {}

    pageBreadCrumb = {
      title: translation?.title,
      link: `/dashboard/tags/${id}`,
    }
  } else {
    ;[allTags] = await Promise.all([tagCtrl.findAll({})])
  }

  const breadcrumbItems = [
    { title: 'برچسب ها', link: '/dashboard/tags' },
    pageBreadCrumb,
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <TagForm initialData={tag} allTags={allTags.data} />
      </div>
    </>
  )
}
