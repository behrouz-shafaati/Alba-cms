'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Direction from './extensions/extension-direction'
import { CustomTable } from './extensions/CustomTable'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Underline } from '@tiptap/extension-underline'
import { Heading } from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import { FileUploadRef } from '../form-fields/file-upload'
import { FileDetails } from '@/lib/entity/file/interface'
import DeleteImageWithKey from './extensions/image-delete'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AdSlot } from './extensions/adSlot'
import { VideoEmbed } from './extensions/VideoEmbed'

import styles from './editor.module.css'
import MenuBar from './menu-bar'
import { CustomImage } from './extensions/CustomImage'
import {
  Accordion,
  AccordionItem,
  AccordionItemContent,
  AccordionItemTitle,
} from './extensions/Accordion'
import { Faq } from './extensions/Faq'
import { getFiles } from '@/lib/entity/file/actions'
import FileUploadDialog from './component/FileUploadDialog'

interface TiptapEditor {
  name: string
  defaultContent?: { [key: string]: any }
  onChange?: (content: string) => void
  onChangeFiles?: () => void
  attachedFilesTo?: [{ feature: string; id: string }]
  className?: string
  onLoading?: (loading: boolean) => void
}

export default function TiptapEditor({
  name,
  defaultContent = {},
  onChange,
  onChangeFiles,
  attachedFilesTo = [],
  className = '',
  onLoading,
}: TiptapEditor) {
  const fileUploadRef = useRef<FileUploadRef>(null)
  const [content, SetContent] = useState(JSON.stringify(defaultContent))
  const [defaultFiles, setDefaultFiles] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  // for table tools like aadd row ...
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const handleContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('table')) {
      e.preventDefault()
      setPos({ x: e.clientX, y: e.clientY })
    } else {
      setPos(null)
    }
  }

  useEffect(() => {
    let active = true
    async function fetchData() {
      const defaultFileIds = JSON.parse(content)
        ?.content?.filter((block: any) => block.type === 'image')
        .map((block: any) => block.attrs.id)
      if (!defaultFileIds?.length) return
      try {
        const files = await getFiles(defaultFileIds)
        if (active) {
          setDefaultFiles(files.data)
        }
      } catch (err) {
        console.error('#2349875 Error fetching files:', err)
      }
    }
    fetchData()
    return () => {
      active = false
    }
  }, [content])

  const editor: any = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // 👈 اینجا heading داخل StarterKit رو خاموش کن
      }),
      Image,
      Link.configure({
        openOnClick: false,
        validate: (href) => /^https?:\/\//.test(href),
      }),
      Direction,
      Underline,
      Heading.configure({
        levels: [1, 2, 3, 4], // میتونی مشخص کنی چه level هایی رو ساپورت کنه
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      DeleteImageWithKey.configure({
        deleteFileHandler: (id: string) => {
          console.log('🗑 حذف از سرور:', id)
          fileUploadRef.current?.removeFileById(id)
        },
      }),
      CustomImage,
      CustomTable.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      AdSlot,
      Accordion,
      AccordionItem,
      AccordionItemContent,
      AccordionItemTitle,
      Faq,
      VideoEmbed,
    ],
    content: defaultContent,
    onUpdate({ editor }) {
      const json = editor?.getJSON()
      const text = JSON.stringify(json)
      SetContent(text)
      onChange?.(text)
    },
    immediatelyRender: false, //  مهم‌ترین بخش برای جلوگیری از SSR Hydration Error
  })
  const responseFileUploadHandler = useCallback(
    (fileDetails: FileDetails) => {
      console.log('#2345 fileDetails:', fileDetails)
      const { state, view } = editor
      const pos = state.selection.from
      editor
        ?.chain()
        .focus()
        .insertContentAt(pos, {
          type: 'image',
          attrs: {
            src: fileDetails.srcMedium,
            alt: fileDetails.id,
            title: String(fileDetails.id), // Image Id saved as title
            id: String(fileDetails.id),
          },
        })
        .setTextSelection(pos)
        .focus()
        .run()
      // requestAnimationFrame(() => {
      //   onChangeFiles?.()
      // })
    },
    [editor]
  )

  const fileUploadSettings = {
    name: `${name}Files`,
    defaultFiles,
    attachedFilesTo,
    responseFileUploadHandler,
    fileUploadRef,
    showDeleteButton: false,
    onChangeFiles,
    onLoading,
  }

  return (
    <div
      className="w-full"
      onClick={(e) => {
        const target = e.target as HTMLElement
        // اگر کلیک روی دکمه یا آیکون یا خود EditorContent بود کاری نکن
        if (target.closest('button') || target.closest('[data-no-focus]')) {
          return
        }
        editor?.chain().focus().run()
      }}
    >
      <textarea
        value={content}
        name={name}
        className="hidden w-full ltr"
        read-only="true"
        onChange={() => {}}
      />
      <MenuBar editor={editor} setShowGallery={setShowGallery} />
      {/* ثابت - هرگز unmount نمی‌شود */}
      <FileUploadDialog
        fileUploadSettings={fileUploadSettings}
        open={showGallery}
        onClose={setShowGallery}
      />
      <div
        onContextMenu={handleContextMenu}
        className={`${styles.editor} relative`}
      >
        <EditorContent
          editor={editor}
          autoFocus
          className={`prose prose-sm max-w-full outline-none focus:outline-none focus:ring-0 focus:border-transparent 
            focus-within:[&>div]:outline-none focus-within:[&>div]:ring-0 border p-4 rounded-lg bg-white dark:bg-neutral-900 ${className}`}
        />
        {process.env.NODE_ENV === 'development' && (
          <pre className="p-4 ltr bg-slate-300 mt-2 rounded">
            <code>{JSON.stringify(JSON.parse(content), null, 2)}</code>
          </pre>
        )}
      </div>
    </div>
  )
}

