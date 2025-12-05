import validator from '@rjsf/validator-ajv8'
import { useBuilderStore } from '../store/useBuilderStore'
import { blockRegistry } from '../registry/blockRegistry'
import { useDebouncedCallback } from 'use-debounce'
import { TailwindForm } from '../../rjsf/shadcn-theme'
import { uiSchema } from '../../rjsf/uiSchema'

type BlockSettingsFormProps = {
  savePage: () => void
  newBlocks: any
}

export const BlockSettingsForm = ({
  savePage,
  newBlocks,
}: BlockSettingsFormProps) => {
  const { selectedBlock, update } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )

  if (!selectedBlock) return null
  const allBlocks = { ...blockRegistry, ...newBlocks }
  const schema = allBlocks[selectedBlock.type]?.settingsSchema
  const ContentEditor = allBlocks[selectedBlock.type]?.ContentEditor

  if (!schema && !ContentEditor)
    return <div>تنظیماتی برای این بلاک وجود ندارد.</div>

  return (
    <>
      {ContentEditor && (
        <ContentEditor
          key={`content-block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
          savePage={savePage}
        />
      )}
      <TailwindForm
        key={`settings-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        schema={schema}
        uiSchema={uiSchema}
        formData={selectedBlock.settings}
        validator={validator}
        onChange={(e) =>
          debouncedUpdate(selectedBlock.id, 'settings', e.formData)
        }
        showErrorList={false}
        omitExtraData
        noHtml5Validate
        liveValidate
        widgets={{}} // می‌تونی در آینده کاستوم‌سازی کنی
        templates={{
          //  حذف دکمه Submit
          ButtonTemplates: {
            SubmitButton: () => null,
          },
        }}
      />
    </>
  )
}
