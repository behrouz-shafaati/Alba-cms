import { ImageBlock } from './ImageBlock'
import { ImageBlockSchema } from './schema'
import { imageBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const ImageBlockDef = {
  type: 'image',
  label: 'تصویر',
  showInBlocksList: true,
  Renderer: ImageBlock,
  settingsSchema: ImageBlockSchema,
  defaultSettings: imageBlockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