/**
 * آپدیت کردن attrs تصاویر داخل JSON با توجه به لیست فایل‌ها
 */
export function replaceImageNodes(contentJson: any, files: FileDetails[]) {
  if (!contentJson || !Array.isArray(files)) return contentJson

  const fileMap = new Map(files.map((f) => [String(f.id), f]))

  function updateNode(node: any): any {
    if (!node) return node

    // اگر نود از نوع تصویر است
    if (node.type === 'image' && node.attrs?.id) {
      const file = fileMap.get(String(node.attrs.id))

      if (file) {
        return {
          ...node,
          attrs: {
            ...file,
          },
        }
      }
    }

    // بازگشتی روی بچه‌ها
    if (Array.isArray(node.content)) {
      return {
        ...node,
        content: node.content.map(updateNode),
      }
    }

    return node
  }

  return updateNode(contentJson)
}

const updateFileDetails = (editor: any, fileDetails: FileDetails[]) => {
  if (!editor) {
    console.warn('#98765 Editor is not ready yet.')
    return
  }
  console.warn('#98765 fileDetails:', fileDetails)

  if (!fileDetails || fileDetails.length === 0) {
    return
  }

  const fileMap = new Map<string, FileDetails>(
    fileDetails.map((f) => [String(f.id), f])
  )

  editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      state.doc.descendants((node, pos) => {
        // فقط نودهای image با id معتبر
        if (node.type.name !== 'image' || !node.attrs?.id) return

        const file = fileMap.get(String(node.attrs.id))
        if (!file) return

        // اینجا تعیین می‌کنی کدوم فیلدهای attrs باید از FileDetails آپدیت بشه
        const newAttrs = {
          ...file,
        }

        tr.setNodeMarkup(pos, node.type, newAttrs)
      })

      // حتماً true برگردون تا command موفق تلقی بشه
      return true
    })
    .run()
}
