// ورودی اصلی صفحه‌ساز (ترکیب درگ‌اند‌دراپ و بلاک رندر)
import { PageContent } from './types'
import BuilderCanvas from '../builder-canvas'
import SettingsPanel from './SettingsPanel'
import { Category } from '@/features/category/interface'
import { blockRegistry } from './registry/blockRegistry'
import { blockRegistry as pageBlockregistry } from '../builder-page/registry/blockRegistry'
import { Template } from '@/features/template/interface'

type BuilderPageProp = {
  title?: string
  name: string
  submitFormHandler: (prevState: any, formData: FormData) => Promise<any>
  initialContent?: PageContent
  allTemplates: Template[]
  allCategories: Category[]
}

export default function BuilderTemplate({
  title = 'قالب ساز',
  initialContent,
  name = 'contentJson',
  submitFormHandler,
  allTemplates,
  allCategories,
}: BuilderPageProp) {
  console.log('#0000 initialContent:', initialContent)
  return (
    <BuilderCanvas
      title={title}
      name={name}
      settingsPanel={
        <SettingsPanel
          allCategories={allCategories}
          allTemplates={allTemplates}
        />
      }
      submitFormHandler={submitFormHandler}
      initialContent={initialContent}
      newBlocks={{ ...pageBlockregistry, ...blockRegistry }}
    />
  )
}
