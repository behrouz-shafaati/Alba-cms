import { ContentBlock } from './ContentBlock'
import { contentBlockSchema } from './schema'
import { contentBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'
import { ContentEditorBlock } from './ContentEditorBlock'

export const ContentPostTableContentBlockDef = {
  type: 'content_post_tablecontent',
  label: 'فهرست مطالب',
  showInBlocksList: true,
  Renderer: ContentBlock,
  RendererInEditor: ContentEditorBlock,
  settingsSchema: contentBlockSchema,
  defaultSettings: contentBlockDefaults,
  ContentEditor: ContentEditor,
  inTemplateFor: ['post'],
}
