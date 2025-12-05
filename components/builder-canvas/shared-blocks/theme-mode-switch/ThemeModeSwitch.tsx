'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import cn from '@/lib/utils/client/cn'
import { computedStyles } from '../../utils/styleUtils'

export default function ThemeToggle({ blockData, ...props }: any) {
  const { className = '', ...restProps } = props || {}
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  function applyTheme(t: 'light' | 'dark') {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(t)
    document.cookie = `theme=${t}; path=/; max-age=31536000`
  }

  function toggle() {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return (
    <div
      className={className}
      style={{
        ...computedStyles(blockData?.styles),
      }}
      {...restProps}
    >
      <button
        onClick={toggle}
        className={cn(
          'relative flex items-center justify-center',
          'p-2 rounded-xl transition-all duration-300',
          'bg-white/60 dark:bg-neutral-800/60',
          'backdrop-blur-md shadow-sm hover:shadow-md',
          'border border-neutral-200 dark:border-neutral-700',
          'hover:bg-white dark:hover:bg-neutral-700'
        )}
      >
        {/* SUN */}
        <Sun
          size={20}
          className={cn(
            'absolute transition-all duration-300 transform',
            theme === 'light'
              ? 'opacity-100 scale-100 rotate-0'
              : 'opacity-0 scale-0 -rotate-90'
          )}
        />

        {/* MOON */}
        <Moon
          size={20}
          className={cn(
            'absolute transition-all duration-300 transform',
            theme === 'dark'
              ? 'opacity-100 scale-100 rotate-0'
              : 'opacity-0 scale-0 rotate-90'
          )}
        />
      </button>
    </div>
  )
}
