import React from 'react'
import { BreadCrumb } from '../breadcrumb'

type PostCoverProps = {
  content: any
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostBreadcrumb = ({
  content,
  styles = {},
  ...props
}: PostCoverProps) => {
  return content ? (
    <div style={styles} {...props} className="text-sm text-gray-500 ">
      <div className="flex-1 space-y-4 mt-4 mb-3">
        <BreadCrumb items={content} />
      </div>
    </div>
  ) : (
    <></>
  )
}
