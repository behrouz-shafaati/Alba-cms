import PostListBlock from './PostListBlock'
import PostListBlockEditor from './PostListBlockEditor'
import { PostListBlockSchema } from './schema'
import { blogPostSliderBlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const PostListBlockDef = {
  type: 'postList',
  label: 'لیست مطالب',
  showInBlocksList: true,
  Renderer: PostListBlock,
  RendererInEditor: PostListBlockEditor,
  settingsSchema: PostListBlockSchema,
  defaultSettings: blogPostSliderBlockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
