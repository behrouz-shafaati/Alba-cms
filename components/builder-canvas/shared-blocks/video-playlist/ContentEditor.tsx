// پنل تنظیمات برای این بلاک
'use client'
import React, { useEffect, useState } from 'react'
import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import MultipleSelector from '@/components/form-fields/multiple-selector'
import { Option } from '@/types'
import {
  Category,
  CategoryTranslationSchema,
} from '@/features/category/interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import { getAllCategories } from '@/features/category/actions'
import { getAllTags, searchTags } from '@/features/tag/actions'
import Text from '@/components/form-fields/text'
import { Tag, TagTranslationSchema } from '@/features/tag/interface'

type Props = {
  initialData: any
  savePage: () => void
}

export const ContentEditor = ({ initialData, savePage }: Props) => {
  const locale = 'fa'
  const { selectedBlock, update } = useBuilderStore()
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([])
  const [tagOptions, setTagOptions] = useState<Option[]>([])
  const [selectedTags, setSelectedTags] = useState<Option[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const [allCategories, allTags] = await Promise.all([
        getAllCategories(),
        getAllTags(),
      ])
      const categoryOptions: Option[] = allCategories.data.map(
        (category: Category) => {
          const translation: CategoryTranslationSchema =
            category?.translations?.find(
              (t: CategoryTranslationSchema) => t.lang === locale
            ) ||
            category?.translations[0] ||
            {}
          return {
            value: String(category.id),
            label: createCatrgoryBreadcrumb(category, translation?.title),
            slug: category.slug,
          }
        }
      )

      const tagOptions: Option[] = allTags.data.map((tag: Tag) => {
        const translation: TagTranslationSchema =
          tag?.translations?.find(
            (t: TagTranslationSchema) => t.lang === locale
          ) ||
          tag?.translations[0] ||
          {}
        return {
          value: String(tag.id),
          label: createCatrgoryBreadcrumb(tag, translation?.title),
          slug: tag.slug,
        }
      })
      setCategoryOptions(categoryOptions)
      setTagOptions(tagOptions)
    }

    fetchData()
    setSelectedTags(selectedBlock?.content?.tags ?? [])
  }, [selectedBlock?.content?.tags])

  return (
    <div key={categoryOptions.length}>
      <Text
        title="عنوان پلی لیست"
        name="title"
        defaultValue={selectedBlock?.content?.title}
        onChange={(e) => {
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            title: e.target.value,
          })
        }}
      />
      {/* categories */}
      <MultipleSelector
        title="دسته"
        name="categories"
        defaultValues={selectedBlock?.content?.categories ?? []}
        placeholder="دسته های هدف"
        defaultSuggestions={categoryOptions}
        onChange={(values) => {
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            categories: values,
          })
        }}
        // icon={ShieldQuestionIcon}
      />
      {/* tags */}
      <MultipleSelector
        title="برچسب"
        name="tags"
        defaultValues={selectedBlock?.content?.tags ?? []}
        placeholder="برچسب های هدف"
        defaultSuggestions={tagOptions}
        onChange={(values) => {
          update(selectedBlock?.id as string, 'content', {
            ...selectedBlock?.content,
            tags: values,
          })
        }}
        onSearch={searchTags}
        // icon={ShieldQuestionIcon}
      />
    </div>
  )
}
