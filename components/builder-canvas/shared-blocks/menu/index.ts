import MenuBlock from './MenuBlock'
import { MenuBlockSchema } from './schema'
import { menuBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'
import { MenuBlockEditor } from './MenuBlockEditor'

export const MenuBlockDef = {
  type: 'menu',
  label: 'فهرست',
  showInBlocksList: true,
  Renderer: MenuBlock,
  RendererInEditor: MenuBlockEditor,
  settingsSchema: MenuBlockSchema,
  defaultSettings: menuBlockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
