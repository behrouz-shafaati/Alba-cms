export const SettingsSchema = {
  title: '',
  type: 'object',
  properties: {
    title: {
      title: 'عنوان',
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
    rows: {
      type: 'number',
      title: 'تعداد خط',
      default: 4,
    },
    required: {
      title: 'ضروری',
      type: 'boolean',
      default: false,
    },
  },
}
