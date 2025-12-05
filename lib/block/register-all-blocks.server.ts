'use server'
import { registerBlock } from './singletonBlockRegistry'

import { serverRenderBlockRegistry } from '@/components/builder-canvas/registry/blockRegistry.server'
import { serverRenderBuilderTemplateRegistry } from '@/components/builder-template/registry/blockRegistry.server'
import { serverRenderBuilderPageRegistry } from '@/components/builder-page/registry/blockRegistry.server'
import { serverRenderBuilderTemplatePartRegistry } from '@/components/builder-template-part/registry/blockRegistry.server'
import { serverRenderBuilderFormRegistry } from '@/components/builder-form/registry/blockRegistry.server'

export async function registerAllBlocks() {
  registerBlock(serverRenderBlockRegistry)
  registerBlock(serverRenderBuilderPageRegistry)
  registerBlock(serverRenderBuilderTemplateRegistry)
  registerBlock(serverRenderBuilderTemplatePartRegistry)
  registerBlock(serverRenderBuilderFormRegistry)
}
