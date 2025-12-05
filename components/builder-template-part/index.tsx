import BuilderCanvas from '../builder-canvas'
import SettingsPanel from './SettingsPanel'
import { blockRegistry } from './registry/blockRegistry'

type BuilderHeadreProps = {
  name: string
  submitFormHandler: (prevState: any, formData: FormData) => Promise<any>
  initialContent?: any
}

const BuilderTemplatePart = ({
  name = 'contentJson',
  submitFormHandler,
  initialContent,
}: BuilderHeadreProps) => {
  return (
    <BuilderCanvas
      title="سربرگ ساز"
      name={name}
      initialContent={initialContent}
      settingsPanel={<SettingsPanel />}
      submitFormHandler={submitFormHandler}
      newBlocks={blockRegistry}
    />
  )
}

export default BuilderTemplatePart
