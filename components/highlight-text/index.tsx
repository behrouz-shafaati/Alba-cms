//  متن را Highlight کن
const highlightText = (text: string, query: string) => {
  if (!query || text == '' || !text) return text
  const regex = new RegExp(`(${query})`, 'gi')
  const coleredtext = text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span
        key={index}
        className="bg-yellow-300 dark:bg-yellow-800 px-1 rounded"
      >
        {part}
      </span>
    ) : (
      part
    )
  )
  return coleredtext
}

export default highlightText
