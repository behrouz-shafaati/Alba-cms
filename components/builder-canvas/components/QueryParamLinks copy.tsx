'use client'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

/**
 * A reusable component that renders clickable items which update a specific query parameter in the URL.
 *
 * ✅ Features:
 * - Updates the URL query string without reloading the page
 * - Keeps the current scroll position
 * - Can be used for filters, tags, categories, etc.
 *
 * @example
 * ```tsx
 * <QueryParamLinks
 *   paramKey="tag"
 *   items={[
 *     { label: 'React', slug: 'react' },
 *     { label: 'Next.js', slug: 'nextjs' },
 *   ]}
 * />
 * ```
 *
 * @param {Object} props
 * @param {string} props.paramKey - The name of the query parameter to set (e.g. "tag", "filter", "ls")
 * @param {Array<{label: string, slug: string}>} props.items - List of items to render as clickable badges
 * @param {string} [props.className] - Optional extra classes for the container
 */
export default function QueryParamLinks({
  paramKey = 'param',
  items,
  className = '',
}: // searchParams,
{
  paramKey?: string
  items: { label: string; slug: string }[]
  className?: string
  searchParams?: any
}) {
  const [selectedTag, setSelectedTag] = useState('')

  let selectedTagExistInItems = items.some((item) => item.slug === selectedTag)

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items?.map((item, index) => (
        <Link
          href={`?${paramKey}=${item.slug}`}
          key={item.slug}
          scroll={false}
          data-nprogress="off"
          onClick={() => setSelectedTag(item.slug)}
        >
          <Badge
            key={item.slug}
            variant="outline"
            className={cn(
              'p-2 text-xs text-gray-600 dark:text-gray-100 font-normal cursor-pointer px-4',
              {
                'bg-primary text-white':
                  (selectedTagExistInItems && item.slug === selectedTag) ||
                  (!selectedTagExistInItems && index == 0),
              }
            )}
          >
            {item.label}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
