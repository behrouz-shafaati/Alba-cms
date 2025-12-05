import { BreadCrumb } from '@/components/breadcrumb'
import React from 'react'
import menuCtrl from '@/features/menu/controller'
import { notFound } from 'next/navigation'
import { MenuForm } from '@/features/menu/ui/menu-form'
import { MenuTranslationSchema } from '@/features/menu/interface'

interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const locale = 'fa'
  const resolvedParams = await params
  const { id } = resolvedParams

  let menu = null
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/menus/create',
  }
  if (id !== 'create') {
    ;[menu] = await Promise.all([menuCtrl.findById({ id })])

    if (!menu) {
      notFound()
    }
    const translation: MenuTranslationSchema =
      menu?.translations?.find(
        (t: MenuTranslationSchema) => t.lang === locale
      ) ||
      menu?.translations[0] ||
      {}
    pageBreadCrumb = {
      title: translation?.title,
      link: `/dashboard/menus/${id}`,
    }
  }

  const breadcrumbItems = [
    { title: 'دسته ها', link: '/dashboard/menus' },
    pageBreadCrumb,
  ]
  return (
    <>
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <MenuForm initialData={menu} />
      </div>
    </>
  )
}
