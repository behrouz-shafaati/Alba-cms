import AdSlotBlockEditor from './AdSlotBlockEditor'
import { PostListBlockSchema } from './schema'
import { blogPostSliderBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'
import AdSlotBlockLazy from './AdSlotBlockLazy'

export const AdSlotBlockDef = {
  type: 'adSlot',
  label: 'جایگاه تبلیغات',
  showInBlocksList: true,
  Renderer: AdSlotBlockLazy,
  RendererInEditor: AdSlotBlockEditor,
  settingsSchema: PostListBlockSchema,
  defaultSettings: blogPostSliderBlockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
