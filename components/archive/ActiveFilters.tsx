'use client'
import { buildUrlFromFilters } from '@/lib/utils/buildUrlFromFilters'
import { Option } from '@/types'
import { Trash, X } from 'lucide-react'
import Link from 'next/link'

type Props = {
  initial: {
    categories: Option[]
    tags: Option[]
  }
}

export default function ActiveFilters({ initial }: Props) {
  const { categories = [], tags = [] } = initial
  let FlgActiveFilter = false
  if (categories.length > 0 || tags.length > 0) FlgActiveFilter = true

  const createHref = (type: 'tags' | 'categories', value: string): string => {
    //  وقتی فیلترها عوض شدن، همیشه برگرد به صفحه ۱
    const newPage = 1
    const perPage = 10
    let _tags =
      type == 'tags'
        ? tags.filter((tag) => tag.value !== value).map((tag) => tag.value)
        : tags.map((tag) => tag.value)
    let _Categories =
      type == 'categories'
        ? categories
            .filter((cat) => cat.value !== value)
            .map((cat) => cat.value)
        : categories.map((cat) => cat.value)
    let showMoreHref = '/archive'
    showMoreHref =
      tags.length != 0 || categories.length != 0
        ? showMoreHref +
          '/' +
          buildUrlFromFilters({
            tags: _tags,
            categories: _Categories,
          })
        : showMoreHref

    const searchPaeams = `?page=${newPage}&perPage=${perPage}`
    return showMoreHref + searchPaeams
  }
  return (
    <div>
      {FlgActiveFilter && (
        <Link href="/archive" scroll={false}>
          <div className="inline-flex flex-row border p-2 bg-secondary text-gray-800 dark:text-gray-100 gap-2 w-auto rounded-full items-center text-xs m-1 font-light">
            <Trash className="w-4 h-4" /> <span>حذف همه</span>
          </div>
        </Link>
      )}
      <div>
        {categories.map((cat) => {
          return (
            <div
              key={cat?.id}
              className="inline-flex flex-row border p-2 bg-secondary text-gray-800 dark:text-gray-100 gap-2 w-auto rounded-full items-center text-xs m-1 font-light"
            >
              <span>دسته: {cat.label}</span>
              <Link
                href={createHref('categories', cat.value)}
                scroll={false}
                className="hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-4 w-4" />
              </Link>
            </div>
          )
        })}
        {tags.map((tag) => {
          return (
            <div
              key={tag?.id}
              className="inline-flex flex-row border p-2 bg-secondary text-gray-800 dark:text-gray-100 gap-2 w-auto rounded-full items-center text-xs m-1 font-light"
            >
              <span>برچسب: {tag.label}</span>
              <Link
                href={createHref('categories', tag.value)}
                scroll={false}
                className="hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-4 w-4" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
