'use server'
import templateCtrl from '@/features/template/controller'
import { Template } from '@/features/template/interface'
import RendererRows from '../pageRenderer/RenderRows'
import { Settings } from '@/features/settings/interface'

type Props = {
  template: Template
  siteSettings: Settings
  content_all: any
  editroMode: boolean
  [key: string]: any // اجازه props داینامیک مثل content_1, content_2
  pageSlug: string | null
  categorySlug: string | null
  searchParams?: any
}

const RendererTemplate = async ({
  template,
  siteSettings,
  content_all,
  editroMode = false,
  pageSlug = null,
  categorySlug = null,
  searchParams = {},
  ...rest
}: Props) => {
  const parentTemplateId = template.parent
  if (parentTemplateId) {
    const [parentTemplate] = await Promise.all([
      templateCtrl.findById({ id: parentTemplateId }),
    ])
    return (
      <RendererRows
        siteSettings={siteSettings}
        rows={parentTemplate?.content.rows}
        editroMode={false}
        pageSlug={pageSlug}
        categorySlug={categorySlug}
        searchParams={searchParams}
        content_all={
          <RendererRows
            siteSettings={siteSettings}
            rows={template?.content.rows}
            editroMode={false}
            content_all={content_all}
            pageSlug={pageSlug}
            categorySlug={categorySlug}
            searchParams={searchParams}
            {...rest}
          />
        }
      />
    )
  }

  return (
    <RendererRows
      siteSettings={siteSettings}
      rows={template?.content.rows}
      editroMode={false}
      content_all={content_all}
      pageSlug={pageSlug}
      categorySlug={categorySlug}
      searchParams={searchParams}
      {...rest}
    />
  )
}

export default RendererTemplate
