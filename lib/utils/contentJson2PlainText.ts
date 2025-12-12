export default function contentJson2PlainText(constentJson: Object) {
  const plainText =
    constentJson.content
      ?.filter((block: any) => block.type === 'paragraph')
      ?.map((block: any) =>
        block.content?.map((c: any) => c.text || '').join('')
      )
      .join('\n') || ''
  return plainText
}
