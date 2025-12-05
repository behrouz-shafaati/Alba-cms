import { WriteBlock } from './WriteBlock.server'
import { writeBlockSchema } from './schema'
import { writeBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'
import { WriteEditorBlock } from './WriteBlockEditor'

export const WriteBlockDef = {
  type: 'write',
  label: 'نوشته',
  showInBlocksList: true,
  Renderer: WriteBlock,
  RendererInEditor: WriteEditorBlock,
  settingsSchema: writeBlockSchema,
  defaultSettings: writeBlockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
