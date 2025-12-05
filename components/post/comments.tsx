import React from 'react'

type PostCoverProps = {
  content: any
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostComments = ({
  content,
  styles = {},
  ...props
}: PostCoverProps) => {
  return (
    <div style={styles} {...props}>
      {content}
    </div>
  )
}
