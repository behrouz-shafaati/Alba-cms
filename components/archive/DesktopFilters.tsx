'use client'
import { buildUrlFromFilters, getTranslation } from '@/lib/utils'
import { Filter } from '../Filter'
import { useEffect, useRef, useState } from 'react'
import { Option } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { Settings } from '@/features/settings/interface'

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
  const [selectedCategory, setSelectedCategory] = useState<Option[]>(
    defaultSelectedCategories || []
  )
  const [selectedTag, setSelectedTag] = useState<Option[]>(
    defaultSelectedTags || []
  )

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
      selectedTag.length != 0 || selectedCategory.length != 0
        ? showMoreHref +
          '/' +
          buildUrlFromFilters({
            tags: selectedTag.map((tag) => tag.value),
            categories: selectedCategory.map((cat) => cat.value),
          })
        : showMoreHref

    const searchPaeams = `?page=${newPage}&perPage=${perPage}`
    router.replace(showMoreHref + searchPaeams, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedTag, selectedCategory])
  return (
    <div
      className="sticky py-2"
      style={{ top: `${siteSettings?.desktopHeaderHeight}px` }}
    >
      <Filter
        options={categoryOptions}
        defaultValue={selectedCategory}
        placeholder="جستجو در دسته"
        className="mt-4"
        onChange={(cats) => {
          setSelectedCategory(cats)
          hasUserChangedFilters.current = true
        }}
      />
      <Filter
        options={tagOptions}
        defaultValue={selectedTag}
        placeholder="جستجو در برچسب"
        className="mt-4"
        onChange={(tags) => {
          setSelectedTag(tags)
          hasUserChangedFilters.current = true
        }}
      />
    </div>
  )
}
