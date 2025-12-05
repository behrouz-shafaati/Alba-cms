import { ContentBlock } from './ContentBlock'
import { contentBlockSchema } from './schema'
import { contentBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'
import { ContentEditorBlock } from './ContentEditorBlock'

export const ContentPostTitleBlockDef = {
  type: 'content_post_title',
  label: 'عنوان مطلب',
  showInBlocksList: true,
  Renderer: ContentBlock,
  RendererInEditor: ContentEditorBlock,
  settingsSchema: contentBlockSchema,
  defaultSettings: contentBlockDefaults,
  ContentEditor: ContentEditor,
  inTemplateFor: ['post'],
}
