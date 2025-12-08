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
      <div className="text-sm text-gray-500 mb-8 flex gap-2">
        {tags.map((t) => {
          const translation = getTranslation({ translations: t.translations })
          return (
            <Button variant="outline" size="sm" key={t.id} className="p-0">
              <FastLink
                href={`/archive/tags/${t.slug}`}
                className="flex gap-1 h-full px-2 items-center"
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
