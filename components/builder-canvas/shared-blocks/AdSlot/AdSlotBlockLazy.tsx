import AdSlotBlockLazy_1_1 from './AdSlotBlockLazy-1-1'
import AdSlotBlockLazy_10_1 from './AdSlotBlockLazy-10-1'
import AdSlotBlockLazy_20_1 from './AdSlotBlockLazy-20-1'
import AdSlotBlockLazy_30_1 from './AdSlotBlockLazy-30-1'
import AdSlotBlockLazy_4_1 from './AdSlotBlockLazy-4-1'

export default function AdSlotBlockLazy(props) {
  const aspect = props?.blockData?.settings?.aspect
  switch (aspect) {
    case '1/1':
      return <AdSlotBlockLazy_1_1 {...props} />
    case '4/1':
      return <AdSlotBlockLazy_4_1 {...props} />
    case '10/1':
      return <AdSlotBlockLazy_10_1 {...props} />
    case '20/1':
      return <AdSlotBlockLazy_20_1 {...props} />
    case '30/1':
      return <AdSlotBlockLazy_30_1 {...props} />
    default:
      return <AdSlotBlockLazy_1_1 {...props} />
  }
}
