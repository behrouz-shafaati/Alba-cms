import { FallbackBehaviorType } from '@/features/campaign/interface'

export type AdSlotWidgetProps = {
  pageSlug: string | null
  categorySlug: string | null
  widgetName: string
  blockData: {
    id: string
    type: 'adSlot'
    content: {
      title: string
      linkedCampaign: string | null
    }
    settings: {
      countOfBanners: number
      direction: 'column' | 'row'
      aspect: '1/1' | '4/1' | '10/1' | '20/1' | '30/1'
      placement:
        | 'all'
        | 'header'
        | 'sidebar'
        | 'footer'
        | 'home-hero'
        | 'content'
        | 'custom'
      fallbackBehavior: FallbackBehaviorType
    }
  }
}
