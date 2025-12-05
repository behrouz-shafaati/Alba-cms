import { Block } from './Block'
import { SettingsSchema } from './schema'
import { DefaultSettings } from './defaultSettings'
import { ContentEditor } from './ContentEditor'
import { BlockInEditor } from './BlockInEditor'

export const SubmitButtonBlockDef = {
  type: 'submitButton',
  label: 'دکمه ارسال',
  showInBlocksList: true,
  Renderer: Block,
  RendererInEditor: BlockInEditor,
  settingsSchema: SettingsSchema,
  defaultSettings: DefaultSettings,
  ContentEditor: ContentEditor,
  inTemplateFor: ['form'],
}
