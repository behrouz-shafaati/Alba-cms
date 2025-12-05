type VideoEmbedProps = {
  src: string
  title: string
}
export default function VideoEmbed({
  src,
  title,
  ...resProps
}: VideoEmbedProps) {
  const { className } = resProps
  return (
    <div
      style={{ position: 'relative', aspectRatio: 16 / 9 }}
      className={`rounded-xl shadow-md overflow-hidden ${className}`}
    >
      <iframe
        src={src}
        title={title || 'Embedded Video'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
