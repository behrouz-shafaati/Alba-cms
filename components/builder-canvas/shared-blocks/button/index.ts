import { ButtonBlock } from './ButtonBlock'
import { buttonBlockSchema } from './schema'
import { buttonBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const ButtonBlockDef = {
  type: 'button',
  label: 'دکمه',
  showInBlocksList: true,
  Renderer: ButtonBlock,
  settingsSchema: buttonBlockSchema,
  defaultSettings: buttonBlockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
