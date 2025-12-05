import { PostContent } from '@/components/post/content'
import RenderedHtml from '@/components/tiptap-editor/render/RenderedHtml.server'

type Props = { contentJson: any }

export default function CategoryDescription({ contentJson }: Props) {
  return <PostContent content={<RenderedHtml contentJson={contentJson} />} />
}
