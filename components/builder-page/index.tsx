// ورودی اصلی صفحه‌ساز (ترکیب درگ‌اند‌دراپ و بلاک رندر)
import { PageContent } from './types'
import BuilderCanvas from '../builder-canvas'
import SettingsPanel from './SettingsPanel'
import { Category } from '@/features/category/interface'
import { blockRegistry } from './registry/blockRegistry'
// import { blockRegistry as templatePartBlockregistry } from '../builder-template-part/registry/blockRegistry'

type BuilderPageProp = {
  title?: string
  name: string
  submitFormHandler: (prevState: any, formData: FormData) => Promise<any>
  initialContent?: PageContent
  allTemplates: PageContent[]
  allCategories: Category[]
}

const defaultInitialValue = {
  title: '',
  type: 'page',
  status: 'published',
  rows: [],
}

export default function BuilderPage({
  title = 'صفحه ساز',
  initialContent = defaultInitialValue,
  name = 'contentJson',
  submitFormHandler,
  allTemplates,
  allCategories,
}: BuilderPageProp) {
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
      newBlocks={{ ...blockRegistry }}
      // newBlocks={{ ...blockRegistry, ...templatePartBlockregistry }}
    />
  )
}
