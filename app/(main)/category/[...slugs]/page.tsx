// export const dynamic = 'force-dynamic'
// export const dynamic = 'auto'
export const dynamic = 'force-static'
import React from 'react'
import templateCtrl from '@/features/template/controller'
import type { Metadata } from 'next'
import CategoryPostList from '@/features/category/ui/component/CategoryPostList'
import categoryCtrl from '@/features/category/controller'
import { buildCategoryHref } from '@/features/category/utils'
import { getTranslation } from '@/lib/utils'
import { Category } from '@/features/category/interface'
import { getSettings } from '@/features/settings/controller'
import RendererTemplate from '@/components/builder-canvas/templateRender/RenderTemplate.server'
import CategoryDescription from '@/features/category/ui/component/Description'
import pageCtrl from '@/features/page/controller'
import postCtrl from '@/features/post/controller'

interface PageProps {
  params: Promise<{ slugs: string[] }>
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

export async function generateStaticParams() {
  return categoryCtrl.generateStaticParams()
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = 'fa'
  const resolvedParams = await params
  const { slugs } = resolvedParams

  const slug = decodeURIComponent(slugs[slugs.length - 1])
  let findResult = null

  ;[findResult] = await Promise.all([
    categoryCtrl.find({ filters: { slug: slug } }),
  ])
  const category: Category = findResult?.data[0] || null
  if (!category) {
    return {
      title: 'دسته یافت نشد',
      description: 'دسته‌ی درخواستی موجود نیست',
    }
  }
  const href = buildCategoryHref(category)
  const translation = getTranslation({ translations: category?.translations })

  return {
    title: translation?.title,
    description: translation?.excerpt,
    openGraph: {
      title: translation?.title,
      description: translation?.excerpt,
      url: href,
    },
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const locale = 'fa'
  const resolvedParams = await params
  const { slugs } = resolvedParams
  const resolvedSearchParams = await searchParams
  // const { query = '', page = '1' } = resolvedSearchParams
  const categorySlug = decodeURIComponent(slugs[slugs.length - 1])

  const [categoryResult, template, siteSettings] = await Promise.all([
    categoryCtrl.find({ filters: { slug: categorySlug } }),
    templateCtrl.getTemplate({ slug: categorySlug }),
    getSettings(),
  ])

  // const StaticParams = await categoryCtrl.generateStaticParams()
  // const StaticParamspage = await pageCtrl.generateStaticParams()
  // const StaticParamspost = await postCtrl.generateStaticParams()
  // console.log('# generateStaticParams category:', StaticParams)
  // console.log('#generateStaticParams page:', StaticParamspage)
  // console.log('#generateStaticParams post:', StaticParamspost)

  const category = categoryResult.data?.[0] || null
  const translation = getTranslation({ translations: category?.translations })
  if (template)
    return (
      <RendererTemplate
        template={template}
        siteSettings={siteSettings}
        pageSlug={categorySlug}
        categorySlug={categorySlug}
        editroMode={false}
        content_all={
          <CategoryPostList category={category} slug={categorySlug} page={1} />
        }
        content_category_description={
          <CategoryDescription contentJson={translation?.description} />
        }
        searchParams={resolvedSearchParams}
      />
    )

  return <CategoryPostList category={category} slug={categorySlug} page={1} />
}
