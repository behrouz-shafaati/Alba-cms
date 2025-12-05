import { NodeViewWrapper } from '@tiptap/react'

export default function VideoEmbedView({ node, updateAttributes }) {
  if (node.type === 'videoEmbed') {
    return (
      <NodeViewWrapper className="embed-video">
        <iframe
          key={Math.random()}
          src={node.attrs.src}
          width="560"
          height="315"
          loading="lazy"
          title="Embedded Video"
          allowFullScreen
          className="rounded-xl shadow-md w-full aspect-video"
        />
      </NodeViewWrapper>
    )
  }
  // ...
}
