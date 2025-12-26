'use client'
import { Filter } from '../Filter'
import { useEffect, useRef, useState } from 'react'
import { Option } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { Settings } from '@/features/settings/interface'
import ActiveFilters from './ActiveFilters'
import getTranslation from '@/lib/utils/getTranslation'
import { buildUrlFromFilters } from '@/lib/utils/buildUrlFromFilters'

type Props = {
  siteSettings: Settings
  allCategories: any
  allTags: any
  defaultSelectedCategories?: Option[]
  defaultSelectedTags?: Option[]
}

export function DesktopFilters({
  siteSettings,
  allCategories,
  allTags,
  defaultSelectedCategories,
  defaultSelectedTags,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const perPage = Number(searchParams.get('perPage')) || 10
  const [filters, setFilters] = useState<{
    tags: Option[]
    categories: Option[]
  }>({
    tags: defaultSelectedTags || [],
    categories: defaultSelectedCategories || [],
  })

  //  نگهداری اولین بار رندر شدن برای جلوگیری از اجرای اولیه‌ی useEffect
  const hasUserChangedFilters = useRef(false)

  const categoryOptions = allCategories.data.map((cat: any) => {
    const t = getTranslation({ translations: cat.translations })
    return {
      value: cat.slug,
      label: t?.title,
    }
  })

  const tagOptions = allTags.data.map((tag: any) => {
    const t = getTranslation({ translations: tag.translations })
    return {
      value: tag.slug,
      label: t?.title,
    }
  })
  useEffect(() => {
    if (!hasUserChangedFilters.current) {
      return
    }

    //  وقتی فیلترها عوض شدن، همیشه برگرد به صفحه ۱
    const newPage = 1

    let showMoreHref = '/archive'
    showMoreHref =
      filters?.tags.length != 0 || filters?.categories.length != 0
        ? showMoreHref +
          '/' +
          buildUrlFromFilters({
            tags: filters.tags.map((tag) => tag.value),
            categories: filters.categories.map((cat) => cat.value),
          })
        : showMoreHref

    const searchPaeams = `?page=${newPage}&perPage=${perPage}`
    router.replace(showMoreHref + searchPaeams, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filters])

  console.log('#234876 filters?.tags:', filters?.tags)
  console.log('#234876 tagOptions:', tagOptions)
  return (
    <div
      className="sticky py-2"
      style={{ top: `${siteSettings?.appearance?.desktopHeaderHeight}px` }}
    >
      <ActiveFilters initial={filters} />
      <Filter
        options={categoryOptions}
        defaultValue={filters?.categories}
        placeholder="جستجو در دسته"
        className="mt-4"
        onChange={(cats) => {
          setFilters((pre) => ({ ...pre, categories: cats }))
          hasUserChangedFilters.current = true
        }}
      />
      <Filter
        options={tagOptions}
        defaultValue={filters?.tags}
        placeholder="جستجو در برچسب"
        className="mt-4"
        onChange={(tags) => {
          setFilters((pre) => ({ ...pre, tags }))
          hasUserChangedFilters.current = true
        }}
      />
    </div>
  )
}
