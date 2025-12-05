import React from 'react'
import Text from '../form-fields/text'
import { HeadingIcon, MailIcon } from 'lucide-react'
import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'

function SettingsPanel() {
  const { update, getJson } = useBuilderStore()
  const json = JSON.parse(getJson())
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )
  return (
    <>
      <Text
        title="عنوان"
        name="title"
        defaultValue={JSON.parse(getJson()).title || ''}
        placeholder="عنوان"
        icon={<HeadingIcon className="h-4 w-4" />}
        className=""
        onChange={(e) => debouncedUpdate(null, 'title', e.target.value)}
      />
    </>
  )
}

export default SettingsPanel
