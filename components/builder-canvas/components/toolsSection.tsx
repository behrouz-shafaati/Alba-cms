import { useBuilderStore } from '../store/useBuilderStore'
import CanvasTools from './CanvasTools'
import ToolsSectionBlock from './toolsSectionBlock'

type ToolsSectionProp = {
  settingsPanel: React.ReactNode
  savePage: () => void
  newBlocks?: any
}

export default function ToolsSection({
  settingsPanel,
  savePage,
  newBlocks = [],
}: ToolsSectionProp) {
  const selectedBlock = useBuilderStore((s) => s.selectedBlock)
  if (selectedBlock == null)
    return <CanvasTools settingsPanel={settingsPanel} newBlocks={newBlocks} />
  return <ToolsSectionBlock savePage={savePage} newBlocks={newBlocks} />
}
