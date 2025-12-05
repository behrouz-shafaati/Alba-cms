'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn, getTranslation } from '@/lib/utils'

const SEO_TITLE_LIMIT = 60
const META_DESC_LIMIT = 160

type Props = {
  defaultValues: any
  className?: string
}

export default function SeoSnippetForm({
  defaultValues,
  className = '',
}: Props) {
  const t = getTranslation({ translations: defaultValues?.translations })
  const [seoTitle, setSeoTitle] = useState(t?.seoTitle || '')
  const [slug, setSlug] = useState(defaultValues?.slug || '')
  const [metaDescription, setMetaDescription] = useState(
    t?.metaDescription || ''
  )

  const handleChangeSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    const slugified = val
      .toLowerCase()
      .trim()
      // ابتدا تمام فاصله‌ها و Tab و … → "-"
      .replace(/\s+/g, '-')
      // فقط حروف فارسی، انگلیسی، اعداد، "-" و "ـ" نگه داشته شوند
      .replace(/[^a-z0-9\u0600-\u06FF\-ـ]/g, '')
      // چند خط تیره پشت سر هم → "-"
      .replace(/[-ـ]+/g, '-')
      // حذف خط تیره از ابتدا و انتها
      .replace(/^-+|-+$/g, '')

    setSlug(slugified)
  }
  return (
    <div className={`space-y-6 ${className}`}>
      {/* SEO Title */}
      <div className="space-y-1">
        <Label htmlFor="seoTitle">عنوان سئو</Label>
        <Input
          id="seoTitle"
          name="seoTitle"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          maxLength={SEO_TITLE_LIMIT}
          placeholder="عنوان مطلب برای موتورهای جستجو"
        />
        <p
          className={cn(
            'text-xs text-gray-500 text-right',
            seoTitle.length > SEO_TITLE_LIMIT - 10 && 'text-yellow-600',
            seoTitle.length >= SEO_TITLE_LIMIT && 'text-red-600'
          )}
        >
          {seoTitle.length}/{SEO_TITLE_LIMIT} کاراکتر
        </p>
      </div>

      {/* Slug */}
      <div className="space-y-1">
        <Label htmlFor="slug">پیوند یکتا</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="مثلاً how-to-learn-math"
        />
        <p className="text-xs text-gray-500">
          از حروف کوچک، عدد و خط فاصله (-) استفاده کنید.
        </p>
      </div>

      {/* Meta Description */}
      <div className="space-y-1">
        <Label htmlFor="metaDescription">توضیح</Label>
        <Textarea
          id="metaDescription"
          name="metaDescription"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          maxLength={META_DESC_LIMIT}
          rows={3}
          placeholder="توضیح کوتاه برای نتایج جستجو..."
        />
        <p
          className={cn(
            'text-xs text-gray-500 text-right',
            metaDescription.length > META_DESC_LIMIT - 20 && 'text-yellow-600',
            metaDescription.length >= META_DESC_LIMIT && 'text-red-600'
          )}
        >
          {metaDescription.length}/{META_DESC_LIMIT} کاراکتر
        </p>
      </div>

      {/* پیش‌نمایش Google Snippet */}
      <Card className="border rounded-lg bg-white dark:bg-gray-950 shadow">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-200 ltr">
            Google Snippet Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-blue-600 dark:text-blue-400 text-lg truncate">
            {seoTitle || 'عنوان سئو'}
          </div>
          <div className="text-green-700 dark:text-green-500 text-sm">
            example.com/{slug || 'sample-slug'}
          </div>
          <div className="text-gray-700 text-sm line-clamp-2 dark:text-gray-300">
            {metaDescription ||
              'شرح مختصری از مطلب شما در اینجا نمایش داده می‌شود.'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
