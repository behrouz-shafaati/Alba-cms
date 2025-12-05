import ThemeModeSwitch from './ThemeModeSwitch'
import { themeModdeSwitchSchema } from './schema'
import { themeModeSwitchDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const ThemeModeSwitchBlockDef = {
  type: 'themeModeSwitch',
  label: 'سوییچ حالت روشن/تیره',
  showInBlocksList: true,
  Renderer: ThemeModeSwitch,
  settingsSchema: themeModdeSwitchSchema,
  defaultSettings: themeModeSwitchDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
