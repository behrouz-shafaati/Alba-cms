import { getTranslation, timeAgo } from '@/lib/utils'
import React from 'react'
import { Tag } from '@/features/tag/interface'
import { Button } from '../ui/button'
import IconRenderer from '../builder-canvas/components/IconRenderer'
import { FastLink } from '../FastLink'

type PostCoverProps = {
  tags: Tag[]
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostTags = ({ tags, styles = {}, ...props }: PostCoverProps) => {
  return (
    <div style={styles} {...props}>
      <div className="text-sm text-gray-500 mb-8 flex flex-wrap gap-2">
        {tags.map((t) => {
          const translation = getTranslation({ translations: t.translations })
          return (
            <Button
              variant="outline"
              size="sm"
              key={t.id}
              className="inline-flex w-fit p-0 !justify-start"
            >
              <FastLink
                href={`/archive/tags/${t.slug}`}
                className="flex gap-1 px-2 items-center"
              >
                {t?.icon && t?.icon != '' && (
                  <IconRenderer name={t.icon} className={`w-5 h-5`} />
                )}
                {translation?.title}
              </FastLink>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
