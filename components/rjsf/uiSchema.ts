export const uiSchema = {
  color: {
    'ui:widget': 'ColorWidget',
  },
  backgroundColor: {
    'ui:widget': 'TailwindBgColorWidget',
  },
  textColor: {
    'ui:widget': 'TailwindTextColorPickerWidget',
  },
  iconColor: {
    'ui:widget': 'TailwindTextColorPickerWidget',
  },
  isPublished: {
    'ui:widget': 'CheckboxWidget',
  },
  description: {
    'ui:widget': 'TextareaWidget',
  },
  quantity: {
    'ui:widget': 'NumberWidget',
  },
  opacity: {
    'ui:widget': 'SliderWidget',
  },
  padding: {
    'ui:field': 'PaddingWidget',
  },
  margin: {
    'ui:field': 'PaddingWidget',
  },
  borderRadius: {
    'ui:field': 'PaddingWidget',
  },
  'box-shadow': {
    'ui:field': 'ShadowWidget',
  },
  icon: {
    'ui:widget': 'IconPickerWidget',
  },
  className: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5,
      placeholder: 'مثلاً: flex gap-4 justify-center items-center',
    },
  },
}
