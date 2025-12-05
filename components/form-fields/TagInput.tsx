'use client'

import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Label } from '../ui/label'
import { Option } from '@/types'
import { Tag, TagInput as EmblorTagInput } from './emblorTagInput'
import { truncate } from 'fs'

type TagProps = {
  title: string
  name: string
  id?: string
  type?: string
  defaultValues?: Option[]
  placeholder?: string
  description?: string
  icon?: any
  state?: any
  value?: string
  display?: boolean
  disabled?: boolean
  readOnly?: boolean
  className?: string
  restrictTagsToAutocompleteOptions?: boolean
  fetchOptions?: (query: string) => Promise<Option[]>
  suggestions?: Option[]
  enableAutocomplete?: boolean
  onChange?: (options: Option[]) => void
}

export default function TagInput({
  title,
  name,
  id,
  type,
  defaultValues,
  placeholder,
  description,
  icon,
  state,
  value,
  display = true,
  disabled = false,
  readOnly = false,
  className = '',
  restrictTagsToAutocompleteOptions = false,
  fetchOptions,
  suggestions: fixedSuggestions,
  enableAutocomplete = true,
  onChange,
}: TagProps) {
  const [tags, setTags] = useState<Tag[]>(
    defaultValues?.map((item) => ({
      text: item.label,
      id: item.value,
    })) || []
  )
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [inputValue, setInputValue] = useState<string>('')

  const debouncedSearch = useDebouncedCallback(async (q: string) => {
    if (!fetchOptions) return
    if (q.length === 0) return
    const result = await fetchOptions?.(q)
    setSuggestions(result.map((item) => ({ text: item.label, id: item.value })))
  }, 300)

  useEffect(() => {
    if (fetchOptions) debouncedSearch(inputValue)
    return () => debouncedSearch.cancel()
  }, [inputValue, debouncedSearch, fetchOptions])
  useEffect(() => {
    if (fixedSuggestions) {
      setSuggestions(
        fixedSuggestions.map((item) => ({ text: item.label, id: item.value }))
      )
    }
  }, [fixedSuggestions])

  if (!display) return null
  const errorMessages = state?.errors?.[name] ?? []
  const hasError = state?.errors?.[name]?.length > 0
  const InputIcon = typeof icon === 'object' ? () => icon : icon

  return (
    <div className={`mb-4 ${className}`}>
      <Label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </Label>
      <div className="relative shadow-none">
        <EmblorTagInput
          name={name}
          id={id}
          tags={tags}
          setTags={(newTags: Tag[]) => {
            setTags(newTags)
            onChange?.(
              newTags.map((tag) => {
                return { value: tag.id, label: tag.text }
              })
            )
          }}
          placeholder={placeholder || `افزودن ${title}`}
          onInputChange={(value) => {
            setInputValue(value)
          }}
          activeTagIndex={activeTagIndex}
          setActiveTagIndex={setActiveTagIndex}
          autocompleteOptions={suggestions}
          enableAutocomplete={enableAutocomplete}
          restrictTagsToAutocompleteOptions={restrictTagsToAutocompleteOptions}
          readOnly={readOnly}
          disabled={disabled}
          rtl={true}
        />
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500">
            <InputIcon />
          </span>
        )}
      </div>
      {description && (
        <span className="text-xs text-gray-500">{description}</span>
      )}
      {hasError && (
        <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
          {errorMessages.map((error: string) => (
            <p className="mt-2 text-xs text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
      )}
      <textarea
        name={name}
        value={JSON.stringify(
          tags.map((tag) => {
            return { value: tag.id, label: tag.text }
          })
        )}
        readOnly
        hidden
      />
    </div>
  )
}
//mr-[calc(100%-240px)]
