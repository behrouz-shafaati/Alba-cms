import { schema } from './schema'
import { defaultSettings } from './defaultSettings'
import { ContentEditor } from './ContentEditor'
import SearchBlock from './Block'

export const SearchBlockDef = {
  type: 'search',
  label: 'جستجو',
  showInBlocksList: true,
  Renderer: SearchBlock,
  RendererInEditor: SearchBlock,
  settingsSchema: schema,
  defaultSettings: defaultSettings,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
