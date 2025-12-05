'use client'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Dispatch, SetStateAction, useState } from 'react'

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
 * @param {Array<{label: string, slug: string}>} props.items - List of items to render as clickable badges
 * @param {string} [props.className] - Optional extra classes for the container
 */
export default function SelectableTags({
  items,
  className = '',
  setSelectedTag,
}: {
  items: { label: string; slug: string }[]
  className?: string
  setSelectedTag: Dispatch<SetStateAction<string>>
}) {
  const [selected, setSelected] = useState('')

  let selectedTagExistInItems = items.some((item) => item.slug === selected)

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items?.map((item, index) => (
        <Badge
          key={index}
          onClick={() => {
            setSelectedTag(item.slug)
            setSelected(item.slug)
          }}
          variant="outline"
          className={cn(
            'p-2 text-xs text-gray-600 dark:text-gray-100 font-normal cursor-pointer px-4',
            {
              'bg-primary text-white':
                (selectedTagExistInItems && item.slug === selected) ||
                (!selectedTagExistInItems && index == 0),
            }
          )}
        >
          {item.label}
        </Badge>
      ))}
    </div>
  )
}
