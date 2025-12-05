export const SettingsSchema = {
  title: '',
  type: 'object',
  properties: {
    title: {
      title: 'عنوان',
      type: 'object',
      properties: {
        fa: { type: 'string', title: 'فارسی' },
        // en: { type: 'string', title: 'انگلیسی' },
        // de: { type: 'string', title: 'آلمانی' },
        // هر زبان دیگه‌ای هم می‌خوای اضافه کن
      },
      required: ['fa'],
      default: { fa: '' },
    },
    defaultValue: {
      title: 'مقدار پیش فرض',
      type: 'object',
      properties: {
        fa: { type: 'string', title: 'فارسی' },
      },
      required: ['fa'],
      default: { fa: '' },
    },
    description: {
      title: 'توضیح',
      type: 'object',
      properties: {
        fa: { type: 'string', title: 'فارسی' },
      },
      required: ['fa'],
      default: { fa: '' },
    },

    placeholder: {
      title: 'جایگذار',
      type: 'object',
      properties: {
        fa: { type: 'string', title: 'فارسی' },
      },
      required: ['fa'],
      default: { fa: '' },
    },
    icon: {
      type: 'string',
      title: 'آیکون',
      default: undefined,
    },
    readOnly: {
      title: 'مقدار ثابت',
      type: 'boolean',
      default: false,
    },
    required: {
      title: 'ضروری',
      type: 'boolean',
      default: false,
    },
  },
}
