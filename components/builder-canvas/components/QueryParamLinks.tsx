'use client'
import { FastLink } from '@/components/FastLink'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
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
  searchParams = {},
}: {
  paramKey?: string
  items: { label: string; value: string }[]
  className?: string
  searchParams?: any
}) {
  let selectedTagExistInItems = items.some(
    (item) => item.value === searchParams?.tag
  )

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items?.map((item, index) => (
        <FastLink
          href={`_sp_${paramKey}=${item.value}`}
          key={item.value}
          scroll={false}
          data-nprogress="off"
        >
          <Badge
            key={item.value}
            variant="outline"
            className={cn(
              '!p-2 text-xs text-gray-600 dark:text-gray-100 font-normal cursor-pointer !px-4',
              {
                'bg-primary text-white':
                  (selectedTagExistInItems &&
                    item.value === searchParams?.tag) ||
                  (!selectedTagExistInItems && index == 0),
              }
            )}
          >
            {item.label}
          </Badge>
        </FastLink>
      ))}
    </div>
  )
}
