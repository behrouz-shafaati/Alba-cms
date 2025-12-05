import { withTheme, FormProps } from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { TextWidget } from './widgets/TextWidget'
import { SelectWidget } from './widgets/SelectWidget'
import { ColorWidget } from './widgets/ColorWidget'
import { TailwindBgColorWidget } from './widgets/TailwindBgColorWidget'
import { CheckboxWidget } from './widgets/CheckboxWidget'
import { TextareaWidget } from './widgets/TextareaWidget'
import { NumberWidget } from './widgets/NumberWidget'
import { SliderWidget } from './widgets/SliderWidget'
import { FourSideBoxWidget } from './widgets/FourSideBoxWidget'
import { ShadowWidget } from './widgets/ShadowWidget'
import { TailwindTextColorPickerWidget } from './widgets/TailwindTextColorPickerWidget'
import IconPickerWidget from './widgets/IconPickerWidget'

const CustomFieldTemplate = ({
  id,
  classNames,
  label,
  children,
  errors,
  help,
}: any) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      {children}
      {errors}
      {help}
    </div>
  )
}

const CustomObjectFieldTemplate = ({ properties }: any) => {
  return <div>{properties.map((prop: any) => prop.content)}</div>
}

const CustomErrorList = () => null

export const CustomTheme = {
  widgets: {
    TextWidget, // ✅ این ویجت جایگزین ورودی متنی پیش‌فرض می‌شه
    SelectWidget,
    ColorWidget,
    TailwindBgColorWidget,
    TailwindTextColorPickerWidget,
    CheckboxWidget,
    TextareaWidget,
    NumberWidget,
    SliderWidget,
    IconPickerWidget,
  },
  fields: {
    PaddingWidget: (props) => (
      <FourSideBoxWidget
        value={props.formData}
        onChange={(val) => props.onChange(val)}
      />
    ),
    ShadowWidget: (props) => (
      <ShadowWidget
        value={props.formData}
        onChange={(val) => props.onChange(val)}
      />
    ),
  },
  templates: {
    FieldTemplate: CustomFieldTemplate,
    ObjectFieldTemplate: CustomObjectFieldTemplate,
    ErrorListTemplate: CustomErrorList,
  },
  validator,
}

export const TailwindForm = withTheme(CustomTheme)
