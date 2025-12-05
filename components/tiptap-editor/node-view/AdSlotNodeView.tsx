import Combobox from '@/components/form-fields/combobox'
import Select from '@/components/form-fields/select'
import Text from '@/components/form-fields/text'
import { getAllCampaigns } from '@/features/campaign/actions'
import { Campaign } from '@/features/campaign/interface'
import { Option } from '@/types'
import { NodeViewWrapper } from '@tiptap/react'
import { useEffect, useState } from 'react'

export default function AdSlotView({ node, updateAttributes }) {
  const {
    slotId,
    linkedCampaign,
    countOfBanners,
    direction,
    aspect,
    fallbackBehavior,
  } = node.attrs

  const [campaignOptions, setCampaignOptions] = useState<Option[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const [allCampaigns] = await Promise.all([getAllCampaigns()])
      const campaignOptions: Option[] = allCampaigns.data.map(
        (campaign: Campaign) => {
          return {
            value: String(campaign.id),
            label: campaign.title,
          }
        }
      )
      setCampaignOptions([
        { label: 'هیچکدام', value: 'none' },
        ...campaignOptions,
      ])
    }

    fetchData()
  }, [])

  // جلوگیری از بسته شدن سلکت‌ها
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const directionOptions: Option[] = [
    { label: 'افقی', value: 'row' },
    { label: 'عمودی', value: 'column' },
  ]
  const aspectOptions: Option[] = [
    { label: '1/1', value: '1/1' },
    { label: '4/1', value: '4/1' },
    { label: '10/1', value: '10/1' },
    { label: '20/1', value: '20/1' },
    { label: '30/1', value: '30/1' },
  ]
  const fallbackBehaviorOptions: Option[] = [
    { label: 'پیروی از تنظیمات عمومی سایت', value: 'inherit' },
    { label: 'نمایش یک بنر تصادفی', value: 'random' },
    { label: 'نمایش بنر پیش‌فرض', value: 'default_banner' },
    { label: 'عدم نمایش', value: 'hide' },
  ]

  return (
    <NodeViewWrapper
      className="ad-slot-node border p-3 rounded-md bg-muted/30 space-y-2"
      onClick={handleClick}
    >
      <div className="font-semibold mb-2">🪧 تنظیمات تابلو تبلیغاتی</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* کمپین متصل */}
        <Combobox
          title="کمپین متصل"
          name="linkedCampaign"
          defaultValue={linkedCampaign || ''}
          placeholder={`کمپین متصل`}
          options={campaignOptions}
          onChange={(e: any) => {
            updateAttributes({
              linkedCampaign: e.target.value,
            })
          }}
        />

        {/* تعداد بنرها */}
        <Text
          title="تعداد بنرها"
          name="countOfBanners"
          defaultValue={countOfBanners || 1}
          onChange={(e) => {
            updateAttributes({ countOfBanners: parseInt(e.target.value, 10) })
          }}
          value={countOfBanners || 0}
          onClick={handleClick} //  اطمینان از حفظ فوکوس
        />

        {/* جهت بنرها */}
        <Select
          title="جهت بنرها"
          name="direction"
          placeholder="جهت بنر را تعیین کنید"
          options={directionOptions}
          defaultValue={direction || 'row'}
          onChange={(value) => updateAttributes({ direction: value })}
        />

        {/* نسبت عرض به طول */}
        <Select
          title="نسبت عرض به طول بنر"
          name="aspect"
          placeholder="نسبت عرض به طول بنر"
          options={aspectOptions}
          defaultValue={aspect || '4/1'}
          onChange={(value) => updateAttributes({ aspect: value })}
        />

        {/* رفتار در صورت نبود تبلیغ */}
        <Select
          title="رفتار در صورت نبود تبلیغ"
          name="fallbackBehavior"
          placeholder="رفتار در صورت نبود تبلیغ"
          options={fallbackBehaviorOptions}
          defaultValue={fallbackBehavior || 'inherit'}
          onChange={(value) => updateAttributes({ fallbackBehavior: value })}
        />
      </div>
    </NodeViewWrapper>
  )
}
