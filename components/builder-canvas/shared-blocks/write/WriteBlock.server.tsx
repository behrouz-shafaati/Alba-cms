// کامپوننت نمایشی بلاک
'use server'
import React from 'react'
import { Block } from '../../types'
import { computedStyles } from '../../utils/styleUtils'
import { renderTiptapAction } from '@/components/tiptap-editor/render/renderTiptapAction'
import EnhanceHtmlForNext from '@/components/tiptap-editor/render/EnhanceHtmlForNext'
import { getSettingsAction } from '@/features/settings/actions'

type WriteBlockProps = {
  widgetName: string
  blockData: {
    content: {
      write: string
    }
    type: 'write'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const WriteBlock = async ({
  widgetName,
  blockData,
  ...props
}: WriteBlockProps) => {
  const { content, settings } = blockData
  if (!content?.json) return null

  const [HTML_string, siteSettings] = await Promise.all([
    renderTiptapAction({
      contentJson: content?.json,
    }),
    getSettingsAction(),
  ])
  return (
    <div
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...props}
    >
      <EnhanceHtmlForNext
        siteSettings={siteSettings}
        HTML_string={HTML_string}
        contentJson={content?.json}
      />
    </div>
  )
}
