// کامپوننت نمایشی بلاک
import { Block } from '../../../builder-canvas/types'
import { Template as TemplateType } from '@/features/template/interface'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import { Settings } from '@/features/settings/interface'

type TemplateProps = {
  siteSettings: Settings
  editroMode: boolean
  template: TemplateType
  blockData: {
    id: string
    type: 'templatePart'
    content: {
      templateId: string
    }
    settings: {}
  } & Block
  pageSlug: string | null
  categorySlug: string | null
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const TemplatePart = ({
  siteSettings,
  editroMode = false,
  template,
  blockData,
  pageSlug,
  categorySlug,
  ...props
}: TemplateProps) => {
  const { content, settings } = blockData
  const { className } = props

  return (
    <section {...props} className={`w-full z-50 ${className}`}>
      <RendererRows
        siteSettings={siteSettings}
        rows={template?.content?.rows}
        editroMode={editroMode}
        pageSlug={pageSlug}
        categorySlug={categorySlug}
        {...props}
      />
    </section>
  )
}
