// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '../../types'
import { computedStyles } from '../../utils/styleUtils'
import { Button } from '@/components/ui/button'
import { buttonBlockDefaults } from './defaultSettings'
import Link from 'next/link'
import IconRenderer from '../../components/IconRenderer'
import cn from '@/lib/utils/client/cn'

type ButtonBlockProps = {
  widgetName: string
  blockData: {
    content: {
      button: string
    }
    type: 'button'
    settings: {
      label: string
      href: string
      variant?: string
      size?: string
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ButtonBlock = ({
  widgetName,
  blockData,
  ...props
}: ButtonBlockProps) => {
  const { content, settings } = blockData
  const { className, ...resProps } = props
  return (
    <Button
      variant={settings?.variant || buttonBlockDefaults.settings.variant}
      size={settings?.size || buttonBlockDefaults.settings.size}
      className={cn(
        className || '',
        settings?.backgroundColor?.default || '',
        settings?.backgroundColor?.hover || '',
        settings?.backgroundColor?.focus || '',
        settings?.backgroundColor?.active || ''
      )}
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...resProps}
    >
      <Link
        href={settings?.href}
        className="flex flex-row gap-2 !text-inherit !no-underline !hover:no-underline"
      >
        {settings?.icon && settings?.iconPlace == 'before' && (
          <IconRenderer
            name={settings.icon || null}
            className={`w-5 h-5 ${settings?.iconColor}`}
          />
        )}
        <span className={`${settings.textColor}`}>{settings?.label}</span>
        {settings?.icon && settings?.iconPlace == 'after' && (
          <IconRenderer
            name={settings.icon || null}
            className={`w-5 h-5 ${settings?.iconColor}`}
          />
        )}
      </Link>
    </Button>
  )
}
