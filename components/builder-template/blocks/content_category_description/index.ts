import { ContentBlock } from './ContentBlock'
import { contentBlockSchema } from './schema'
import { contentBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'
import { ContentEditorBlock } from './ContentEditorBlock'

export const ContentCategoryDescriptionBlockDef = {
  type: 'content_category_description',
  label: 'توضیحات دسته‌بندی',
  showInBlocksList: true,
  Renderer: ContentBlock,
  RendererInEditor: ContentEditorBlock,
  settingsSchema: contentBlockSchema,
  defaultSettings: contentBlockDefaults,
  ContentEditor: ContentEditor,
  inTemplateFor: ['categories', 'category'],
}
