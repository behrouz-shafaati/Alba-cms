import { userNavSchema } from './schema'
import { userNavDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'
import UserNavBlock from './UserNavBlock'

export const UserNavBlockDef = {
  type: 'userNav',
  label: 'حساب کاربری',
  showInBlocksList: true,
  Renderer: UserNavBlock,
  RendererInEditor: UserNavBlock,
  settingsSchema: userNavSchema,
  defaultSettings: userNavDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
