import FormBlock from './Block'
import { BlockSchema } from './schema'
import { defaultSettings } from './defaultSettings'
import { ContentEditor } from './ContentEditor'
import { FormBlockEditor } from './BlockInEditor'

export const FormBlockDef = {
  type: 'form',
  label: 'فرم',
  showInBlocksList: true,
  Renderer: FormBlock,
  RendererInEditor: FormBlockEditor,
  settingsSchema: BlockSchema,
  defaultSettings: defaultSettings,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
