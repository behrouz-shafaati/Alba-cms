import { TextBlock } from './TextBlock'
import { textBlockSchema } from './schema'
import { textBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const TextBlockDef = {
  type: 'text',
  label: 'متن',
  showInBlocksList: true,
  Renderer: TextBlock,
  settingsSchema: textBlockSchema,
  defaultSettings: textBlockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
