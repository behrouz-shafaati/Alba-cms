// رجیستری مرکزی بلاک‌ها
// import { registerBlock } from '../../../lib/block/singletonBlockRegistry'
import { TextBlockDef } from '../shared-blocks/text'
import { RowBlockDef } from '../shared-blocks/row'
import { ImageBlockDef } from '../shared-blocks/image'
import { columnBlockDef } from '../shared-blocks/column'
import { ThemeModeSwitchBlockDef } from '../shared-blocks/theme-mode-switch'
import { UserNavBlockDef } from '../shared-blocks/user-nav'
import { ImageSliderBlockDef } from '../shared-blocks/imageSlider'
import { BlogPostSliderBlockDef } from '../shared-blocks/blogPostSlider'
import { MenuBlockDef } from '../shared-blocks/menu'
import { PostListBlockDef } from '../shared-blocks/postList'
import { ButtonBlockDef } from '../shared-blocks/button'
import { WriteBlockDef } from '../shared-blocks/write'
import { AdSlotBlockDef } from '../shared-blocks/AdSlot'
import { VideoPlaylistBlockDef } from '../shared-blocks/video-playlist'
import { TextInputBlockDef } from '../shared-blocks/text-input'
import { TextareaInputBlockDef } from '../shared-blocks/textarea-input'
import { SubmitButtonBlockDef } from '../shared-blocks/submitButton'
import { FormBlockDef } from '../shared-blocks/form'
import { SearchBlockDef } from '../shared-blocks/search'
export const blockRegistry = {
  row: RowBlockDef,
  column: columnBlockDef,
  text: TextBlockDef,
  image: ImageBlockDef,
  themeModdeSwitch: ThemeModeSwitchBlockDef,
  userNav: UserNavBlockDef,
  imageSlider: ImageSliderBlockDef,
  blogPostSlider: BlogPostSliderBlockDef,
  menu: MenuBlockDef,
  postList: PostListBlockDef,
  button: ButtonBlockDef,
  write: WriteBlockDef,
  adSlot: AdSlotBlockDef,
  videoPlaylist: VideoPlaylistBlockDef,
  textInput: TextInputBlockDef, // input [type=text]
  textareaInput: TextareaInputBlockDef,
  submitButton: SubmitButtonBlockDef,
  form: FormBlockDef,
  search: SearchBlockDef,
}

// registerBlock(blockRegistry)
