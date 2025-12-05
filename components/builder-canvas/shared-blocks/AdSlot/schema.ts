export const PostListBlockSchema = {
  title: '',
  type: 'object',
  properties: {
    countOfBanners: {
      type: 'number',
      title: 'تعداد بنرها',
      default: 1,
      minimum: 1,
    },
    direction: {
      type: 'string',
      title: 'جهت بنرها',
      enum: ['column', 'row'],
      default: 'row',
    },
    aspect: {
      type: 'string',
      title: 'نسبت عرض به طول بنر',
      enum: ['1/1', '4/1', '10/1', '20/1', '30/1'],
      default: '4/1',
    },
    placement: {
      type: 'string',
      title: 'محل نمایش در صفحه',
      enum: ['all', 'header', 'content', 'sidebar', 'footer'],
      default: 'all',
    },
    fallbackBehavior: {
      type: 'string',
      title: 'رفتار در صورت نبود تبلیغ',
      enum: ['inherit', 'random', 'default_banner', 'hide'],
      default: 'inherit',
    },
  },
}
