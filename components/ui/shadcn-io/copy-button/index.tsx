'use client'

import * as React from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer rounded-md transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-105 active:scale-95',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        muted: 'bg-muted text-muted-foreground',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      size: {
        default: 'size-8 rounded-lg [&_svg]:size-4',
        sm: 'size-6 [&_svg]:size-3',
        md: 'size-10 rounded-lg [&_svg]:size-5',
        lg: 'size-12 rounded-xl [&_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type CopyButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onCopy'
> &
  VariantProps<typeof buttonVariants> & {
    content?: string
    delay?: number
    onCopy?: (content: string) => void
    isCopied?: boolean
    onCopyChange?: (isCopied: boolean) => void
  }

function CopyButton({
  content,
  className,
  size,
  variant,
  delay = 3000,
  onClick,
  onCopy,
  isCopied,
  onCopyChange,
  ...props
}: CopyButtonProps) {
  const [localIsCopied, setLocalIsCopied] = React.useState(isCopied ?? false)
  const [isAnimating, setIsAnimating] = React.useState(false)

  React.useEffect(() => {
    setLocalIsCopied(isCopied ?? false)
  }, [isCopied])

  const handleIsCopied = React.useCallback(
    (copied: boolean) => {
      setLocalIsCopied(copied)
      onCopyChange?.(copied)
    },
    [onCopyChange]
  )

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (localIsCopied || isAnimating) return

      if (content) {
        // شروع انیمیشن
        setIsAnimating(true)

        navigator.clipboard
          .writeText(content)
          .then(() => {
            // بعد از یک delay کوتاه، آیکون را عوض کن
            setTimeout(() => {
              handleIsCopied(true)
              setIsAnimating(false)
            }, 75)

            // برگرداندن به حالت اول
            setTimeout(() => handleIsCopied(false), delay)
            onCopy?.(content)
          })
          .catch((error) => {
            console.error('Error copying command', error)
            setIsAnimating(false)
          })
      }
      onClick?.(e)
    },
    [
      localIsCopied,
      isAnimating,
      content,
      delay,
      onClick,
      onCopy,
      handleIsCopied,
    ]
  )

  return (
    <button
      data-slot="copy-button"
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={handleCopy}
      {...props}
    >
      <span
        data-slot="copy-button-icon"
        className={cn(
          'transition-transform duration-150',
          isAnimating && 'scale-0'
        )}
      >
        {localIsCopied ? <CheckIcon /> : <CopyIcon />}
      </span>
    </button>
  )
}

export { CopyButton, buttonVariants, type CopyButtonProps }
