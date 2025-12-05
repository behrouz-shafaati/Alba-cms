import AdSlotBlock from './AdSlotBlock'
import AdSlotBlockEditor from './AdSlotBlockEditor'
import { PostListBlockSchema } from './schema'
import { blogPostSliderBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const AdSlotBlockDef = {
  type: 'adSlot',
  label: 'جایگاه تبلیغات',
  showInBlocksList: true,
  Renderer: AdSlotBlock,
  RendererInEditor: AdSlotBlockEditor,
  settingsSchema: PostListBlockSchema,
  defaultSettings: blogPostSliderBlockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
