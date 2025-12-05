'use client'

import React, {
  useCallback,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

import {
  Bold,
  Italic,
  Strikethrough,
  Link as LinkIcon,
  Send,
  Trash2,
  AtSign,
  Smile,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CustomMention } from '@/components/tiptap-editor/extensions/custom-mention'
import EmojiPicker from '@/components/ui/emoji-picker'

export interface CommentEditorRef {
  clear: () => void
}

type CommentEditorProps = {
  name: string
  placeholder?: string
  initialContent?: JSONContent
  onSubmit?: (json: JSONContent) => Promise<void> | void
  className?: string
  isPending: boolean
}

const CommentEditor = forwardRef<CommentEditorRef, CommentEditorProps>(
  (
    {
      name,
      placeholder = '',
      initialContent,
      onSubmit,
      className = '',
      isPending,
    },
    ref
  ) => {
    const [submitting, setSubmitting] = useState(false)
    const [content, setContent] = useState(JSON.stringify({}))

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: false,
          codeBlock: false,
          blockquote: false,
        }),
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder }),
        CustomMention.configure({
          HTMLAttributes: {
            class:
              'bg-blue-100 text-blue-700 px-1 rounded cursor-pointer hover:underline',
          },
        }),
      ],
      content: initialContent ?? null,
      editorProps: {
        attributes: {
          class:
            'prose prose-sm max-w-full focus:outline-none placeholder:text-muted-foreground p-0',
        },
      },
      onUpdate({ editor }) {
        const json = editor?.getJSON()
        const text = JSON.stringify(json)
        setContent(text)
      },
      immediatelyRender: false,
    })

    const clear = useCallback(() => {
      editor?.commands.clearContent(true)
    }, [editor])

    const submit = useCallback(async () => {
      if (!editor || !onSubmit) return
      const json = editor.getJSON()
      const text = editor.state.doc.textContent.trim()
      if (!text) return
      try {
        setSubmitting(true)
        await onSubmit(json)
      } finally {
        clear()
        setSubmitting(false)
      }
    }, [editor, onSubmit, clear])

    // Ctrl/Cmd + Enter → ارسال
    useEffect(() => {
      if (!editor || !onSubmit) return

      const handler = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault()
          submit()
        }
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }, [editor, submit])

    const toggleMark = (mark: 'bold' | 'italic' | 'strike') => {
      if (!editor) return
      if (mark === 'bold') editor.chain().focus().toggleBold().run()
      if (mark === 'italic') editor.chain().focus().toggleItalic().run()
      if (mark === 'strike') editor.chain().focus().toggleStrike().run()
    }

    const insertLink = () => {
      if (!editor) return
      const url = prompt('آدرس لینک:')
      if (!url) return
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    }

    useImperativeHandle(ref, () => ({
      clear: () => {
        editor?.commands.clearContent()
      },
    }))
    return (
      <div
        id="comment-editor-wraper"
        onClick={(e) => {
          const target = e.target as HTMLElement
          // اگر کلیک روی دکمه یا آیکون یا خود EditorContent بود کاری نکن
          if (target.closest('button') || target.closest('[data-no-focus]')) {
            return
          }
          editor?.chain().focus().run()
        }}
        className="!mt-0"
      >
        <textarea
          name={name}
          value={content}
          readOnly
          onChange={() => {
            console.log('change')
          }}
          className="hidden"
        />
        <TooltipProvider>
          <div
            className={`border md:rounded-2xl p-3 bg-white dark:bg-neutral-900 md:shadow-sm ${className} `}
          >
            {/* editor */}
            <div className="min-h-[2.5rem] max-h-48 overflow-auto">
              <EditorContent editor={editor} />
            </div>

            {/* toolbar */}
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <EmojiPicker
                  onSelect={(emoji) => {
                    editor.chain().focus().insertContent(emoji).run()
                  }}
                />

                <Separator orientation="vertical" className="mx-1 h-5" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      role="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleMark('bold')}
                    >
                      <Bold size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      role="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleMark('italic')}
                    >
                      <Italic size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      role="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleMark('strike')}
                    >
                      <Strikethrough size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Strikethrough</TooltipContent>
                </Tooltip>

                {/* <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  role="button"
                  size="icon"
                  variant="ghost"
                  onClick={insertLink}
                >
                  <LinkIcon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>لینک</TooltipContent>
            </Tooltip> */}
              </div>

              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      role="button"
                      size="icon"
                      variant="ghost"
                      onClick={clear}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>پاک کردن</TooltipContent>
                </Tooltip>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="ml-2 rounded-full"
                >
                  {!isPending ? (
                    <Send size={14} className="" />
                  ) : (
                    <Loader2 className={'h-4 w-4 animate-spin'} />
                  )}
                </Button>
              </div>
            </div>

            {/* <div className="mt-1 text-xs text-muted-foreground">
          ارسال با ⌘/Ctrl + Enter
        </div> */}
          </div>
        </TooltipProvider>
      </div>
    )
  }
)

CommentEditor.displayName = 'CommentEditor'

export default CommentEditor
