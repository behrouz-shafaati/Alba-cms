// رجیستری مرکزی بلاک‌ها
// import { registerBlock } from '@/lib/block/singletonBlockRegistry'
import { blockRegistry as templateRegisterlock } from '@/components/builder-template/registry/blockRegistry'

export const templatePartblockRegistry = {
  // ...
}

export const blockRegistry = {
  ...templatePartblockRegistry,
  ...templateRegisterlock,
  // ...
}

// registerBlock(templatePartblockRegistry)
