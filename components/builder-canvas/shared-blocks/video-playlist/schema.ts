export const BlockSchema = {
  title: 'تنظیمات دکمه',
  type: 'object',
  properties: {
    countOfVideos: {
      type: 'number',
      title: 'تعداد ویدیوها',
      default: 8,
      minimum: 1,
    },
  },
}
