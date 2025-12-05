'use server'
// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import Menu from './Menu'
import { getMenus } from '@/features/menu/actions'

type MenuBlockProps = {
  widgetName: string
  blockData: {
    content: { menuId: string }
    type: 'menu'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default async function MenuBlock({
  widgetName,
  blockData,
  ...props
}: MenuBlockProps) {
  const { content } = blockData

  const result = await getMenus({
    filters: { id: content.menuId },
  })

  const menu = result.data?.[0] ?? null

  // فقط داده‌ی ساده به Menu پاس بده
  return menu ? (
    <Menu
      menu={menu}
      {...props}
      blockData={blockData}
      widgetName={widgetName}
    />
  ) : null
}
