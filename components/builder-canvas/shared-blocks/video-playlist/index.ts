import { Block } from './Block'
import { BlockSchema } from './schema'
import { BlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'
import { BlockInEditor } from './BlockInEditor'

export const VideoPlaylistBlockDef = {
  type: 'videoPlaylist',
  label: 'پخش ویدیو',
  showInBlocksList: true,
  Renderer: Block,
  RendererInEditor: BlockInEditor,
  settingsSchema: BlockSchema,
  defaultSettings: BlockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
