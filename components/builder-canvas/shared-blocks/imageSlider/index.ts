import { ImageSliderBlock } from './ImageSliderBlock'
import { ImageSliderBlockSchema } from './schema'
import { imageSliderBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const ImageSliderBlockDef = {
  type: 'imageSlider',
  label: 'اسلایدر تصویر',
  showInBlocksList: true,
  Renderer: ImageSliderBlock,
  settingsSchema: ImageSliderBlockSchema,
  defaultSettings: imageSliderBlockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
