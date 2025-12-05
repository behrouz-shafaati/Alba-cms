// انواعی از بلوک‌ها که ورودی محسوب می‌شن:
const INPUT_TYPES = [
  'textInput',
  'textareaInput',
  'selectInput',
  'checkboxInput',
  'radioInput',
]
/**
 *
 * @param form contentJson from form builder
 * @returns
 */
export function extractFieldsFromFormContent(form: any): string[] {
  const fields: any[] = []

  for (const row of form.rows || []) {
    for (const col of row.columns || []) {
      for (const block of col.blocks || []) {
        if (INPUT_TYPES.includes(block.type)) {
          if (INPUT_TYPES.includes(block.type)) {
            const c = block.content || {}
            const s = block.settings || {}
            console.log('$#%#$5$#% swerwer:', s)
            // تبدیل نوع بلاک به نوع HTML استاندارد
            const typeMap: Record<string, string> = {
              textInput: 'text',
              textareaInput: 'textarea',
              emailInput: 'email',
              numberInput: 'number',
              selectInput: 'select',
              checkboxInput: 'checkbox',
              radioInput: 'radio',
              dateInput: 'date',
            }

            fields.push({
              label: s?.title || s?.label || { fa: 'بدون عنوان' },
              name: s.name || block.id, // اگه کاربر نام نداد، از id استفاده می‌کنیم
              type: typeMap[block.type] || 'text',
              options: c?.options || [],
              required: !!s.required,
              placeholder: s?.placeholder || { fa: '' },
              description: s?.description || { fa: '' },
              defaultValue: s?.defaultValue || { fa: '' },
            })
          }
        }
      }
    }
  }

  return fields
}
