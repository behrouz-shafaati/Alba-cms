export const textBlockSchema = {
  title: 'تنظیمات متن',
  type: 'object',
  properties: {
    fontSize: { type: 'number', title: 'اندازه فونت', default: 16 },
    tag: {
      type: 'string',
      title: 'تگ',
      enum: ['p', 'h6', 'h5', 'h4', 'h3', 'h2', 'h1'],
      default: 'p',
    },
    fontWeight: {
      type: 'string',
      title: 'ضخامت فونت',
      enum: ['normal', 'bold', 'lighter', 'bolder'],
      default: 'normal',
    },
    textAlign: {
      type: 'string',
      title: 'چینش',
      enum: ['left', 'center', 'right', 'justify'],
      default: 'center',
    },
  },
}
