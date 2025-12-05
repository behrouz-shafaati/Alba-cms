import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import timeAgo from '@/lib/utils/timeAgo'

type PostCoverProps = {
  createdAt: any
  author: { name: string }
  readingDuration: any
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostMetaData = ({
  createdAt,
  author,
  readingDuration,
  styles = {},
  ...restProps
}: PostCoverProps) => {
  console.log('PostMetaData rendered for:', author?.name)
  return (
    <div style={styles} {...restProps} className="text-sm text-gray-500 mb-4">
      <div className="flex gap-2">
        <div>
          <Avatar>
            <AvatarImage src={author?.image?.srcSmall || ''} />
            <AvatarFallback>{author?.name[0] || '?'}</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-xs  flex flex-col justify-between">
          <Link href={`/author/${author?.userName}`} className="flex gap-4">
            <span>{author?.name}</span>
          </Link>
          <span className="font-thin">
            خواندن {readingDuration} دقیقه . {timeAgo(createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}
