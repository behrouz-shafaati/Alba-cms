export const SettingsSchema = {
  title: '',
  type: 'object',
  properties: {
    label: {
      title: 'متن دکمه',
      type: 'object',
      properties: {
        fa: { type: 'string', title: 'فارسی' },
      },
      required: ['fa'],
      default: { fa: '' },
    },
  },
}
