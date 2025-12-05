import { BreadCrumb } from '@/components/breadcrumb'
import React from 'react'
import categoryCtrl from '@/features/category/controller'
import { notFound } from 'next/navigation'
import { CategoryForm } from '@/features/category/ui/category-form'
import { FileTranslationSchema } from '@/lib/entity/file/interface'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const locale = 'fa' //  from formData
  const resolvedParams = await params
  const { id } = resolvedParams
  let category = null,
    allCategories
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/categories/create',
  }
  if (id !== 'create') {
    ;[category, allCategories] = await Promise.all([
      categoryCtrl.findById({ id }),
      categoryCtrl.findAll({}),
    ])

    if (!category) {
      notFound()
    }

    const translation: FileTranslationSchema =
      category?.translations?.find(
        (t: FileTranslationSchema) => t.lang === locale
      ) ||
      category?.translations[0] ||
      {}

    pageBreadCrumb = {
      title: translation?.title,
      link: `/dashboard/categories/${id}`,
    }
  } else {
    ;[allCategories] = await Promise.all([categoryCtrl.findAll({})])
  }

  const breadcrumbItems = [
    { title: 'دسته ها', link: '/dashboard/categories' },
    pageBreadCrumb,
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CategoryForm
          initialData={category}
          allCategories={allCategories.data}
        />
      </div>
    </>
  )
}
