// import { TextBlock } from './TextBlock'
import blockSchema from './schema'
import { columnBlockDefaults } from './defaultSettings'
import ContentEditor from './ContentEditor'

export const columnBlockDef = {
  type: 'column',
  label: 'ستون',
  showInBlocksList: false,
  // Renderer: TextBlock,
  settingsSchema: blockSchema,
  defaultSettings: columnBlockDefaults,
  ContentEditor: ContentEditor,
}
