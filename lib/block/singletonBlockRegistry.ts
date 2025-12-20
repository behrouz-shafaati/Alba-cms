import 'server-only'
// این فقط برای رندر در سمت سرور و برای رندر و نمایش به کابر کاربرد دارد.
//  بکارگیری آن در سمت کلایتت و صفحه سازها منجر به خطا می شود.
//  برای صفحه سازها مستقیم به صورت پراپ به کامپوننت ها پاس داده شود
// block-registry.ts
import { ComponentType } from 'react'

export type BlockDef<TSettings = any> = {
  type: string // کلید یکتا برای بلاک (مثلا 'text')
  label: string // برچسب برای نمایش در UI
  showInBlocksList: boolean // آیا در لیست بلاک‌ها نشون داده بشه؟
  Renderer: ComponentType<any> // کامپوننت برای رندر بلاک در صفحه
  settingsSchema: object // اسکیمای ولیدیشن برای تنظیمات بلاک
  defaultSettings: TSettings // مقادیر پیش‌فرض تنظیمات
  ContentEditor: ComponentType<any> // ادیتور محتوای بلاک
}

const blockRegistry: Record<string, BlockDef> = {}
let initialized = false
let initializing = false // برای thread-safe lock سبک

// تابع اصلی برای register بلاک‌ها، فقط بار اول اجرا می‌شود
export function ensureRegistryInitialized(init: () => void) {
  if (initialized) return
  if (initializing) return

  initializing = true
  init()
  Object.freeze(blockRegistry) // بعد از init بلاک‌ها immutable می‌شوند
  initialized = true
  initializing = false
}

// اضافه کردن بلاک‌ها به registry
export function registerBlock(blocks: Record<string, BlockDef>) {
  for (const key in blocks) {
    if (!blockRegistry[key]) {
      blockRegistry[key] = blocks[key]
      console.log(`#2b34 Block registered: ${key}`)
    } else {
      console.log(`#2b34 Block already exists: ${key}`)
    }
  }
}

// wrapper امن برای گرفتن registry
export function getBlocksSafe() {
  ensureRegistryInitialized(registerAllBlocks)
  return blockRegistry
}

// فقط import های server-only و registry بلاک‌ها
import { serverRenderBlockRegistry } from '@/components/builder-canvas/registry/blockRegistry.server'
import { serverRenderBuilderTemplateRegistry } from '@/components/builder-template/registry/blockRegistry.server'
import { serverRenderBuilderPageRegistry } from '@/components/builder-page/registry/blockRegistry.server'
import { serverRenderBuilderTemplatePartRegistry } from '@/components/builder-template-part/registry/blockRegistry.server'
import { serverRenderBuilderFormRegistry } from '@/components/builder-form/registry/blockRegistry.server'

// تابع واقعی که بلاک‌ها را register می‌کند
function registerAllBlocks() {
  registerBlock(serverRenderBlockRegistry)
  registerBlock(serverRenderBuilderPageRegistry)
  registerBlock(serverRenderBuilderTemplateRegistry)
  registerBlock(serverRenderBuilderTemplatePartRegistry)
  registerBlock(serverRenderBuilderFormRegistry)
}
