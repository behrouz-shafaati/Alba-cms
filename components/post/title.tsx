import React from 'react'

type PostCoverProps = {
  title: string
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostTitle = ({ title, styles = {}, ...props }: PostCoverProps) => {
  return (
    <h1 style={styles} {...props} className="text-[1.2rem]">
      {title}
    </h1>
  )
}
