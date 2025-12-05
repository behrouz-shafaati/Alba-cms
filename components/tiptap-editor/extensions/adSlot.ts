import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import AdSlotView from '../node-view/AdSlotNodeView'
import { generateObjectId } from '@/lib/utils/generateObjectId'

export const AdSlot = Node.create({
  name: 'adSlot',
  group: 'block',
  atom: true, // یعنی خودش یک بلاک مستقل هست و محتوا نداره

  addAttributes() {
    return {
      slotId: {
        default: generateObjectId(),
        parseHTML: (element) => element.getAttribute('data-slot-id'),
        renderHTML: (attrs) =>
          attrs.slotId ? { 'data-slot-id': attrs.slotId } : {},
      },
      linkedCampaign: {
        default: 'none',
        parseHTML: (el) => el.getAttribute('data-linkedCampaign'),
        renderHTML: (attrs) =>
          attrs.linkedCampaign
            ? { 'data-linkedCampaign': attrs.linkedCampaign }
            : {},
      },
      countOfBanners: {
        default: 1,
        parseHTML: (el) =>
          parseInt(el.getAttribute('data-banner-count') || '1', 10),
        renderHTML: (attrs) => ({
          'data-banner-count': attrs.countOfBanners,
        }),
      },
      direction: {
        default: 'row', // یا vertical
        parseHTML: (el) => el.getAttribute('data-banner-direction'),
        renderHTML: (attrs) =>
          attrs.bannerDirection
            ? { 'data-banner-direction': attrs.bannerDirection }
            : {},
      },
      aspect: {
        default: '4/1',
        parseHTML: (el) => el.getAttribute('data-aspect-ratio'),
        renderHTML: (attrs) =>
          attrs.aspectRatio ? { 'data-aspect-ratio': attrs.aspectRatio } : {},
      },
      fallbackBehavior: {
        default: 'inherit',
        parseHTML: (el) => el.getAttribute('data-fallback-behavior'),
        renderHTML: (attrs) =>
          attrs.fallbackBehavior
            ? { 'data-aspect-ratio': attrs.fallbackBehavior }
            : {},
      },
    }
  },

  parseHTML() {
    return [{ tag: 'ad-slot' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['ad-slot', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AdSlotView)
  },
})
