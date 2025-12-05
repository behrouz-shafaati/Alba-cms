'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { HeadingItem } from '../tiptap-editor/utils'

type Props = { toc: HeadingItem[] }

function renderTree(items: HeadingItem[], level = 0) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.id} style={{ paddingRight: level * 16 }}>
          <Link
            href={`#${item.id}`}
            className="
            text-sm
              block pr-2 py-1
              rounded-lg
              transition-colors duration-200
              text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-700
              hover:text-gray-900 dark:hover:text-white
            "
          >
            {item.text}
          </Link>

          {item.children.length > 0 && renderTree(item.children, level + 1)}
        </li>
      ))}
    </ul>
  )
}

export default function TableOfContents({ toc }: Props) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0)
    }
  }, [open, toc])

  if (!toc || toc.length === 0) return null

  return (
    <nav
      className="
        border border-gray-200 dark:border-gray-700
        rounded-xl bg-white dark:bg-gray-800
        shadow-sm
        my-4
      "
      dir="rtl"
    >
      <button
        className="flex justify-between w-full items-center font-semibold text-lg text-gray-900 dark:text-gray-100 p-4 focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <span>فهرست مطالب</span>

        {/* آیکون شیک chevron */}
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        ref={contentRef}
        style={{
          height: height === 'auto' ? 'auto' : height,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div className="p-4 pt-0">{renderTree(toc)}</div>
      </div>
    </nav>
  )
}
