export default function extractExcerptFromContentJson(
  contentJson: string,
  wordCount = 20
): string {
  try {
    const content = JSON.parse(contentJson)

    if (!content || !Array.isArray(content.content)) return ''

    // بازگشتی متن‌ها رو از همه‌ی نودها می‌کشه بیرون
    function extractText(nodes: any[]): string[] {
      let texts: string[] = []

      for (const node of nodes) {
        if (node.type === 'text' && node.text) {
          texts.push(node.text)
        }
        if (Array.isArray(node.content)) {
          texts = texts.concat(extractText(node.content))
        }
      }

      return texts
    }

    const allTexts = extractText(content.content)
    const fullText = allTexts.join(' ').trim()
    const words = fullText.split(/\s+/).slice(0, wordCount).join(' ')

    return words + (fullText.split(/\s+/).length > wordCount ? '...' : '')
  } catch (err) {
    console.error('خطا در پردازش contentJson:', err)
    return ''
  }
}
