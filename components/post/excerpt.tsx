import React from 'react'

type PostCoverProps = {
  content: any
  countWords?: number | null
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostExcerpt = ({
  content,
  countWords = null,
  styles = {},
  ...props
}: PostCoverProps) => {
  return (
    <article style={styles} {...props}>
      {content}
    </article>
  )
}
