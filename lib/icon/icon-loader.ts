// lib/icon-loader.ts
import dynamic from 'next/dynamic'
import { LucideProps } from 'lucide-react'
import { ComponentType } from 'react'

// کش برای جلوگیری از لود مجدد
const iconCache = new Map<string, ComponentType<LucideProps>>()

export async function loadIcon(
  name: string
): Promise<ComponentType<LucideProps> | null> {
  if (!name) return null

  // اگر قبلاً لود شده، از کش برگردان
  if (iconCache.has(name)) {
    return iconCache.get(name)!
  }

  try {
    // Dynamic import فقط آیکون مورد نیاز
    const module = await import(
      `lucide-react/dist/esm/icons/${toKebabCase(name)}.js`
    )
    const IconComponent = module.default || module[name]

    if (IconComponent) {
      iconCache.set(name, IconComponent)
      return IconComponent
    }
    return null
  } catch {
    console.warn(`Icon "${name}" not found`)
    return null
  }
}

// تبدیل PascalCase به kebab-case (مثلاً ArrowRight → arrow-right)
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}
