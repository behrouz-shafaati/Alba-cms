import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlockSettingsForm } from '../settings-panel/BlockSettingsForm'
import { PublicStylesForm } from '../settings-panel/SharedStylesPanel'
import { useBuilderStore } from '../store/useBuilderStore'
import BackButton from '@/components/ui/backButton'

type ToolsSectionBlockProps = {
  savePage: () => void
  newBlocks: any
}

export default function ToolsSectionBlock({
  savePage,
  newBlocks,
}: ToolsSectionBlockProps) {
  const { deselectBlock, selectedBlock } = useBuilderStore()
  return (
    <Tabs defaultValue="special-settings" className="rtl relative min-h-screen">
      <TabsList className="sticky top-0 w-full z-10">
        <BackButton onClick={deselectBlock} />
        <TabsTrigger value="special-settings">اختصاصی</TabsTrigger>
        <TabsTrigger value="public-settings">عمومی</TabsTrigger>
      </TabsList>
      <TabsContent value="special-settings" className="p-4">
        <BlockSettingsForm savePage={savePage} newBlocks={newBlocks} />
      </TabsContent>
      <TabsContent value="public-settings" className="p-4">
        <PublicStylesForm />
      </TabsContent>
    </Tabs>
  )
}
